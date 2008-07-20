importModule('typeExtensions');
importModule('helma.hibernate', 'db');
importFromModule('helma.inheritance', 'mixin');
importFromModule('validation', '*');
importModule('models.Post', 'genericModel');
importModule('models.User', 'userModel');


function Article(props) {

   // mixin all instance methods of Post
   mixin(this, genericModel.Post);

   this.getTeaserText = function () {
      return this.getMarkdownedText().stripTags().head(250, ' ...');
   }

   return new db.Storable(this, props);
}
db.store.registerType(Article);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      creator: userModel.User.get(session.data.userId),
      createTime: new java.util.Date(),
      title: data.title || ( (data.text.processMarkdown().stripTags() != 0) ?
                             data.text.processMarkdown().stripTags().trim().head(47, '...') :
                             '...' ),
      text: data.text
   };
   var article = new Article(props);
   article.save();

   return 'Article "' + article.title + '" was created successfully.';
}

function validateCreate(data) {
   validatePresenceOf({ value: data.text, msg: 'Text was empty.' });
   validateLengthOf({ value: data.title, max: 50, msg: 'Title was too long.' })
}


function doUpdate(data) {
   this.validateUpdate(data);

   var article = Article.get(data.id);
   article.title = data.title;
   article.text = data.text;
   article.updateTime = new java.util.Date();
   article.save();

   return 'Article "' + article.title + '" was updated successfully.';
}

function validateUpdate(data) {
   this.validateCreate(data);
   validatePresenceOf({ value: data.title, msg: 'Title was empty.' });
}


function doDelete(id) {
   var article = Article.get(id);
   article.remove();

   return 'Article "' + article.title + '" was deleted successfully.';
}
