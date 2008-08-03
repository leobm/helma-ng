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


testCase.testUpdate = function () {
   var article = articleModel.Article.find("where a.title = 'Test Title'") ?
                 articleModel.Article.find("where a.title = 'Test Title'")[0] : null;

   if (!article) {
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

      article = articleModel.Article.find("where a.title = 'Test Title'")[0];
   }

   var articleUpdateData = {
      id: article.id,
      title: 'Another Test Title',
      text: 'Some other text.'
   };
   articleModel.doUpdate(articleUpdateData);

   assertNotNull(article);
   assertEqual(article.title, 'Another Test Title');
   assertEqual(article.text, 'Some other text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};

testCase.testDelete = function () {
   var article = articleModel.Article.find("where a.title = 'Test Title'") ?
                 articleModel.Article.find("where a.title = 'Test Title'")[0] : null;

   if (!article) {
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

      article = articleModel.Article.find("where a.title = 'Test Title'")[0];
   }

   articleModel.doDelete(article.id);

   article = articleModel.Article.find("where a.title = 'Test Title'")[0];

   assertUndefined(article);

   return;
};
