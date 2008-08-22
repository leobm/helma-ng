importFromModule('app.modules.security', '*');
importFromModule('app.modules.rendering', '*');
importFromModule('app.modules.formHandling', 'handlePostReq');

importFromModule('app.models.article', '*');
importFromModule('app.models.user', 'getSessionUser');


function main_action() {
   var paginationData = {
      firstItem: parseInt(req.params.first) || 0,
      maxItems: 4,
      collection: Article.all()
   };
   var items = Article.list({ first: paginationData.firstItem,
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
   var article = Article.get(req.params.id);

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
   req.params.creator = getSessionUser();
   session.data.message = createArticle(req.params).msg;
   res.redirect('/');
}


function edit_action() {
   checkAccess(this);
   handlePostReq(this);

   var article = Article.get(req.params.id);

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
   session.data.message = updateArticle(req.params).msg;
   res.redirect('show?id=' + req.params.id);
}


function delete_action() {
   checkAccess(this);
   handlePostReq(this);

   var article = Article.get(req.params.id);

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
   session.data.message = deleteArticle(req.params.id).msg;
   res.redirect('/');
}


function atom_xml_action() {
   res.contentType = 'application/atom+xml';
   res.write(getArticlesFeed('atom_0.3'));
}
