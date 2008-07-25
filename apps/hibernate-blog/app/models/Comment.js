importModule('helma.hibernate', 'db');
importFromModule('helma.inheritance', 'mixin');
importFromModule('validation', '*');

importModule('models.Post', 'genericModel');
importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


function Comment(props) {

   mixin(this, genericModel.Post);

   this.getCreatorName = function () {
      return (this.creator.websiteUrl ?
              ('<a href="' + this.creator.websiteUrl + '">' + this.creator.name + '</a>') :
              this.creator.name)
   };

   return new db.Storable(this, props);
}
db.store.registerType(Comment);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      creator: userModel.getSessionUser(),
      createTime: new java.util.Date(),
      text: data.text.stripTags(),
   };
   var comment = new Comment(props);
   comment.save();
   var article = articleModel.Article.get(data.articleId);
   article.comments.add(comment);

   return 'Comment was created successfully.';
}

function validateCreate(data) {
   validatePresenceOf(data.text, { msg: 'Text was empty.' });
}
