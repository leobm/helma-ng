importModule('helma.hibernate', 'db');
importFromModule('helma.inheritance', 'mixin');

importFromModule('modules.model', '*');
importFromModule('modules.validation', '*');

importFromModule('app.models.post', 'Post');
importFromModule('app.models.article', '*');


function Comment(props) {

   mixin(this, Post);

   this.getCreatorName = function () {
      return this.creator.websiteUrl ?
             ('<a href="' + this.creator.websiteUrl + '">' + this.creator.name + '</a>') :
             this.creator.name;
   };

   this.getFeedTitle = function () {
      var articleTarget = Article.get(this.articleTargetId);

      return 'To Article: "' + articleTarget.title + '"';
   };

   return new db.Storable(this, props);
}
db.store.registerType(Comment);


function createComment(data) {
   this.validateCreateComment(data);

   var props = {
      creator: data.creator,
      createTime: new java.util.Date(),
      text: data.text.stripTags(),
   };
   var comment = new Comment(props);
   var articleTarget = Article.get(data.articleTargetId);
   articleTarget.comments.add(comment);
   articleTarget.commentsCount++;

   return new Result('Comment was created successfully.', comment);
}

function validateCreateComment(data) {
   validatePresenceOf(data.text.stripTags(), { msg: 'Text was empty.' });
}


function deleteComment(id) {
   var comment = Comment.get(id);
   var articleTarget = Article.get(comment.articleTargetId);
   comment.remove();
   articleTarget.commentsCount--;
   articleTarget.save();

   return new Result('Comment was deleted successfully.');
}


function getCommentsFeed(feedType) {
   var comments = Comment.list({ max: 10, orderBy: 'createTime' });

   var feed = new com.sun.syndication.feed.synd.SyndFeedImpl();
   feed.setFeedType(feedType);

   feed.setTitle('Hibernate Blog NG - Comments');
   feed.setLink('/');
   feed.setDescription('powered by Helma NG, Hibernate and ROME');

   var entry, entries = new java.util.ArrayList();

   for each (comment in comments) {
      entry = new com.sun.syndication.feed.synd.SyndEntryImpl();
      entry.setTitle(comment.getFeedTitle());
      entry.setLink('/articles/show?id=' + comment.articleTargetId +
                    '#comment' + comment.id);
      entry.setPublishedDate(comment.createTime);

      var description = new com.sun.syndication.feed.synd.SyndContentImpl();
      description.setType('text/html');
      description.setValue(comment.getMarkdownedText());
      entry.setDescription(description);

      entries.add(entry);
   }

   feed.setEntries(entries);

   var syndFeedOutput = new com.sun.syndication.io.SyndFeedOutput();

   return syndFeedOutput.outputString(feed);
}
