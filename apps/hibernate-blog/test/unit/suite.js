importFromModule('helma.unittest', 'TestSuite');


var testSuite = new TestSuite('unit.models');

testSuite.addTest('test.env_test');
testSuite.addTest('test.unit.models.user_test');
testSuite.addTest('test.unit.models.article_test');
testSuite.addTest('test.unit.models.comment_test');
