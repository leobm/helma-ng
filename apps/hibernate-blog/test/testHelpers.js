importModule('helma.hibernate', 'db');

importModule('models.User', 'userModel');
importModule('models.Article', 'articleModel');


function handleDbTxn(testCase) {
   testCase.setUp = function () {
      db.beginTxn();
      return;
   };

   testCase.tearDown = function () {
      db.commitTxn();
      return;
   };

   return;
}


function createTestUser() {
   var user, users = userModel.User.all();

   if (users && (users.size() > 0)) {
      var article, articles = articleModel.Article.all();

      if (articles && (articles.size() > 0)) {
         for (var i in articles) {
            article = articles[0];
            articleModel.doDelete(article.id);
         }
      }

      for (var i in users) {
         user = users[i];
         userModel.doDelete(user.id);
      }
   }

   var data = {
      name: 'testUser',
      password: 'pass',
      websiteUrl: 'robi42.soup.io'
   };
   user = userModel.doCreate(data).obj;

   return user;
}


function createTestArticle() {
   var user = this.createTestUser();
   var article, articles = articleModel.Article.all();

   if (articles && (articles.size() > 0)) {
      for (var i in articles) {
         article = articles[i];
         articleModel.doDelete(article.id);
      }
   }

   var data = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   article = articleModel.doCreate(data).obj;

   return article;
}
