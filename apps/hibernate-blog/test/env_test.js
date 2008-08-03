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
   return;
};

/**
 * Testing the Hibernate environment.
 */
testCase.testHibernate = function () {
   db.beginTxn();

   getTestUser();

   assertEqual(model.User.all().size(), 1);

   db.commitTxn();

   return;
};
