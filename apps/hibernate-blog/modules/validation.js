importModule('helma.hibernate', 'db');


function validatePresenceOf(value, params) {
   if (!value) {
      throw new Error(params.msg);
   }
}


function validateLengthOf(value, params) {
   if ( (params.max && (value.length > params.max)) ||
        (params.min && (value.length < params.min)) ) {
      throw new Error(params.msg);
   }
}


function validateFormatOf(value, params) {
   var evaluation = (params.match == 'false') ?
                    value.match(params.regex) :
                    !value.match(params.regex);

   if (evaluation) {
      throw new Error(params.msg);
   }
}


function validateUniquenessOf(value, params) {
   var query = 'where ' + params.type.name.substring(0, 1).toLowerCase() +
               '.' + params.key + " = '" + value + "'";

   if (db.store.find(params.type.name, query).size() > 0) {
      throw new Error(params.msg);
   }
}
