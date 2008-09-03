importFromModule('helma.unittest', 'TestSuite');


var testSuite = new TestSuite('unit.modules');

testSuite.addTest('test.env_test');
testSuite.addTest('test.unit.modules.core.array_test');
testSuite.addTest('test.unit.modules.helma.unittest_test');
