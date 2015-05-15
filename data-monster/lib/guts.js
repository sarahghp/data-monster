var _    = require('lodash');

exports.finder = function finder (collection, tests, label){
  if (label) {
    return _.result(_.find(collection, tests), label);
  } else {
    return _.find(collection, tests);
  }
}