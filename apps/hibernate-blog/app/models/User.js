importModule('helma.hibernate', 'db');
importFromModule('validation', '*');


function User(props) {

   return new db.Storable(this, props);
}
db.store.registerType(User);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      createTime: new java.util.Date(),
      name: data.name,
      password: data.password.md5(),
      isAdmin: (User.all().size() == 0) ? true : false
   };
   var user = new User(props);
   user.save();

   return this.doLogin(data);
}

function validateCreate(data) {
   validatePresenceOf(data, 'name');
   validatePresenceOf(data, 'password');
}


function doLogin(data) {
   var userQuery = "where u.name = '" + data.name + "' and u.password = '" + data.password.md5() + "'";
   var userQueryResult = User.find(userQuery);

   if (userQueryResult[0] && (userQueryResult[0].id == session.data.userId)) {
      throw new Error('User "' + userQueryResult[0].name + '" is already logged in.');
   } else if (userQueryResult[0]) {
      session.data.userId = userQueryResult[0].id;
      return 'Hello ' + userQueryResult[0].name + '!';
   } else {
      throw new Error('Login failed.');
   }
}


function doLogout() {
   if (User.all().size() == 0) {
      throw new Error('No user registered yet.');
   } else if (!session.data.userId) {
      throw new Error('No user was logged in.');
   } else {
      session.data.userId = null;
      return 'Goodbye!';
   }
}
