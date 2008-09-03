importFromModule('helma.unittest', '*');

importFromModule('test.helpers', '*');

importFromModule('app.models.article', '*');


var testCase = new TestCase('article');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var article = createTestArticle();

   assertNotNull(article);
   assertEqual(Article.all().size(), 1);
   assertEqual(article.title, 'Test Title');
   assertEqual(article.text, 'Some text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');
};

testCase.testUpdate = function () {
   var article = createTestArticle();

   var data = {
      id: article.id,
      title: 'Another Test Title',
      text: 'Some other text.'
   };
   article = updateArticle(data).obj;

   assertNotNull(article);
   assertEqual(Article.all().size(), 1);
   assertEqual(article.title, 'Another Test Title');
   assertEqual(article.text, 'Some other text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');
};

testCase.testDelete = function () {
   var article = createTestArticle();

   deleteArticle(article.id);

   article = Article.get(article.id);

   assertNull(article);
   assertEqual(Article.all().size(), 0);
};
