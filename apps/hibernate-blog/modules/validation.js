function validatePresenceOf(value, name) {
   if (!value) {
      throw new Error(name + ' was empty.');
   }
}


function validateFormatOf(value, name, regex, condition) {
   var evaluation = (condition && condition == '!match') ? value.match(regex) : !value.match(regex);
   if (evaluation) {
      throw new Error(name + ' format was wrong.');
   }
}
