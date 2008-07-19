importModule('helma.rhino', 'rhino');


var JDate = rhino.extendJavaClass(java.util.Date);

JDate.prototype.format = function (formatString) {
   var sdf = new java.text.SimpleDateFormat(formatString);
   return sdf.format(this);
};


var Map = rhino.extendJavaClass(java.util.Map);

Map.prototype.__iterator__ = function () { 
   return Iterator(this.entrySet());
};


String.prototype.processMarkdown = function () {
   var processor = new org.helma.util.MarkdownProcessor(this);
   return processor.process();
};
