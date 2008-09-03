importJar('lib/mysql-connector-java-5.1.6-bin.jar');

importModule('helma.hibernate', 'db');


if (__name__ == '__main__') {
   db.setConfigPath('config/dev');
   db.rebuildDbSchema();
}
