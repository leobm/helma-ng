importFromModule('helma.unittest', 'TestSuite');


var testSuite = new TestSuite('modules');

testSuite.addTest('test.env_test');
testSuite.addTest('test.modules.core.array_test');
testSuite.addTest('test.modules.helma.unittest_test');
