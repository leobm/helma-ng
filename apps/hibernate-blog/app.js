// specify the DB connector to be loaded
importJar('lib/mysql-connector-java-5.1.6-bin.jar');
importJar('config/cache');

importModule('helma.app', 'app');
importFromModule('helma.simpleweb', 'handleRequest');

importModule('helma.hibernate', 'db');
importModule('helma.logging', 'logging');
var log = logging.getLogger(__name__);

importModule('modules.typeExtensions');

importFromModule('app.models.User', 'User');

importModule('app.controllers.articles', 'articles');
importModule('app.controllers.account', 'account');
importModule('app.controllers.comments', 'comments');


function main() {
   app.start();

   db.setConfigPath('config/dev');
   db.addTxnCallbacks();

   log.info('Welcome to Hibernate Blog NG! ^^');
}


function main_action() {
   if (User.all().size() == 0) {
      res.redirect('account');
   }

   res.redirect('articles');
}