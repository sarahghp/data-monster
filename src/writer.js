var chom = require('./parser.js').structure,
    _    = require('lodash');

function buildString(){
 
 var output     = "",                      // this is the string that will be built
     keys       = Object.keys(chom),  // these are the keys we need to build it
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

  }


  // call this for each object in elemKeys || call on children of everything in canvasKeys and eliminate elKeys?
  function assembleFirstAtom(key){
    var obk = chom[key],
        str = "";

    // str += "svg.selectAll(" + obk.type + ")" 
    // str += ".data(data)" // data comes in via draw queue
    // str += ".enter()"
    // str += ".append('g')"
    // str += ".attr('class', "
    // str += obk.elemSelect || 'elements'
    // str += ")"
    // str += ".append('" + obk.type + "')"
    // str += ".attr(" + obk.req_specs + ")"
    // str +=
    // str +=
    // str +=
    // str +=
    // str +=
    // str +=
    // str +=
    // str +=




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

  return output;  
}

module.exports = buildString();