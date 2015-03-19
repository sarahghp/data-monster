var structure = require('./parser.js').structure,
    _         = require('lodash');

function buildString(){
 var output     = "",                      // this is the string that will be built
     keys       = Object.keys(structure),  // these are the keys we need to build it
     dataKeys   = [],
     canvasKeys = [],
     elemKeys   = [];

  // Utilty funcs
  function filterArr(type){
    return _.filter(keys, function(el){
      return el.match('' + type + '');
    });
  }

  // let's make more tables of contents over which to iterate!
  function popArrs(){

    dataKeys = filterArr('data');
    canvasKeys = filterArr('canvas');
    elemKeys = filterArr('elem');

    console.log(dataKeys, canvasKeys, elemKeys);
  }


  // call this for each object in canvasKeys
  function assembleDrawFuncs(){
    // var str = "";

    // str += "function draw" + i + "(){"





    // str += "};"
    // return str;
  }

  // call this for each object in dataKeys
  function assembleQueues(){

  }

  // once I have a bunch of strings populate output in the right order
  function metaAssemble(){
    // output += all the draw functions <- reduce
    // output += the queue functions
    // return output
  }

  popArrs();
  return output;  
}

module.exports = buildString();