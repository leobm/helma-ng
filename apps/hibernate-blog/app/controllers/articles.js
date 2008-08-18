importFromModule('main', 'getChecks');
importFromModule('security', '*');
importFromModule('rendering', '*');
importFromModule('formHandling', 'handlePostReq');

importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


function main_action() {
   var paginationData = {
      firstItem: parseInt(req.params.first) || 0,
      maxItems: 4,
      collection: articleModel.Article.all()
   };
   var items = articleModel.Article.list({ first: paginationData.firstItem,
                                           max: paginationData.maxItems,
                                           orderBy: 'createTime' });

   var context = {
      loginLink: function (macrotag, skin) {
         renderSub(macrotag, skin, !getChecks().isSessionUser);
      },
      registerLink: function (macrotag, skin) {
         renderSub(macrotag, skin, !getChecks().isSessionUser);
      },
      createArticleLink: function (macrotag, skin) {
         renderSub(macrotag, skin, getChecks().isSessionUserAdmin);
      },
      logoutLink: function (macrotag, skin, context) {
         renderSub(macrotag, skin, getChecks().isSessionUser, context);
      },
      sessionUserName: getChecks().isSessionUser ?
                       userModel.getSessionUser().name : null,
      listArticles: function (macrotag, skin) {
         renderList(items, skin);
      },
      pagination: function(macrotag, skin) {
         renderPagination(skin, paginationData);
      }
   };
   renderView(context);
}


function show_action() {
   var article = articleModel.Article.get(req.params.id);

   if (article) {
      var context = {
         object: article,
         adminTasks: function (macrotag, skin, context) {
            renderSub(macrotag, skin, getChecks().isSessionUserAdmin, context);
         },
         listComments: function (macrotag, skin) {
            renderList(article.comments.helmatize(), skin);
         },
         loginRegisterInfo: function (macrotag, skin) {
            renderSub(macrotag, skin, !getChecks().isSessionUser);
         },
         addCommentForm: function (macrotag, skin, context) {
            renderSub(macrotag, skin, getChecks().isSessionUser, context);
         }
      };
      renderView(context);
   } else {
      res.redirect('');
   }
}


function create_action() {
   checkAccess(this);
   handlePostReq(this);

   var context = {
      title: req.params.title,
      text: req.params.text
   };
   renderView(context);
}

function checkAccessCreate() {
   return getChecks().isSessionUserAdmin;
}

function onPostReqCreate() {
   req.params.creator = userModel.getSessionUser();
   session.data.message = articleModel.doCreate(req.params).msg;
   res.redirect('/');
}


function edit_action() {
   checkAccess(this);
   handlePostReq(this);

   var article = articleModel.Article.get(req.params.id);

   if (article) {
      renderView({ object: article });
   } else {
      res.redirect('');
   }
}

function checkAccessEdit() {
   return this.checkAccessCreate();
}

function onPostReqEdit() {
   session.data.message = articleModel.doUpdate(req.params).msg;
   res.redirect('show?id=' + req.params.id);
}


function delete_action() {
   checkAccess(this);
   handlePostReq(this);

   var article = articleModel.Article.get(req.params.id);

   if (article) {
      renderView({ object: article });
   } else {
      res.redirect('');
   }
}

function checkAccessDelete() {
   return this.checkAccessCreate();
}

function onPostReqDelete() {
   session.data.message = articleModel.doDelete(req.params.id).msg;
   res.redirect('/');
}


function atom_xml_action() {
   res.contentType = 'application/atom+xml';
   res.write(articleModel.getFeed('atom_0.3'));
}
