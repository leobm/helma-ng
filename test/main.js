importModule('helma.unittest', 'unittest');


function main() {
   unittest.run('main');
}


var testSuite = new unittest.TestSuite('modules');

testSuite.addTest('env_test');
testSuite.addTest('modules.core.array_test');
testSuite.addTest('modules.helma.unittest_test');
