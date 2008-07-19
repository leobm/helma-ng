function checkAccess(action, condition) {
   try {
      var path = req.path.split('/');
      var requestedAction = path[path.length - 1];
      if ((requestedAction == action) && !(condition)) {
         throw new Error('Access denied.');
      }
   } catch (e) {
      session.data.message = e.toString();
      res.redirect('/account/login');
   }
}


function checkRender(subskinName, skin, condition, context) {
   if (condition) {
      skin.renderSubskin(subskinName, context);
   }
}
