importJar('lib/mysql-connector-java-5.1.6-bin.jar');
importJar('config/cache');

importModule('helma.unittest', 'unittest');
importModule('helma.hibernate', 'db');

importModule('modules.typeExtensions');


db.setConfigPath('config/test');

unittest.run('test.suite');
