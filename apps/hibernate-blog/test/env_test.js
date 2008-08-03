importFromModule('helma.unittest', '*');

importModule('helma.hibernate', 'db');

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

   assertEqual(model.User.all().size(), 0);

   db.commitTxn();

   return;
};
