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
   var user = (userModel.User.find("where u.name = 'testUser'").size() == 1) ?
              userModel.User.find("where u.name = 'testUser'")[0] : null;

   if (!user) {
      var userData = {
         name: 'testUser',
         password: 'pass'
      };
      userModel.doCreate(userData);

      user = userModel.User.find("where u.name = 'testUser'")[0];
   }

   var article = (articleModel.Article.find("where a.title = 'Test Title'").size() == 1) ?
                 articleModel.Article.find("where a.title = 'Test Title'")[0] : null;

   var articleTitle = article ? 'Another Test Title' : 'Test Title';
   var articleData = {
      creator: user,
      title: articleTitle,
      text: 'Some text.'
   };
   articleModel.doCreate(articleData);

   article = articleModel.Article.find("where a.title = '" + articleTitle + "'")[0];

   assertNotNull(article);
   assertEqual(article.title, articleTitle);
   assertEqual(article.text, 'Some text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};


testCase.testUpdate = function () {
   var article = (articleModel.Article.find("where a.title = 'Test Title'").size() == 1) ?
                 articleModel.Article.find("where a.title = 'Test Title'")[0] : null;

   if (!article) {
      var user = (userModel.User.find("where u.name = 'testUser'").size() == 1) ?
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
      title: 'Yet Another Test Title',
      text: 'Some other text.'
   };
   articleModel.doUpdate(articleUpdateData);

   assertNotNull(article);
   assertEqual(article.title, 'Yet Another Test Title');
   assertEqual(article.text, 'Some other text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};

testCase.testDelete = function () {
   var article = (articleModel.Article.find("where a.title = 'Test Title'").size() == 1) ?
                 articleModel.Article.find("where a.title = 'Test Title'")[0] : null;

   if (!article) {
      var user = (userModel.User.find("where u.name = 'testUser'").size() == 1) ?
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
