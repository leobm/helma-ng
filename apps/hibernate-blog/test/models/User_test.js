importFromModule('helma.unittest', '*');
importModule('helma.hibernate', 'db');

importFromModule('testHelpers', '*');

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
   var user = getTestUser();

   assertNotNull(user);
   assertEqual(userModel.User.all().size(), 1);
   assertEqual(user.name, 'testUser');
   assertEqual(user.password, 'pass'.md5());
   assertEqual(user.websiteUrl, 'http://robi42.soup.io');

   return;
}
