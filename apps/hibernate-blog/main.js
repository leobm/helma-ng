// specify the DB connector to be loaded
importJar('lib/mysql-connector-java-5.1.6-bin.jar');
importJar('config/cache');

importModule('helma.app', 'app');
importFromModule('helma.simpleweb', 'handleRequest');

importModule('helma.hibernate', 'db');

importModule('modules.typeExtensions');

importFromModule('app.models.User', 'User');

importModule('app.controllers.articles', 'articles');
importModule('app.controllers.account', 'account');
importModule('app.controllers.comments', 'comments');

app.start();

db.setConfigPath('config/dev');
db.addTxnCallbacks();


function main_action() {
   if (User.all().size() == 0) {
      res.redirect('account');
   }

   res.redirect('articles');
}
