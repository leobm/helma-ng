/**
 * Generic Post model, used as mixin by Article and Comment.
 */
function Post() {

   this.getFormattedCreateTime = function () {
      return this.createTime.format('yyyy-MM-dd, HH:mm');
   };

   this.getCreatorName = function () {
      return this.creator.name;
   };

   this.getMarkdownedText = function () {
      return this.text.processMarkdown();
   };
}
