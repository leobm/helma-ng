importModule('helma.hibernate', 'db');
importFromModule('helma.inheritance', 'mixin');
importFromModule('validation', '*');
importModule('models.Post', 'genericModel');
importModule('models.Article', 'articleModel');
importModule('models.User', 'userModel');


function Comment(props) {

   mixin(this, genericModel.Post);

   return new db.Storable(this, props);
}
db.store.registerType(Comment);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      creator: userModel.User.get(session.data.userId),
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
   validatePresenceOf(data.text, 'Text');
}
