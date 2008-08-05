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
   var user = (userModel.User.all().size() == 1) ?
              userModel.User.all()[0] : null;

   if (user) {
      var article = (articleModel.Article.all().size() == 1) ?
                    articleModel.Article.all()[0] : null;

      if (article) {
         articleModel.doDelete(article.id);
      }

      userModel.doDelete(user.id);
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

   var article = (articleModel.Article.all().size() == 1) ?
                 articleModel.Article.all()[0] : null;

   if (article) {
      articleModel.doDelete(article.id);
   }

   var data = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   article = articleModel.doCreate(data).obj;

   return article;
}
