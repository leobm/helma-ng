importModule('helma.simpleweb.request');


function handlePostReq(moduleScope) {
   if (req.isPost()) {
      var path = req.path.split('/');
      var action = path[path.length - 1];
      var onPostRequestFunctionName = 'on' + action.capitalize() + 'PostReq';
      try {
         moduleScope[onPostRequestFunctionName]();
      } catch (e) {
         session.data.message = e.toString();
      }
   }
}


function handleMessage() {
   var message = session.data.message || null;
   if (session.data.message) {
      session.data.message = "";
   }
   return message;
}
