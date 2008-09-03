importFromModule('helma.unittest', '*');

importFromModule('test.helpers', '*');

importFromModule('app.models.user', '*');


var testCase = new TestCase('user');

handleDbTxn(testCase);

testCase.testCreate = function () {
   var user = createTestUser();

   assertNotNull(user);
   assertEqual(User.all().size(), 1);
   assertEqual(user.name, 'testUser');
   assertEqual(user.password, 'pass'.md5());
   assertEqual(user.websiteUrl, 'http://robi42.soup.io');
};

testCase.testDelete = function () {
   var user = createTestUser();

   deleteUser(user.id);

   user = User.get(user.id);

   assertNull(user);
   assertEqual(User.all().size(), 0);
}
