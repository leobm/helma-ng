importModule('helma.app', 'app');
importFromModule('helma.simpleweb', 'handleRequest');
importModule('helma.logging', 'logging');
var log = logging.getLogger(__name__);

importModule('helma.hibernate', 'db');
importFromModule('models.User', '*');

importModule('controllers.articles', 'articles');
importModule('controllers.account', 'account');
importModule('controllers.comments', 'comments');


function main() {
   app.start({ staticDir: '../static' });
   db.addTxnCallbacks();
   log.info('Welcome to Hibernate Blog NG! ^^');
}


function main_action() {
   if (User.all().size() == 0) {
      res.redirect('account');
   }
   res.redirect('articles');
}
