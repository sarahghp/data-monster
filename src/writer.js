var fs    = require('fs'),
    util  = require('util'),
    _     = require('lodash'),
    pretty = require('js-object-pretty-print').pretty,    
    choms = require('./parser.js').structure;

function buildString(){
 
 var output     = "",                      // this is the string that will be built
     keys       = Object.keys(choms),  // these are the keys we need to build it
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

  function biteBiteBite(toc, contents, str){
    var str      = str || "",
        biteName = toc.shift()
        bite     = contents[biteName]; 

    str += noms[biteName](bite);

    if (toc.length) { 
      return biteBiteBite(toc, contents, str);  
    } else {
      return str;
    }
  }

  function stringifyList(list, prepend, append, punc){
    var ministr = "";

    _.forEach(list, function(el){
      ministr += prepend + el + append + punc;
    });

    return ministr;
  }

  // Noms & funcs

  var noms = {
   'attr':    attrBite,
   'click':   clickBite,
   'xScale':  scaleBite
  }

  function attrBite(bite){
    var ministr = "",
        miniobj = Object.create(Object.prototype);

    _.forEach(bite, function(el){
      miniobj[el[0]] = el[1];
    })

    return ".attr(" + pretty(miniobj) + ")"; 
  }

  function clickBite(bite){
    return ""
  }

  function scaleBite(bite){
    return ""
  }

  // Assemblers


  // call this for each object in elemKeys || call on children of everything in canvasKeys and eliminate elKeys?
  function assembleFirstAtom(key){
    var obk   = choms[key],
        inkey = Object.keys(obk),
        str   = "";

    str += "svg.selectAll('" + obk.type + "')"; 
    str += ".data(data)"; // data comes in via draw queue
    str += ".enter()";
    str += ".append('g')";
    str += ".attr('class', ";
    str += obk.elemSelect || "'elements'";
    str += ")";
    str += ".append('" + obk.type + "')";
    str += ".attr(" + pretty(obk.req_specs, 4, 'PRINT', true) + ")";

    // remove 'parent', 'type', 'req_specs' from inkey

    inkey = _.pull(inkey, 'parent', 'type', 'req_specs');

    // check if inkey still has length
    // if so str += results of biteBiteBite

    inkey.length && (str += biteBiteBite(inkey, obk));

    return str;

  }


  // call this for each object in canvasKeys
  function assembleDrawFuncs(key){
    var str     = "",
        obk     = choms[key],
        obl     = Object.create(Object.prototype),
        margins = obk.margins.short_params;

    // process margins
    if (margins.length === 4){
      obl.top     = +margins[0];
      obl.right   = +margins[1];
      obl.bottom  = +margins[2];
      obl.left    = +margins[3];
    } else if (margins.length === 3){
      obl.top     = +margins[0];
      obl.right   = +margins[1];
      obl.bottom  = +margins[2];
      obl.left    = +margins[1];
    } else if (margins.length === 2){
      obl.top     = +margins[0];
      obl.right   = +margins[1];
      obl.bottom  = +margins[0];
      obl.left    = +margins[1];
    } else if (margins.length === 1){
      obl.top     = +margins[0];
      obl.right   = +margins[0];
      obl.bottom  = +margins[0];
      obl.left    = +margins[0];
    } else {
      throw('Error: Incorrect margin arity');
    }

    // open func
    str += "function draw-" + key + "(data){ \n"

    // canvas vars
    str += "var margin = " + pretty(obl) + ", \n"
    str += "width = " + obk.width + " - margin.left - margin.right, \n"
    str += "height = " + obk.height + " - margin.top - margin.bottom; \n"


    // add in svg
    str += "d3.select('" + obk.selector + ")"
    str += ".append('svg')"
    str += ".attr('width', width  + margin.left + margin.right)"
    str += ".attr('height', height + margin.top + margin.bottom)"
    str += ".append('g')"
    str += ".attr('transform', 'translate(' + margin.left + ', ' + margin.top ')');"






    str += "};"
    return str;
  }

  // call this for each object in dataKeys
  function assembleQueues(key){
    var str = "",
        obk = choms[key];

    str += "function draw-" + key + "(rawData){\n"

    // do data cleaning

    str += "rawData.forEach(" + obk.clean + ");\n\n"

    // call child canvases

    str += stringifyList(obk.children, 'draw-', '(rawData)', '; ') + '}'
    str += "\n\n"
    str += "queue().defer(d3" + obk.filetype + ", '"
    str += obk.file + "')"
    str += ".await( function(err, data) { \n"
    str += "if(err){ console.log(err) } \n"
    str += "draw-" + key + "(data); } );"

    return str;  

  }

  // once I have a bunch of strings populate output in the right order
  function metaAssemble(){
    // output += all the draw functions <- reduce
    // output += the queue functions
    // return output
  }

  popArrs();
  // output += assembleFirstAtom(elemKeys[0]);
  // output += assembleQueues(dataKeys[0]);
  output += assembleDrawFuncs(canvasKeys[0]);
  fs.writeFile('output.txt', output);
  // console.log(util.inspect(output, false, null));
  return output;  
}

module.exports = buildString();