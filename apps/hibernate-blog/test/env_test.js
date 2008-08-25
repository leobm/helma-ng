importFromModule('helma.unittest', '*');

importModule('helma.hibernate', 'db');

importFromModule('test.helpers', '*');

importFromModule('app.models.user', 'User');


var testCase = new TestCase('environment');

/**
 * Testing the test environment.
 */
testCase.testTruth = function () {
   assertTrue(true);
};

/**
 * Testing the Hibernate environment.
 */
testCase.testHibernate = function () {
   db.beginTxn();

   createTestUser();

   assertEqual(User.all().size(), 1);

   db.commitTxn();
};
