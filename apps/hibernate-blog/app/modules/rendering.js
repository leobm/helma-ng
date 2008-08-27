importFromModule('helma.skin', 'render');

importFromModule('app.modules.formHandling', 'handleMessage');

importFromModule('app.modules.security', 'getChecks');
importFromModule('app.models.user', 'getSessionUser');


function renderView(context, skinName) {
   var path = req.path.substring(1).split('/');
   var controller = path[path.length - 2] || 'main';
   var action = path[path.length - 1] || 'main';

   if (context) {
      context.path = req.path;
      context.message = handleMessage();
      context.sessionUserName = getChecks().isSessionUser ?
                                getSessionUser().name : null;

      if (context.object) {
         this.addObjectPropsToContext(context.object, context);
      }

   } else {
      var context = {
         path: req.path,
         message: handleMessage(),
         sessionUserName: getChecks().isSessionUser ?
                          getSessionUser().name : null
      };
   }
   render('app/views/' + controller + '/' + (skinName || action) + '.html', context);
}


function renderList(collection, skin, condition) {
   var item, context = {};

   if (condition || (condition === undefined)) {
      for (i in collection) {
         item = collection[i];
         context.itemIndex = i;
         context.itemNumber = parseInt(i) + 1;
         this.addObjectPropsToContext(item, context);

         skin.renderSubskin(item.$type$.toLowerCase() + 'ListItem', context);
      }
   }
}


function renderPagination(skin, data) {
   var isPaginatable = (data.collection.size() > data.firstItem + data.maxItems) ||
                       (data.firstItem - data.maxItems >= 0);

   if (!isPaginatable) {
      return;
   } else {
      var subskinContext;
      res.writeln('<div id="pagination">');
   }

   if (data.collection.size() > data.firstItem + data.maxItems) {
      subskinContext = { firstItem: data.firstItem + data.maxItems };
      skin.renderSubskin('nextPageLink', subskinContext);
   }

   if (data.firstItem - data.maxItems >= 0) {
      subskinContext = { firstItem: data.firstItem - data.maxItems };
      skin.renderSubskin('previousPageLink', subskinContext);
   }

   res.writeln('</div>');
}


function renderSub(macrotag, skin, condition, context) {
   if (condition || (condition === undefined)) {
      skin.renderSubskin(macrotag.name, context);
   }
}


var addObjectPropsToContext = function (object, context) {
   var key;

   for (i in object) {
      key = i.startsWith('get') ? (i[3].toLowerCase() + i.substring(4)) : i;

      if ( (i != '$type$') && (i != 'save') && (i != 'remove') &&
           !(object[i] instanceof org.hibernate.proxy.map.MapProxy) &&
           !(object[i] instanceof java.util.Set) ) {
         context[key] = (object[i] instanceof Function) ? object[i]() : object[i];
      }
   }
}
