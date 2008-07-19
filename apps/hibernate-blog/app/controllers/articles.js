importFromModule('rendering', '*');
importFromModule('formHandling', 'handlePostReq');
importFromModule('security', '*');
importModule('typeExtensions');
importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


function main_action() {
   var articles = articleModel.Article.list({ orderBy: 'createTime' });
   var context = {
      loginLink: function (macrotag, skin) {
         checkRender('loginLink', skin, !session.data.userId);
      },
      registerLink: function (macrotag, skin) {
         checkRender('registerLink', skin, !session.data.userId);
      },
      createArticleLink: function (macrotag, skin) {
         checkRender('createArticleLink', skin, session.data.userId &&
                                                userModel.User.get(session.data.userId).isAdmin);
      },
      logoutLink: function (macrotag, skin) {
         checkRender('logoutLink', skin, session.data.userId);
      },
      list: function (macrotag, skin, context) {
         var article;
         for (var i in articles) {
            article = articles[i];
            context.commentsCountMsg = function () {
               var commentsCount = article.comments.size();
               res.write(commentsCount);
               (commentsCount == 1) ? res.write(' comment') : res.write(' comments');
            },
            context.href = 'show?id=' + article.id;
            context.title = article.title;
            context.text = article.getTeaserText();
            context.createTime = article.getFormattedCreateTime();
            context.creator = article.getCreatorName();
            skin.renderSubskin('listItem', context);
         }
      }
   };
   renderView(context);
}


function show_action() {
   var article = articleModel.Article.get(req.params.id);
   if (article) {
      var context = {
         title: article.title,
         text: article.getMarkdownedText(),
         createTime: article.getFormattedCreateTime(),
         creator: article.getCreatorName(),
         id: req.params.id,
         adminTasks: function (macrotag, skin, context) {
            checkRender('adminTasks', skin,
                        session.data.userId && userModel.User.get(session.data.userId).isAdmin,
                        context);
         },
         commentsCountMsg: function () {
            var commentsCount = article.comments.size();
            res.write(commentsCount);
            (commentsCount == 1) ? res.write(' comment') : res.write(' comments');
         },
         noCommentsMsg: function (macrotag, skin) {
            checkRender('noCommentsMsg', skin, article.comments.size() == 0);
         },
         listComments: function (macrotag, skin) {
            var comments = article.comments.toColl();
            var comment;
            for (var i in comments) {
               comment = comments[i];
               var subskinContext = {
                  commentNumber: parseInt(i) + 1,
                  commentCreator: comment.getCreatorName(),
                  commentCreateTime: comment.getFormattedCreateTime(),
                  commentText: comment.getMarkdownedText()
               };
               skin.renderSubskin('commentListItem', subskinContext);
            }
         },
         loginRegisterInfo: function (macrotag, skin, context) {
            checkRender('loginRegisterInfo', skin, !session.data.userId);
         },
         addCommentForm: function (macrotag, skin, context) {
            checkRender('addCommentForm', skin, session.data.userId, context);
         }
      };
      renderView(context);
   } else {
      res.redirect('');
   }
}


function create_action() {
   checkAccess('create', session.data.userId &&
                         userModel.User.get(session.data.userId).isAdmin);
   handlePostReq(this);

   var context = {
      title: req.params.title || '',
      text: req.params.text || ''
   };
   renderView(context);
}

function onCreatePostReq() {
   session.data.message = articleModel.doCreate(req.params);
   res.redirect('/');
}


function edit_action() {
   checkAccess('edit', session.data.userId &&
                       userModel.User.get(session.data.userId).isAdmin);
   handlePostReq(this);

   var article = articleModel.Article.get(req.params.id);
   if (article) {
      var context = {
         id: article.id,
         title: article.title,
         text: article.text
      };
      renderView(context);
   } else {
      res.redirect('');
   }
}

function onEditPostReq() {
   session.data.message = articleModel.doUpdate(req.params);
   res.redirect('show?id=' + req.params.id);
}


function delete_action() {
   checkAccess('delete', session.data.userId &&
                         userModel.User.get(session.data.userId).isAdmin);
   handlePostReq(this);

   var article = articleModel.Article.get(req.params.id);
   if (article) {
      var context = {
         id: article.id,
         title: article.title
      };
      renderView(context);
   } else {
      res.redirect('');
   }
}

function onDeletePostReq() {
   session.data.message = articleModel.doDelete(req.params.id);
   res.redirect('/');
}
