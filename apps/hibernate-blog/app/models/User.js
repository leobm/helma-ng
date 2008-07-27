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
      websiteUrl: (data.websiteUrl && !data.websiteUrl.startsWith('http://') &&
                   !data.websiteUrl.startsWith('https://')) ?
                  'http://' + data.websiteUrl : data.websiteUrl || null,
      isAdmin: (User.all().size() == 0) ? true : false
   };
   var user = new User(props);
   user.save();

   return this.doLogin(data);
}

function validateCreate(data) {
   validatePresenceOf(data.name, { msg: 'Name was empty.' });
   validatePresenceOf(data.password, { msg: 'Password was empty.' });
   if (data.websiteUrl) {
      validateFormatOf(data.websiteUrl, { regex: /^(https?:\/\/)?[A-Za-z0-9\.-]{2,}\.[A-Za-z]{2}/,
                                          msg: 'Website URL was invalid.' });
   }
   validateUniquenessOf(data.name, { key: 'name', type: User,
                                     msg: 'User name "' + data.name + '" already exists.'})
}


function doLogin(data) {
   var userQuery = "where u.name = '" + data.name + "' and u.password = '" +
                   data.password.md5() + "'";
   var userQueryResult = User.find(userQuery);

   if (userQueryResult[0] && (userQueryResult[0].id == session.data.userId)) {
      throw new Error('User "' + userQueryResult[0].name + '" is already logged in.');
   } else if (userQueryResult[0]) {
      session.data.userId = userQueryResult[0].id;
      return 'Hello ' + userQueryResult[0].name + '!';
   } else {
      throw new Error('Login failed. Try again?');
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


function getSessionUser() {
   return (session.data.userId ? User.get(session.data.userId) : null);
}
