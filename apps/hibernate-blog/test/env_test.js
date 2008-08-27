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

   db.store.query('delete from Article').executeUpdate();
   db.store.query('delete from Comment').executeUpdate();
   db.store.query('delete from User').executeUpdate();

   createTestUser();

   assertEqual(User.all().size(), 1);

   db.commitTxn();
};
