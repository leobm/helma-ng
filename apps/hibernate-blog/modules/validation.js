function validatePresenceOf(data, key) {
   var value = data[key];
   var name = key.capitalize();
   if (!value) {
      throw new Error(name + ' was empty.');
   }
}


function validateFormatOf(data, key, regex, condition) {
   var value = data[key];
   var name = key.capitalize();
   var evaluation = (condition && condition == '!match') ? value.match(regex) : !value.match(regex);
   if (evaluation) {
      throw new Error(name + ' format was wrong.');
   }
}
