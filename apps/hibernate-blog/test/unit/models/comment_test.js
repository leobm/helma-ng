importFromModule('helma.unittest', '*');

importFromModule('test.helpers', '*');

importFromModule('app.models.comment', '*');
importFromModule('app.models.article', '*');


var testCase = new TestCase('comment');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var comment = createTestComment();
   var articleTarget = Article.get(comment.articleTargetId);

   assertNotNull(comment);
   assertEqual(Comment.all().size(), 1);
   assertEqual(articleTarget.comments.size(), 1);
   assertEqual(articleTarget.commentsCount, 1);
   assertEqual(comment.text, 'Some text.');
   assertEqual(comment.creator.name, 'testUser');
};


testCase.testDelete = function () {
   var comment = createTestComment();
   var articleTarget = Article.get(comment.articleTargetId);

   deleteComment(comment.id);

   comment = Comment.get(comment.id);

   assertNull(comment);
   assertNotNull(articleTarget);
   assertEqual(Comment.all().size(), 0);
   assertEqual(Article.all().size(), 1);
   assertEqual(articleTarget.comments.size(), 0);
   assertEqual(articleTarget.commentsCount, 0);
};
