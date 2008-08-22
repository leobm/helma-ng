importFromModule('app.modules.security', 'getChecks');
importFromModule('app.modules.rendering', '*');
importFromModule('app.modules.formHandling', 'handlePostReq');

importFromModule('app.models.User', '*');


function main_action() {
   res.redirect('register');
}


function register_action() {
   handlePostReq(this);

   var context = {
      adminPrefix: function (macrotag, skin) {
         renderSub(macrotag, skin, !getChecks().areUsersRegistered);
      },
      name: req.params.name,
      password: req.params.password,
      websiteUrlInput: function (macrotag, skin) {
         renderSub(macrotag, skin, getChecks().areUsersRegistered);
      },
      websiteUrl: req.params.websiteUrl
   };
   renderView(context);
}

function onPostReqRegister() {
   createUser(req.params);
   session.data.message = loginUser(req.params).msg;
   res.redirect('/');
}


function login_action() {
   if (User.all().size() == 0) {
      res.redirect('register');
   } else {
      handlePostReq(this);

      var context = {
         name: req.params.name,
         password: req.params.password
      };
      renderView(context);
   }
}

function onPostReqLogin() {
   session.data.message = loginUser(req.params).msg;
   res.redirect('/');
}


function logout_action() {
   try {
      session.data.message = logoutUser().msg;
   } catch (e) {
      session.data.message = e.toString();
   }
   res.redirect('/');
}
