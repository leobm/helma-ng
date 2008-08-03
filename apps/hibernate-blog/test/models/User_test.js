importFromModule('helma.unittest', '*');

importFromModule('testHelpers', '*');

importModule('models.User', 'model');


var testCase = new TestCase('User');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var user = getTestUser();

   assertNotNull(user);
   assertEqual(model.User.all().size(), 1);
   assertEqual(user.name, 'testUser');
   assertEqual(user.password, 'pass'.md5());
   assertEqual(user.websiteUrl, 'http://robi42.soup.io');

   return;
}
