importFromModule('helma.simpleweb', 'handleRequest');

importFromModule('app.models.user', 'User');

importModule('app.controllers.account', 'account');
importModule('app.controllers.articles', 'articles');
importModule('app.controllers.comments', 'comments');


function main_action() {
   if (User.all().size() == 0) {
      res.redirect('account');
   }

   res.redirect('articles');
}
