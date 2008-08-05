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

   res.redirect('/articles/show?id=' + req.params.articleTargetId + '#addComment');
}

function checkAccessCreate() {
   return getChecks().isSessionUser;
}

function onPostReqCreate() {
   session.data.message = commentModel.doCreate(req.params).msg;
   res.redirect('/articles/show?id=' + req.params.articleTargetId + '#addComment');
}


function atom_xml_action() {
   res.contentType = 'application/atom+xml';
   res.write(commentModel.getFeed('atom_0.3'));
}
