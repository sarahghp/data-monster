var _    = require('lodash');


exports.addInto = function addInto(pairs, obj){
  var obj = obj || {};
  _.forEach(pairs, function(val, key){
    obj[key] = val;
  });
  return obj;
}

exports.finder = function finder (collection, tests, label){
  if (label) {
    return _.result(_.find(collection, tests), label);
  } else {
    return _.find(collection, tests);
  }
}

exports.objectify = function objectify (pairArrays, toObj, defaultKey){
  _.forEach(pairArrays, function(pair){
    if (pair.length < 2) {
      toObj[defaultKey] = pair[0];
    } else {
      toObj[pair[0]] = pair[1];
    }
  });
  return toObj;
}

exports.setAtoB = function setAtoB(A, B){
  return function (objArray, toObj, defaultKey){
    _.forEach(objArray, function(obj){
      if (!obj[A]){
        toObj[defaultKey] = obj;
      } else {
        toObj[obj[A]] = obj[B];
      }
    });
    return toObj;
  }
}