importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


function getTestUser() {
   var user = (userModel.User.all().size() == 1) ?
              userModel.User.all()[0] : null;

   if (!user) {
      var data = {
         name: 'testUser',
         password: 'pass',
         websiteUrl: 'robi42.soup.io'
      };
      userModel.doCreate(data);

      user = userModel.User.all()[0];
   }

   return user;
}


function getTestArticle() {
   var user = this.getTestUser();

   var article = (articleModel.Article.all().size() == 1) ?
                 articleModel.Article.all()[0] : null;

   if (article) {
      articleModel.doDelete(article.id);
   }

   var data = {
      creator: user,
      title: 'Test Title',
      text: 'Some text.'
   };
   articleModel.doCreate(data);

   article = articleModel.Article.all()[0];

   return article;
}
