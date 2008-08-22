importFromModule('helma.unittest', 'TestSuite');


var testSuite = new TestSuite('app');

testSuite.addTest('test.env_test');
testSuite.addTest('test.models.user_test');
testSuite.addTest('test.models.article_test');
testSuite.addTest('test.models.comment_test');
