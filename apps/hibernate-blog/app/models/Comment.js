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

   this.getFeedTitle = function () {
      var articleTarget = articleModel.Article.get(this.articleTargetId);

      return 'To Article: "' + articleTarget.title + '"';
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
   var articleTarget = articleModel.Article.get(data.articleTargetId);
   articleTarget.comments.add(comment);

   return 'Comment was created successfully.';
}

function validateCreate(data) {
   validatePresenceOf(data.text.stripTags(), { msg: 'Text was empty.' });
}


function getFeed(feedType) {
   var comments = Comment.list({ max: 10, orderBy: 'createTime' });

   var feed = new com.sun.syndication.feed.synd.SyndFeedImpl();
   feed.setFeedType(feedType);

   feed.setTitle('Hibernate Blog NG - Comments');
   feed.setLink('/');
   feed.setDescription('powered by Helma NG, Hibernate and ROME');

   var entry, entries = new java.util.ArrayList();

   for (var i in comments) {
      entry = new com.sun.syndication.feed.synd.SyndEntryImpl();
      entry.setTitle(comments[i].getFeedTitle());
      entry.setLink('/articles/show?id=' + comments[i].articleTargetId +
                    '#comment' + comments[i].id);
      entry.setPublishedDate(comments[i].createTime);

      var description = new com.sun.syndication.feed.synd.SyndContentImpl();
      description.setType('text/html');
      description.setValue(comments[i].getMarkdownedText());
      entry.setDescription(description);

      entries.add(entry);
   }

   feed.setEntries(entries);

   var syndFeedOutput = new com.sun.syndication.io.SyndFeedOutput();

   return syndFeedOutput.outputString(feed);
}
