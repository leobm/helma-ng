importFromModule('helma.unittest', '*');

importModule('helma.hibernate', 'db');

importFromModule('testHelpers', '*');

importModule('models.User', 'model');


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

   assertEqual(model.User.all().size(), 1);

   db.commitTxn();
};
