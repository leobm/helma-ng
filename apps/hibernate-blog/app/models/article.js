importModule('helma.hibernate', 'db');
importFromModule('helma.inheritance', 'mixin');

importFromModule('modules.model', '*');
importFromModule('modules.validation', '*');

importFromModule('app.models.post', 'Post');


function Article(props) {

   // mixin all instance methods of Post
   mixin(this, Post);

   this.getTeaserText = function () {
      var clipping = ' <a href="/articles/show?id=' + this.id + '">...</a>';

      return this.getMarkdownedText().stripTags().trim().head(250, clipping);
   };

   this.getCommentsCountMsg = function () {
      return (this.commentsCount == 1) ? (this.commentsCount + ' comment') :
             (this.commentsCount + ' comments');
   };

   return new db.Storable(this, props);
}
db.store.registerType(Article);


function createArticle(data) {
   this.validateCreateArticle(data);

   var props = {
      creator: data.creator,
      createTime: new java.util.Date(),
      title: data.title ||
             ( (data.text.processMarkdown().stripTags() != 0) ?
               data.text.processMarkdown().stripTags().trim().head(47, '...') :
               '...' ),
      text: data.text,
      commentsCount: 0
   };
   var article = new Article(props);
   article.save();

   var msg = 'Article "' + article.title + '" was created successfully.';

   return new Result(msg, article);
}

function validateCreateArticle(data) {
   validatePresenceOf(data.text, { msg: 'Text was empty.' });
   validateLengthOf(data.title, { max: 50, msg: 'Title was too long.' })
}


function updateArticle(data) {
   this.validateUpdateArticle(data);

   var article = Article.get(data.id);
   article.title = data.title;
   article.text = data.text;
   article.updateTime = new java.util.Date();
   article.save();

   var msg = 'Article "' + article.title + '" was updated successfully.';

   return new Result(msg, article);
}

function validateUpdateArticle(data) {
   this.validateCreateArticle(data);
   validatePresenceOf(data.title, { msg: 'Title was empty.' });
}


function deleteArticle(id) {
   var article = Article.get(id);
   article.remove();

   return new Result('Article "' + article.title + '" was deleted successfully.');
}


function getArticlesFeed(feedType) {
   var articles = Article.list({ max: 10, orderBy: 'createTime'});

   var feed = new com.sun.syndication.feed.synd.SyndFeedImpl();
   feed.setFeedType(feedType);

   feed.setTitle('Hibernate Blog NG - Articles');
   feed.setLink('/');
   feed.setDescription('powered by Helma NG, Hibernate and ROME');

   var entry, entries = new java.util.ArrayList();

   for each (article in articles) {
      entry = new com.sun.syndication.feed.synd.SyndEntryImpl();
      entry.setTitle(article.title);
      entry.setLink('show?id=' + article.id);
      entry.setPublishedDate(article.createTime);

      var description = new com.sun.syndication.feed.synd.SyndContentImpl();
      description.setType('text/html');
      description.setValue(article.getMarkdownedText());
      entry.setDescription(description);

      entries.add(entry);
   }

   feed.setEntries(entries);

   var syndFeedOutput = new com.sun.syndication.io.SyndFeedOutput();

   return syndFeedOutput.outputString(feed);
}
