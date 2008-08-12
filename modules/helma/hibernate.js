/**
 * Module for using Hibernate as ORM/persistence layer.
 */

importJar('hibernate/antlr-2.7.6.jar');
importJar('hibernate/asm-attrs.jar');
importJar('hibernate/asm.jar');
importJar('hibernate/cglib-2.1.3.jar');
importJar('hibernate/commons-collections-2.1.1.jar');
importJar('hibernate/commons-logging-1.0.4.jar');
importJar('hibernate/dom4j-1.6.1.jar');
importJar('hibernate/hibernate3.jar');
importJar('hibernate/jta.jar');
importJar('hibernate/c3p0-0.9.1.jar');
importJar('hibernate/ehcache-1.2.3.jar');

importModule('helma.rhino', 'rhino');
importFromModule('helma.functional', 'partial');
importModule('helma.logging', 'logging');
var log = logging.getLogger(__name__);

var __shared__ = true;

// used to determine whether config should be re-built on each request
var isDevEnvironment = false;

// used to get paths of hibernate.properties and mapping files
var configPropsFileName     = 'hibernate.properties';
var mappingsDirRelativePath = 'mappings';

// used for holding the Store instance
var store;
this.initStore();


(function () {

   var isConfigured = false;
   var config, sessionFactory;


   /**
    * Adds Rhino callbacks for binding Hibernate
    * DB session transactions to request scope;
    * call this in the main function of an app.
    */
   this.addTxnCallbacks = function () {

      rhino.addCallback('onRequest', 'beginHibernateTxn', function () {
         beginTxn();
      });

      rhino.addCallback('onResponse', 'commitHibernateTxn', function () {
         commitTxn();
      });
   };


   /**
    * Begins a Hibernate Session transaction.
    */
   this.beginTxn = function () {
      try {
         var sess = getSession();
         var txn = sess.beginTransaction();
      } catch (e) {
         txn.rollback();
         log.error('in onRequest beginHibernateTxn callback: ' + e.toString());
      }
   };


   /**
    * Commits a Hibernate Session transaction.
    */
   this.commitTxn = function () {
      try {
         var sess = sessionFactory.getCurrentSession();
         var txn = sess.getTransaction();
         txn.commit();
      } catch (e) {
         txn.rollback();
         log.error('in onResponse commitHibernateTxn callback: ' + e.toString());
      }
   };


   /**
    * Gets a Hibernate DB session.
    */
   this.getSession = function () {
      if (isDevEnvironment || !isConfigured) {
         setConfig();
      }

      return sessionFactory.getCurrentSession();
   };


   /**
    * Sets the basic Hibernate configuration.
    */
   var setConfig = function () {
      var mappingsDirAbsolutePath = getResource(mappingsDirRelativePath).path;
      var configPropsAbsolutePath = getResource(configPropsFileName).path;
      var configPropsFile = new java.io.File(configPropsAbsolutePath);
      var fileInputStream = new java.io.FileInputStream(configPropsFile);
      var configProps = new java.util.Properties();

      // load hibernate.properties
      configProps.load(fileInputStream);
      fileInputStream.close();

      // set configuration
      config = new org.hibernate.cfg.Configuration();
      // add mappings dir
      config.addDirectory(new java.io.File(mappingsDirAbsolutePath));
      // set properties from hibernate.properties file
      config.setProperties(configProps);
      // use dynamic-map entity persistence mode
      config.setProperty('hibernate.default_entity_mode', 'dynamic-map');
      // transactions are handled by JDBC, no JTA is used
      config.setProperty('hibernate.transaction.factory_class',
                         'org.hibernate.transaction.JDBCTransactionFactory');
      // enable session binding to managed context
      config.setProperty('hibernate.current_session_context_class', 'thread');
      // enable the second level cache
      config.setProperty('hibernate.cache.use_second_level_cache', 'true');
      config.setProperty('hibernate.cache.use_query_cache', 'true');
      // use easy hibernate (eh) cache
      config.setProperty('hibernate.cache.provider_class',
                         'net.sf.ehcache.hibernate.SingletonEhCacheProvider');

      isConfigured = true;
      log.info('Configuration set.');

      sessionFactory = config.buildSessionFactory();

      return;
   };


   /**
    * Used for decorating model objects with save() and remove() DAO convenience methods.
    */
   this.addDaoMethods = function (object) {

      object.save = function () {
         store.save(object);
      };

      object.remove = function () {
         store.remove(object);
      };

      return object;
   };

   /**
    * Used for decorating model objects, fetched from DB, with resp. instance methods.
    */
   this.addInstanceMethods = function (object) {
      var constructor = store.getTypeRegistry()[object.$type$];
      var instance = new constructor();

      for (var i in instance) {
         if (i != '$type$') {
            object[i] = instance[i];
         }
      }

      return this.addDaoMethods(object);
   };

}).call(this);


/**
 * Generic constructor, wrapping model prototypes into (decorated) ScriptableMap objects.
 */
