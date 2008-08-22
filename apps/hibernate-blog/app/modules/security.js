importFromModule('app.models.User', '*');


function getChecks() {
   return {
      areUsersRegistered: User.all().size() > 0,
      isSessionUser: session.data.userId ? true : false,
      isSessionUserAdmin: session.data.userId ?
                          getSessionUser().isAdmin :
                          false
   };
}


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
