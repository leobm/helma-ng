importFromModule('helma.unittest', '*');

importFromModule('testHelpers', '*');

importModule('models.Article', 'model');


var testCase = new TestCase('Article');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var article = createTestArticle();

   assertNotNull(article);
   assertEqual(model.Article.all().size(), 1);
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
   article = model.doUpdate(data).obj;

   assertNotNull(article);
   assertEqual(model.Article.all().size(), 1);
   assertEqual(article.title, 'Another Test Title');
   assertEqual(article.text, 'Some other text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');
};

testCase.testDelete = function () {
   var article = createTestArticle();

   model.doDelete(article.id);

   article = model.Article.get(article.id);

   assertNull(article);
   assertEqual(model.Article.all().size(), 0);
};
