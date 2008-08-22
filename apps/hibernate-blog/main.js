importFromModule('app.models.User', 'User');

importModule('app.controllers.articles', 'articles');
importModule('app.controllers.account', 'account');
importModule('app.controllers.comments', 'comments');


function main_action() {
   if (User.all().size() == 0) {
      res.redirect('account');
   }

   res.redirect('articles');
}
