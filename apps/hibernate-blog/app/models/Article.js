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
      return this.getMarkdownedText().stripTags().trim().head(250, ' ...');
   };

   this.getCommentsCountMsg = function () {
      var commentsCount = this.comments.size();

      return (commentsCount == 1) ? (commentsCount + ' comment') :
             (commentsCount + ' comments');
   };

   return new db.Storable(this, props);
}
db.store.registerType(Article);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      creator: data.creator,
      createTime: new java.util.Date(),
      title: data.title ||
             ( (data.text.processMarkdown().stripTags() != 0) ?
               data.text.processMarkdown().stripTags().trim().head(47, '...') :
               '...' ),
      text: data.text
   };
   var article = new Article(props);
   article.save();

   return 'Article "' + article.title + '" was created successfully.';
}

function validateCreate(data) {
   validatePresenceOf(data.text, { msg: 'Text was empty.' });
   validateLengthOf(data.title, { max: 50, msg: 'Title was too long.' })
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
   validatePresenceOf(data.title, { msg: 'Title was empty.' });
}


function doDelete(id) {
   var article = Article.get(id);
   article.remove();

   return 'Article "' + article.title + '" was deleted successfully.';
}


function getFeed(feedType) {
   var articles = Article.list({ max: 10, orderBy: 'createTime'});

   var feed = new com.sun.syndication.feed.synd.SyndFeedImpl();
   feed.setFeedType(feedType);

   feed.setTitle('Hibernate Blog NG - Articles');
   feed.setLink('/');
   feed.setDescription('powered by Helma NG, Hibernate and ROME');

   var entry, entries = new java.util.ArrayList();

   for (var i in articles) {
      entry = new com.sun.syndication.feed.synd.SyndEntryImpl();
      entry.setTitle(articles[i].title);
      entry.setLink('show?id=' + articles[i].id);
      entry.setPublishedDate(articles[i].createTime);

      var description = new com.sun.syndication.feed.synd.SyndContentImpl();
      description.setType('text/html');
      description.setValue(articles[i].getMarkdownedText());
      entry.setDescription(description);

      entries.add(entry);
   }

   feed.setEntries(entries);

   var syndFeedOutput = new com.sun.syndication.io.SyndFeedOutput();

   return syndFeedOutput.outputString(feed);
}
