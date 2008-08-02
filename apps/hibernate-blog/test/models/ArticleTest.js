importFromModule('helma.unittest', '*');
importModule('helma.hibernate', 'db');

importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


var testCase = new TestCase('Article');

testCase.setUp = function () {
   db.beginTxn();
   return;
};

testCase.tearDown = function () {
   db.commitTxn();
   return;
};

testCase.testCreate = function () {
   var user = userModel.User.find("where u.name = 'testUser'") ?
              userModel.User.find("where u.name = 'testUser'")[0] : null;

   if (!user) {
      var userData = {
         name: 'testUser',
         password: 'pass'
      };
      userModel.doCreate(userData);

      user = userModel.User.find("where u.name = 'testUser'")[0];
   }

   var articleData = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   articleModel.doCreate(articleData);

   var article = articleModel.Article.find("where a.title = 'Test Title'")[0];

   assertNotNull(article);
   assertEqual(article.title, 'Test Title');
   assertEqual(article.text, 'Some text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};
