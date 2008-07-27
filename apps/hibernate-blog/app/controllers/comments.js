importFromModule('main', 'getChecks');
importFromModule('security', 'checkAccess');
importFromModule('formHandling', 'handlePostReq');

importModule('models.Comment', 'commentModel');


function main_action() {
   res.redirect('/');
}


function create_action() {
   checkAccess(this);
   handlePostReq(this);

   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}

function checkAccessCreate() {
   return getChecks().isSessionUser;
}

function onPostReqCreate() {
   session.data.message = commentModel.doCreate(req.params);
   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}
