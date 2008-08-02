importJar('mysql-connector-java-5.1.6-bin.jar');
importJar('../config/cache');

importModule('helma.unittest', 'unittest');


function main() {
   unittest.run('main');
}


var testSuite = new unittest.TestSuite('hibernateBlog');

testSuite.addTest('env_test');
testSuite.addTest('models.Article_test');
testSuite.addTest('models.User_test');
