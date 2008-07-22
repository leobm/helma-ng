importFromModule('formHandling', 'handlePostReq');
importFromModule('security', 'checkAccess');
importModule('models.Comment', 'commentModel');


function create_action() {
   checkAccess(this);
   handlePostReq(this);

   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}

function checkAccessCreate() {
   return session.data.userId;
}

function onPostReqCreate() {
   session.data.message = commentModel.doCreate(req.params);
   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}
