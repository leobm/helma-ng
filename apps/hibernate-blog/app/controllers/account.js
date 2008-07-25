importFromModule('main', 'getChecks');
importFromModule('rendering', '*');
importFromModule('formHandling', 'handlePostReq');

importModule('models.User', 'userModel');


function main_action() {
   res.redirect('register');
}


function register_action() {
   handlePostReq(this);

   var context = {
      adminPrefix: function (macrotag, skin) {
         renderSub(macrotag, skin, !getChecks().areUsersRegistered);
      },
      name: req.params.name || '',
      password: req.params.password || '',
      websiteUrlInput: function (macrotag, skin) {
         renderSub(macrotag, skin, getChecks().areUsersRegistered);
      },
      websiteUrl: req.params.websiteUrl || ''
   };
   renderView(context);
}

function onPostReqRegister() {
   session.data.message = userModel.doCreate(req.params);
   res.redirect('/');
}


function login_action() {
   if (userModel.User.all().size() == 0) {
      res.redirect('register');
   } else {
      handlePostReq(this);

      var context = {
         name: req.params.name || '',
         password: req.params.password || ''
      };
      renderView(context);
   }
}

function onPostReqLogin() {
   session.data.message = userModel.doLogin(req.params);
   res.redirect('/');
}


function logout_action() {
   try {
      session.data.message = userModel.doLogout();
   } catch (e) {
      session.data.message = e.toString();
   }
   res.redirect('/');
}
