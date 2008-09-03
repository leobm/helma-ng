/**
 * To be used to mixin all ("public") instance methods of specified constructor to object.
 */
function mixin(object, constructor) {
   if (!(object instanceof Object) || !(object.constructor instanceof Function)) {
      throw new Error('target object must be an object, is: ' + object);
   }
   if (!(object.constructor instanceof Function)) {
      throw new Error('target object must have a constructor property, has: ' + object.constructor);
   }

   if (!(constructor instanceof Function)) {
      throw new Error('mixin object constructor must be a function, is: ' + constructor);
   }

   if (typeof object.constructor.name != 'string') {
      throw new Error("couldn't get type: " + object.constructor.name);
   }
   if (typeof constructor.name != 'string') {
      throw new Error("couldn't get type: " + constructor.name);
   }

   var instance = new constructor();

   for (i in instance) {
      object[i] = instance[i];
   }
}
