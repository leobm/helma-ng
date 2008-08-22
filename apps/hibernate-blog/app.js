// specify the DB connector to be loaded
importJar('lib/mysql-connector-java-5.1.6-bin.jar');
importJar('config/cache');

importModule('helma.app', 'app');
importFromModule('helma.simpleweb', 'handleRequest');

importModule('helma.hibernate', 'db');
importModule('helma.logging', 'logging');
var log = logging.getLogger(__name__);

importModule('modules.typeExtensions');


function main() {
   app.start();

   db.setConfigPath('config/dev');
   db.addTxnCallbacks();

   log.info('Welcome to Hibernate Blog NG! ^^');
}
