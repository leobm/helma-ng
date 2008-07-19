importFromModule('rendering', '*');
importFromModule('formHandling', 'handlePostReq');
importFromModule('security', 'checkRender');
importModule('models.User', 'userModel');


function main_action() {
   res.redirect('register');
}


function register_action() {
      handlePostReq(this);

      var context = {
         adminPrefix: function (macrotag, skin) {
            checkRender('adminPrefix', skin, userModel.User.all().size() == 0);
         },
         websiteUrlInput: function (macrotag, skin) {
            checkRender('websiteUrlInput', skin, userModel.User.all().size() > 0);
         },
         name: req.params.name || '',
         password: req.params.password || '',
         websiteUrl: req.params.websiteUrl || ''
      };
      renderView(context);
}

function onRegisterPostReq() {
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

function onLoginPostReq() {
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
