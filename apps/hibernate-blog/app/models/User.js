importModule('helma.hibernate', 'db');

importFromModule('model', '*');
importFromModule('validation', '*');


function User(props) {

   return new db.Storable(this, props);
}
db.store.registerType(User);


function doCreate(data) {
   this.validateCreate(data);

   var props = {
      createTime: new java.util.Date(),
      name: data.name.stripTags(),
      password: data.password.stripTags().md5(),
      websiteUrl: (data.websiteUrl && !data.websiteUrl.startsWith('http://') &&
                   !data.websiteUrl.startsWith('https://')) ?
                  'http://' + data.websiteUrl.stripTags() : data.websiteUrl.stripTags() || null,
      isAdmin: (User.all().size() == 0) ? true : false
   };
   var user = new User(props);
   user.save();

   var msg = 'User "' + user.name + '" was registered successfully.';

   return new Result(msg, user);
}

function validateCreate(data) {
   validatePresenceOf(data.name.stripTags(), { msg: 'Name was empty.' });
   validatePresenceOf(data.password.stripTags(), { msg: 'Password was empty.' });
   if (data.websiteUrl) {
      validateFormatOf(data.websiteUrl.stripTags(), { regex: /^(https?:\/\/)?[A-Za-z0-9\.-]{2,}\.[A-Za-z]{2}/,
                                                      msg: 'Website URL was invalid.' });
   }
   validateUniquenessOf(data.name.stripTags(), { key: 'name', type: User,
                                                 msg: 'User name "' + data.name.stripTags() + '" already exists.'});
}


function doDelete(id) {
   var user = User.get(id);
   user.remove();

   return new Result('User was deleted successfully.');
}


function doLogin(data) {
   var userQuery = "where u.name = '" + data.name.stripTags() + "' and u.password = '" +
                   data.password.stripTags().md5() + "'";
   var userQueryResult = User.find(userQuery);

   if (userQueryResult[0] && (userQueryResult[0].id == session.data.userId)) {
      throw new Error('User "' + userQueryResult[0].name + '" is already logged in.');
   } else if (userQueryResult[0]) {
      session.data.userId = userQueryResult[0].id;
      return new Result('Hello ' + userQueryResult[0].name + '!');
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
      return new Result('Goodbye!');
   }
}


function getSessionUser() {
   return session.data.userId ? User.get(session.data.userId) : null;
}