function Storable(object, properties) {
   if (!(object instanceof Object) || !(object.constructor instanceof Function)) {
      throw new Error('object must be an object, is: ' + object);
   }
   if (!(object.constructor instanceof Function)) {
      throw new Error('object must have a constructor property, has: ' + object.constructor);
   }

   if (properties === undefined) {
      properties = {};
   }
   if (!(properties instanceof Object)) {
      throw new Error('properties must be an object, is: ' + properties);
   }

   var type = object.constructor.name;
   if (typeof type != 'string') {
      throw new Error("couldn't get type: " + type);
   }

   var scriptableMap = new ScriptableMap(new java.util.HashMap());

   // add all instance methods of object to scriptableMap
   for (var i in object) {
      scriptableMap[i] = object[i];
   }

   // add all properties and set $type$, accordingly
   for (var i in properties) {
      scriptableMap[i] = properties[i];
   }
   scriptableMap.$type$ = type;

   // decorate scriptableMap with DAO convenience methods
   scriptableMap = addDaoMethods(scriptableMap);

   log.debug(type + ' constructed.');

   return scriptableMap;
}


/**
 * To be used for installing DAO functionality methods on model constructors and
 * registering types for being able to decorate corresponding model objects with
 * resp. instance methods when fetched from DB.
 */
function Store() {
   var typeRegistry = {};

   this.getTypeRegistry = function () {
      return typeRegistry;
   };

   this.registerType = function (ctor) {
      // add type to registry
      typeRegistry[ctor.name] = ctor;
      log.debug(ctor.name + ' type registered.');

      // install get, find, all and list methods on constructor
      ctor.get  = partial(this.get, ctor.name);
      ctor.find = partial(this.find, ctor.name);
      ctor.all  = partial(this.getAll, ctor.name);
      ctor.list = partial(this.list, ctor.name);
   };


   /**
    * Hibernate session API wrapper methods.
    */
   this.save = function (object) {
      try {
         return getHibernateTemplate('save', { object: object });
      } catch (e) {
         log.error('in "save": ' + e.toString());
         return;
      }
   };

   this.remove = function (object) {
      try {
         return getHibernateTemplate('remove', { object: object });
      } catch (e) {
         log.error('in "remove": ' + e.toString());
         return;
      }
   };

   this.get = function (type, id) {
      try {
         return getHibernateTemplate('get', { type: type, id: id });
      } catch (e) {
         log.error('in "get": ' + e.toString());
         return;
      }
   };

   this.find = function (type, query) {
      try {
         query = 'from ' + type + ' ' + type.substring(0, 1).toLowerCase() + ' ' + query;
         return getHibernateTemplate('find', { query: query });
      } catch (e) {
         log.error('in "find": ' + e.toString());
         return;
      }
   };

   this.getAll = function (type) {
      try {
         return getHibernateTemplate('getAll', { type: type });
      } catch (e) {
         log.error('in "all": ' + e.toString());
         return;
      }
   };

   this.list = function (type, params) {
      try {
         params.type = type;
         return getHibernateTemplate('list', params);
      } catch (e) {
         log.error('in "list": ' + e.toString());
         return;
      }
   };


   /**
    * Template taking care of executing the actual Hibernate session API wrapper method operations.
    */
   var getHibernateTemplate = function (method, params) {
      var sess = getSession();

      // do the actual operation
      switch (method) {
         case 'save':
            sess['saveOrUpdate(java.lang.String,java.lang.Object)'](params.object.$type$, params.object);
            break;
         case 'remove':
            sess['delete(java.lang.Object)'](params.object);
            break;
         case 'get':
            var result = sess.get(new java.lang.String(params.type), new java.lang.Long(params.id));
            if (result != null) {
               result = this.addInstanceMethods(new ScriptableMap(result));
            }
            break;
         case 'find':
            var result = new ScriptableList(sess.find(new java.lang.String(params.query)));
            for (var i in result) {
               result[i] = this.addInstanceMethods(new ScriptableMap(result[i]));
            }
            break;
         case 'getAll':
            var result = new ScriptableList(sess.find(new java.lang.String('from ' + params.type)));
            for (var i in result) {
               result[i] = this.addInstanceMethods(new ScriptableMap(result[i]));
            }
            break;
         case 'list':
            var criteria = sess['createCriteria(java.lang.String)'](params.type);
            criteria.setCacheable(true);
            if (params.orderBy) {
               var order = (params.order == 'asc') ?
                           org.hibernate.criterion.Order.asc(params.orderBy) :
                           org.hibernate.criterion.Order.desc(params.orderBy);
               criteria.addOrder(order);
            }
            if (params.first && (typeof params.first == 'number')) {
               criteria.setFirstResult(params.first);
            }
            if (params.max && (typeof params.max == 'number')) {
               criteria.setMaxResults(params.max);
            }

            var result = new ScriptableList(criteria.list());
            for (var i in result) {
               result[i] = this.addInstanceMethods(new ScriptableMap(result[i]));
            }
            break;
         default:
            break;
      }

      return result || null;
   };

}

/**
 * Used to initialize store.
 */
function initStore() {
   store = store || new Store();
   log.info('Store initialized with empty typeRegistry: ' + uneval( store.getTypeRegistry() ));
}


/**
 * To be used for handling Hibernate mapping sets in a "Helma-tic" JS style way.
 */
var Set = rhino.extendJavaClass(java.util.Set);

Set.prototype.helmatize = function () {
   var item, items = [];
   var arraySet = this.toArray();

   for (var i in arraySet) {
      item = new ScriptableMap(arraySet[i]);
      items[i] = addInstanceMethods(item);
   }

   return items;
};
