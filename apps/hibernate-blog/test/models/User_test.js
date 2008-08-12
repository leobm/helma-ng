importFromModule('helma.unittest', '*');

importFromModule('testHelpers', '*');

importModule('models.User', 'model');


var testCase = new TestCase('User');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var user = createTestUser();

   assertNotNull(user);
   assertEqual(model.User.all().size(), 1);
   assertEqual(user.name, 'testUser');
   assertEqual(user.password, 'pass'.md5());
   assertEqual(user.websiteUrl, 'http://robi42.soup.io');

   return;
};

testCase.testDelete = function () {
   var user = createTestUser();

   model.doDelete(user.id);

   user = model.User.get(user.id);

   assertNull(user);
   assertEqual(model.User.all().size(), 0);

   return;
}
