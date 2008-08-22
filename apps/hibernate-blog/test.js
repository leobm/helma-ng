importJar('lib/mysql-connector-java-5.1.6-bin.jar');
importJar('config/cache');

importModule('helma.unittest', 'unittest');
importModule('helma.hibernate', 'db');

importModule('modules.typeExtensions');


if (__name__ == '__main__') {
   db.setConfigPath('config/test');

   unittest.run('test.suite');
}
