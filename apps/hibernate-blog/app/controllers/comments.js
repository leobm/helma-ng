importFromModule('app.modules.security', '*');
importFromModule('app.modules.formHandling', 'handlePostReq');

importFromModule('app.models.comment', '*');
importFromModule('app.models.user', 'getSessionUser');


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
   req.params.creator = getSessionUser();
   session.data.message = createComment(req.params).msg;
   res.redirect('/articles/show?id=' + req.params.articleTargetId + '#addComment');
}


function atom_xml_action() {
   res.contentType = 'application/atom+xml';
   res.write(getCommentsFeed('atom_0.3'));
}
