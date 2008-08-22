importFromModule('helma.unittest', 'TestSuite');


var testSuite = new TestSuite('Hibernate Blog');

testSuite.addTest('test.env_test');
testSuite.addTest('test.models.user_test');
testSuite.addTest('test.models.article_test');
