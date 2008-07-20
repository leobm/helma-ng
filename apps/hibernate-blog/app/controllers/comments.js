importFromModule('formHandling', 'handlePostReq');
importModule('models.Comment', 'commentModel');


function create_action() {
   handlePostReq(this);

   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}

function onCreatePostReq() {
   session.data.message = commentModel.doCreate(req.params);
   res.redirect('/articles/show?id=' + req.params.articleId + '#addComment');
}
