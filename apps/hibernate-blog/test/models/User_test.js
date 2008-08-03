importFromModule('helma.unittest', '*');
importModule('helma.hibernate', 'db');

importModule('models.User', 'userModel');


var testCase = new TestCase('User');

testCase.setUp = function () {
   db.beginTxn();
   return;
};

testCase.tearDown = function () {
   db.commitTxn();
   return;
};


testCase.testCreate = function () {
   var user = userModel.User.find("where u.name = 'testUser'") ?
              userModel.User.find("where u.name = 'testUser'")[0] : null;

   if (!user) {
      var userData = {
         name: 'testUser',
         password: 'pass',
         websiteUrl: 'robi42.soup.io'
      };
      userModel.doCreate(userData);

      user = userModel.User.find("where u.name = 'testUser'")[0];
   }

   assertNotNull(user);
   assertEqual(user.name, 'testUser');
   assertEqual(user.password, 'pass'.md5());
   assertEqual(user.websiteUrl, 'http://robi42.soup.io');

   return;
}
