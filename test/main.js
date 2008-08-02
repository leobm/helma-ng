importModule('helma.unittest', 'unittest');
importModule('helma.shell', 'shell');


function main() {
   unittest.run('main').write(shell);
}


var testSuite = new unittest.TestSuite('modules');

testSuite.addTest('env_test');
testSuite.addTest('modules.core.array_test');
testSuite.addTest('modules.helma.unittest_test');
