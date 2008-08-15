importModule('helma.hibernate', 'db');

importModule('models.User', 'userModel');
importModule('models.Article', 'articleModel');


function handleDbTxn(testCase) {
   testCase.setUp = function () {
      db.beginTxn();

      // reset DB content
      db.store.query('delete from Article').executeUpdate();
      db.store.query('delete from User').executeUpdate();
   };

   testCase.tearDown = function () {
      db.commitTxn();
   };
}


function createTestUser() {
   var user;

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

   var data = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   article = articleModel.doCreate(data).obj;

   return article;
}
