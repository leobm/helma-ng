function checkAccess(moduleScope) {
   try {
      var path = req.path.split('/');
      var action = path[path.length - 1];
      var condition = moduleScope['checkAccess' + action.capitalize()]();

      if (!condition) {
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
