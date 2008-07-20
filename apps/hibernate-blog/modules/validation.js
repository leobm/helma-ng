function validatePresenceOf(params) {
   if (!params.value) {
      throw new Error(params.msg);
   }
}


function validateFormatOf(params) {
   var evaluation = (params.condition && params.condition == '!match') ?
                    params.value.match(params.regex) :
                    !params.value.match(params.regex);

   if (evaluation) {
      throw new Error(params.msg);
   }
}


function validateUniquenessOf(params) {
   var query = 'where ' + params.type.name.substring(0, 1).toLowerCase() + '.' + params.key + " = '" + params.value + "'";

   if (params.type.find(query).size() > 0) {
      throw new Error(params.msg);
   }
}
