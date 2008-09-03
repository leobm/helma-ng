/**
 * Generic Post model, used as mixin by Article and Comment.
 */
function Post() {

   this.getFormattedCreateTime = function () {
      return "'" + this.createTime.format('yy, MMM d, h:mm a');
   };

   this.getCreatorName = function () {
      return this.creator.name;
   };

   this.getMarkdownedText = function () {
      return this.text.processMarkdown();
   };
}
