importModule('helma.hibernate', 'db');

importFromModule('app.models.user', '*');
importFromModule('app.models.article', '*');


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
   user = createUser(data).obj;

   return user;
}


function createTestArticle() {
   var user = this.createTestUser();

   var data = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   article = createArticle(data).obj;

   return article;
}
