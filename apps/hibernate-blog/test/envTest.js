importFromModule('helma.unittest', '*');


var testCase = new TestCase('environment');

/**
 * Testing the test environment.
 */
testCase.testTruth = function () {
   assertTrue(true);
   return;
};
