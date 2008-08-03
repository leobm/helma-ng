importFromModule('helma.unittest', '*');

importFromModule('testHelpers', '*');

importModule('models.Article', 'model');


var testCase = new TestCase('Article');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var article = getTestArticle();

   assertNotNull(article);
   assertEqual(model.Article.all().size(), 1);
   assertEqual(article.title, 'Test Title');
   assertEqual(article.text, 'Some text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};

testCase.testUpdate = function () {
   var article = getTestArticle();

   var data = {
      id: article.id,
      title: 'Another Test Title',
      text: 'Some other text.'
   };
   model.doUpdate(data);

   assertNotNull(article);
   assertEqual(model.Article.all().size(), 1);
   assertEqual(article.title, 'Another Test Title');
   assertEqual(article.text, 'Some other text.');
   assertEqual(article.creator.name, 'testUser');
   assertEqual(article.getCreatorName(), 'testUser');

   return;
};

testCase.testDelete = function () {
   var article = getTestArticle();

   model.doDelete(article.id);

   article = model.Article.all()[0];

   assertUndefined(article);
   assertEqual(model.Article.all().size(), 0);

   return;
};
