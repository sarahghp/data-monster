var _    = require('lodash'),
    fs       = require('fs');

var defaultKeyMsg = 'No default key passed but default key needed!';
/**
 * Add any number of key value pairs into a new or existent object
 * @param {obj} pairs to be added in
 * @param {obj} obj   object to add them to
 */
exports.addInto = function addInto(pairs, obj){
  var obj = obj || {};
  _.forEach(pairs, function(val, key){
    obj[key] = val;
  });
  return obj;
}

/**
 * Uses find and a series of tests to select an item from a collection
 * Can be used with result to find a value from a key-value pair
 * @param  {obj or array} collection collection to inspect
 * @param  {fn}           tests      function that returns the tests; what you wuld pass to find
 * @param  {str}          label      optional key if you want only value returned
 * @return {obj or string}           first matching value
 */
exports.finder = function finder (collection, tests, label){
  if (label) {
    return _.result(_.find(collection, tests), label);
  } else {
    return _.find(collection, tests);
  }
}

exports.isHashMap = function isHashMap(check){
  return _.isObject(check) && !(_.isArray(check)); // don't have to check for null, since _.isObject filters that out
}

/**
 * Concatenate a pair of arrays into an object
 * @param  {arr} pairArrays 2D array of pairs
 * @param  {obj} toObj      object to add them into
 * @param  {str} defaultKey string to use for key if none is a available
 * @return {obj}            created or mutated object
 */
exports.objectify = function objectify (pairArrays, toObj, defaultKey){
  _.forEach(pairArrays, function(pair){
    if (pair.length < 2) {
      if (!defaultKey) throw new Error(defaultKeyMsg + 'Offender:' + pair[0]);
      toObj[defaultKey] = pair[0];
    } else {
      toObj[pair[0]] = pair[1];
    }
  });
  return toObj;
}

/**
 * Read from one directory, check for file type, pipe to another
 * @param  {str} inputBase  originating directory
 * @param  {str} outputBase target directory
 * @param  {str} key        file basename
 * @param  {str} extension  file extension
 * @return {fn}             pip call
 */
exports.readWrite = function readWrite(inputBase, outputBase, key, extension){
  if (_.includes(fs.readdirSync(inputBase), [key, extension].join(''))){
    return fs.createReadStream([inputBase, key, extension].join(''))
           .pipe(fs.createWriteStream([outputBase, key, extension].join('')));
  }
}

/**
 * Way to iterate over AST-like structures where the value of one known 
 * key should be set to the value of another
 * @param {str} A new key
 * @param {str} B new value
 */
exports.setAtoB = function setAtoB(A, B){
  return function (objArray, toObj, defaultKey){
    _.forEach(objArray, function(obj){
      if (!obj[A]){
        if (!defaultKey) throw new Error(defaultKeyMsg);
        toObj[defaultKey] = obj;
      } else {
        toObj[obj[A]] = obj[B];
      }
    });
    return toObj;
  }
}

exports.thereIsMore = function thereIsMore(check){
  return _.isArray(check) && _.rest(check).length;
}