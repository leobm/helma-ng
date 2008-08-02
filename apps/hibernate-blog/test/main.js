importJar('mysql-connector-java-5.1.6-bin.jar');
importJar('../config/cache');

importModule('helma.unittest', 'unittest');
importModule('helma.shell', 'shell');


function main() {
   unittest.run('main').write(shell);
}


var testSuite = new unittest.TestSuite('hibernateBlog');

testSuite.addTest('envTest');
testSuite.addTest('models.ArticleTest');
testSuite.addTest('models.UserTest');
