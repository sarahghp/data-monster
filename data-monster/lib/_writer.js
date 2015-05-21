var fs        = require('fs'),
    util      = require('util'),
    _         = require('lodash'),
    pretty    = require('js-object-pretty-print').pretty, // unpacks objects
    beautify  = require('js-beautify').js_beautify;      // formats output

var flags = { tt   : false,
              axis : false  }; // is set to true by tooltips/axes, to output companion files

function buildString(structure){
 
 var choms      = structure,
     output     = "",                   // this is the string that will be built
     keys       = Object.keys(choms);  // these are the keys we need to build it

  var d3things = {
    // colors
    'category10'  : 'pre',
    'category20'  : 'pre',
    'category20b' : 'pre',
    'category20c' : 'pre',

    // axes
    'linear'      : 'pre',
    'log'         : 'pre',
    'identity'    : 'pre',
    'sqrt'        : 'pre',
    'pow'         : 'pre',
    'quantize'    : 'pre',
    'quantile'    : 'pre',
    'threshold'   : 'pre',
    'time'        : 'post'

  };


  // Utilty funcs (order: alpha)

  function biteBiteBite(toc, contents, str){
    var str      = str || "",
        biteName = toc.shift()
        bite     = contents[biteName]; 

    if(noms[biteName]){
      str += noms[biteName](bite, contents.parent);
    } else {
      str += defaultBite(bite, biteName) + "\n";
    }

    if (toc.length) { 
      return biteBiteBite(toc, contents, str);  
    } else {
      str += "; \n"
      return str;
    }
  }

  function eatVars(collection, parent){ // this is super confusing & wtf am I doing to collect
    var collect;

   if (_.isString(collection) || _.isNumber(collection)) {
      return collection;
    } else if (_.isArray(collection) && _.isString(collection[0])){
      return '"' +  collection[0] + '"';
    }

    _.forEach(collection, function(val, key){
      // iterate on collection and if a val is an object with property variable, replace that with the value in variable
      if(key === 'variable'){
        if (d3things[val]){
          collect = assembled3things(d3things[val], val); 
        } else {
          collect = lookup(val, parent);
        }
      } else if (typeof val === 'object' && val.hasOwnProperty('variable')){
        collect = Object.create(Object.prototype);
        if (d3things[val.variable]) {
          collect[key] = assembled3things(d3things[val.variable], val.variable); // passes pre or post as arg
        } else {
          collect[key] = lookup(val.variable, parent);
        }
      }
    });
    return collect;
  }

  function lookup(toFind, scope){

    if (choms[scope].hasOwnProperty('parent')){
      if (choms[scope].hasOwnProperty(toFind)){
        return choms[scope][toFind];
      } else {
        lookup(toFind, choms[parent]);
      }
    } else {
      console.log(toFind + ' is not defined.')
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
   'attr'   : attrBite,
   'style'  : styleBite,
   'tooltip': ttBite,

   // events <- add more, consider method to take other DOM methods
    'click'     :   function(args){ return eventBite(args)('click')},
    'mouseover' :   function(args){ return eventBite(args)('mouseover')},
    'mouseenter':   function(args){ return eventBite(args)('mouseenter')},
    'mouseleave':   function(args){ return eventBite(args)('mouseleave')},
    'hover'     :   function(args){ return eventBite(args)('hover')},
  }

  function attrBite(bite, parent){
    var ministr = "",
        miniobj = Object.create(Object.prototype);

    _.forEach(bite, function(el){
      miniobj[el[0]] = eatVars(el[1], parent);
    })

    return ".attr(" + pretty(miniobj, 4, "JSON") + ")"; 
  }

  function styleBite(bite, parent){
    var ministr = "",
        miniobj = Object.create(Object.prototype);

    _.forEach(bite, function(el){
      miniobj[el[0]] = eatVars(el[1], parent);
    })

    return ".style(" + pretty(miniobj, 4, "JSON") + ")"; 
  }

  function defaultBite(bite, biteName){
    return biteName + "(" + eatVars(bite) + ")";
  }

  function eventBite(bite){
    return function(type){
      return ".on('" + type + "', " + bite + ")";
    }
  }

  function ttBite (bite, parent){

    flags.tt = true;

    var pobj    = choms[parent],
        ministr = "";

    ministr+= ".on('mouseover', function(d){";
    ministr+= "var xPosition = event.clientX + scrollX < width - 200 ? event.clientX + scrollX : event.clientX + scrollX - 200,";
    ministr+= "yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,";
    ministr+= "text = ";

    if (bite.text === 'default') {
      ministr += pobj.xPrim + " + '; ' + " + pobj.yPrim;
    } else {
      ministr += bite.text;
    }

    ministr+= ";";
    ministr+= "d3.select('#tooltip')";
    ministr+= ".style('left', xPosition + 'px')";
    ministr+= ".style('top', yPosition + 'px')";
    ministr+= ".select('#values')";
    ministr+= ".text(text);";
    ministr+= "d3.select('#tooltip').classed('hidden', false); })";
    ministr+= ".on('mouseout', function(){";
    ministr+= "d3.select('#tooltip').classed('hidden', true); })";

    return ministr;
  }

  // Mini Assemblers (listed alpha)

  function assembleAxes(type, itself){
    flags.axis = true;

    var ministr   = "",
        minitype  = type.slice(0,1),  
        inkey     = Object.keys(itself[type]);

    function innerAssemble(kind, content){
      var tinystr   = "",
          defOrient = { x: 'bottom', y: 'left' };
      
      (kind === 'scale') && (tinystr += "." + kind + "(" + (content || (minitype + _.capitalize(kind))) + ")");
      (kind === 'orient') && (tinystr += "." + kind + "('" + (content || defOrient[minitype]) + "')");
      
      return tinystr;
    }

    ministr += "var " + type + " = d3.svg.axis()";
    ministr += itself[type].hasOwnProperty('scale') ? innerAssemble('scale', itself[type].scale) : innerAssemble('scale');
    ministr += itself[type].hasOwnProperty('orient') ? innerAssemble('orient', itself[type].orient) : innerAssemble('orient');
    ministr += ";";

    ministr += "svg.append('g')";
    ministr += ".attr('class','" + minitype + " axis')";
    
    (minitype === 'x') && (ministr += ".attr('transform', 'translate(0,' + height + ')')");

    ministr += ".call(" + type + ")";
    ministr += ".append('text')";

    inkey = _.pull(inkey, 'scale', 'orient', 'parent');
    
    ministr += (biteBiteBite(inkey, itself[type]));
    

    return ministr;
  }


  function assembled3things(director, itself, inter){ // expect to use inter later
    if(director === 'pre'){
      return 'd3.scale.' + itself;
    } else if (director === 'post'){
      return 'd3.' + itself + '.scale'
    } else {
      console.log('Cannot assemble d3things; unknown director.');
    }
  }

  function assembleMaxes(itself){
    var ministr = "";
    ministr+= "var maxY = d3.max(data, function(d){return " +  itself.yPrim + " }),";
    ministr+= "maxX = d3.max(data, function(d){return " + itself.xPrim + "});"; 
    ministr+= "maxY = maxY + (maxY * .25); // Make it a little taller \n";

    return ministr;
  }

  function assembleScale(director, type, itself){
    var ministr = "";
    

    if(director === 'user'){
      var obn = itself[type + "Scale"];
      
      ministr += eatVars(obn.scale) + "()";
      ministr += ".domain([" + obn.domain.short_params[0] + ", " + obn.domain.short_params[1] + "])";
      ministr += ".range([" + obn.range.short_params[0] + ", " + obn.range.short_params[1] + "])";
      
      (type === 'x') && (ministr += ", ");
    
    } else if (director === 'default'){
      (type === 'x') && (ministr += "d3.scale.linear().domain([0, maxX]).range([0, width])");
      (type === 'y') && (ministr += "d3.scale.linear().domain([0, maxY]).range([height, 0])");  
    
    } else {
      console.log('Cannot assemble scale; unknown director.');
    }

    return ministr;

  }


  // Main Assmemblers (listed bottom to top)

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
    str += ".attr(" + pretty(eatVars(obk.req_specs, obk.parent), 4, 'PRINT', true) + ")";

    inkey = _.pull(inkey, 'parent', 'type', 'req_specs');

    // check if inkey still has length
    // if so str += results of biteBiteBite

    inkey.length && (str += biteBiteBite(inkey, obk));

    return str;

  }

  function assembleRestAtoms(keyArray){
    var str = "",
        arr = _.drop(keyArray); // drop original child atom already consumed by assembleFirstAtom

    _.forEach(arr, function(el){
      var obk = choms[el],
          inkey = Object.keys(obk);

      str += "svg.append('g')";
      str += ".attr('class', ";
      str += (obk.elemSelect || "'elements'") + ")";
      str += ".append('" + obk.type + "')"
      str += ".attr(" + pretty(eatVars(obk.req_specs, obk.parent), 4, 'PRINT', true) + ")";

      inkey = _.pull(inkey, 'parent', 'type', 'req_specs');

      // check if inkey still has length
      // if so str += results of biteBiteBite

      inkey.length && (str += biteBiteBite(inkey, obk));

    });

    return str;

  }


  // call this for each object in canvasKeys
  function assembleDrawFuncs(key){
    var str     = "",
        obk     = choms[key],
        obl     = Object.create(Object.prototype),
        inkey   = Object.keys(obk),
        margins; 

  if (obk.margins){
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
      console.log('Error: Incorrect margin arity');
    }
  } else {
    obl.top     = 0;
    obl.right   = 0;
    obl.bottom  = 0;
    obl.left    = 0;
  }
    

    // set data width & height to calculated versions for use in eatVars 
    
    obk.width   = obk.width - obl.left - obl.right;
    obk.height  = obk.height - obl.top - obl.bottom;

    // check for global funcs
    if(choms[obk.parent].hasOwnProperty('funcs')){
      _.forEach(choms[obk.parent].funcs, function(el){
        str += el;
      });
    }

    // open func
    str += "function draw_" + key + "(data){ ";

    // check for canvas-scoped funcs
    if(obk.hasOwnProperty('funcs')){
      _.forEach(obk.funcs, function(el){
        str += el;
      });
    }

    // canvas vars — width & height are less idiomatic / precalculated for use throughout
    str += "var margin = " + pretty(obl) + ", ";
    str += "width = " + obk.width +  ", ";
    str += "height = " + obk.height + ";";

    if(!(obk.hasOwnProperty('xScale') && obk.xScale.hasOwnProperty('domain')) || 
       !(obk.hasOwnProperty('yScale') && obk.yScale.hasOwnProperty('domain'))) {
      str += assembleMaxes(obk);
    }

    str += "var xScale = "
    str += obk.hasOwnProperty('xScale') ? assembleScale('user', 'x', obk) : assembleScale('default', 'x') + ", ";
    str += "yScale = ";
    str += obk.hasOwnProperty('yScale') ? assembleScale('user', 'y', obk) : assembleScale('default', 'y');
    str += obk.hasOwnProperty('color') ? (", \n color = " + eatVars(obk.color) + "();") : ";";

    // add in axes, if they exist
    (obk.hasOwnProperty('xAxis')) && (str += assembleAxes('xAxis', obk));
    (obk.hasOwnProperty('yAxis')) && (str += assembleAxes('yAxis', obk));  

    // add in svg
    str += "var svg = d3.select('" + obk.selector + "')";
    str += ".append('svg')";
    str += ".attr('width', width  + margin.left + margin.right)";
    str += ".attr('height', height + margin.top + margin.bottom)";
    str += ".append('g')";
    str += ".attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');";

    // first element
    obk.children.length && (str += assembleFirstAtom(obk.children[0]));

    // any other elements
    (obk.children.length) > 1 && (str += assembleRestAtoms(obk.children) + ';\n');

    // bite anything not taken care of
    inkey = _.pull(inkey, 'parent','width','height','margins','selector','color','funcs','xScale', 'yScale', 'children','xPrim','yPrim','xAxis','yAxis');  
    inkey.length && (str += biteBiteBite(inkey, obk));

    // close it up!
    str += "};"
    return str;
  }

  // call this for each object in dataKeys
  function assembleQueues(key){
    var str = "",
        obk = choms[key];

    str += "function draw_" + key + "(rawData){";

    // do data cleaning

    str += "rawData.forEach(" + obk.clean + ");";

    // call child canvases

    str += stringifyList(obk.children, 'draw_', '(rawData)', '; ') + '} \n\n';
    str += "queue().defer(d3" + obk.filetype + ", '";
    str += obk.file + "')";
    str += ".await( function(err, data) { ";
    str += "if(err){ console.log(err) } ";
    str += "draw_" + key + "(data); } );";

    return str;  

  }

  // populate output in the right order > does this need to be wrapped? probably not
  (function metaAssemble(){

      var canvasKeys = _.filter(keys, function(el){
        return el.match('canvas');
      });

      var dataKeys = _.filter(keys, function(el){
        return el.match('data');
      });

      _.forEach(canvasKeys, function(el){
        output += assembleDrawFuncs(el);
      });

      _.forEach(dataKeys, function(el){
        output +=  assembleQueues(el);
      });

      // fs.writeFile('output.js', output);

    })();
  
  return beautify(output, {"break_chained_methods": true}); 
  // console.log(util.inspect(output, false, null));
   
}

exports.string  = buildString;
exports.flags   = flags;