importFromModule('helma.skin', 'render');

importFromModule('formHandling', 'handleMessage');


function renderView(context, skinName) {
   var path = req.path.substring(1).split('/');
   var controller = path[path.length - 2] || 'main';
   var action = path[path.length - 1] || 'main';
   if (context) {
      context.path = req.path;
      context.message = handleMessage();
   } else {
      var context = {
         path: req.path,
         message: handleMessage()
      };
   }
   render('views/' + controller + '/' + (skinName || action) + '.html', context);
}
