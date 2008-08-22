importModule('helma.hibernate', 'db');

importFromModule('app.models.user', '*');
importFromModule('app.models.article', '*');
importFromModule('app.models.comment', '*');


function handleDbTxn(testCase) {
   testCase.setUp = function () {
      db.beginTxn();

      // reset DB content
      db.store.query('delete from Article').executeUpdate();
      db.store.query('delete from Comment').executeUpdate();
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
   var article = createArticle(data).obj;

   return article;
}


function createTestComment() {
   var article = this.createTestArticle();
   db.commitTxn();
   db.beginTxn();

   article = Article.get(article.id);
   var user = article.creator;

   var data = {
      creator: user,
      articleTargetId: article.id,
      text: 'Some text.'
   };
   var comment = createComment(data).obj;
   db.commitTxn();
   db.beginTxn();

   comment = Comment.get(comment.id);

   return comment;
}
