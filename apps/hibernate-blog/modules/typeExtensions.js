importModule('helma.rhino', 'rhino');

__shared__ = true;


var JDate = rhino.extendJavaClass(java.util.Date);

JDate.prototype.format = function (formatString) {
   var sdf = new java.text.SimpleDateFormat(formatString);
   return sdf.format(this);
};


var Map = rhino.extendJavaClass(java.util.Map);

Map.prototype.__iterator__ = function () { 
   return Iterator(this.entrySet());
};
