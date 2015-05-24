var fs        = require('fs'),
    util      = require('util'),
    _         = require('lodash'),
    pretty    = require('js-object-pretty-print').pretty, // unpacks objects
    beautify  = require('js-beautify').js_beautify,      // formats output
    guts      = require('./guts.js'),
    flags     = { tt   : false,
                  axis : false  };                      // to output companion files

function buildString(structure){

  // LISTS
  var noms = {
    // special assemblies
    data   : dataBite,
    canvas : canvasBite,
    elem   : function(arg) { /* console.log('elem', arg); */ return util.inspect(arg, false, null)},
    xAxis  : function(arg) { /* console.log('xAxis', arg); */ return util.inspect(arg, false, null)},
    yAxis  : function(arg) { /* console.log('yAxis', arg); */ return util.inspect(arg, false, null)},
    xScale : function(arg) { /* console.log('xScale', arg); */ return util.inspect(arg, false, null)},
    yScale : function(arg) { /* console.log('yScale', arg); */ return util.inspect(arg, false, null)},
    closer : function(arg) { return arg },
   
   // special processes 
    attr   : _.partial(prettyBite,".attr"),
    style  : _.partial(prettyBite,".style"),
    color  : _.partial(makeVar, "color"),
   
   //  tooltip: ttBite,
    clean  : cleanBite,
    funcs  : funcsBite,

   // shorthand events
    click     :   _.partial(eventBite, "click"),
    mouseover :   _.partial(eventBite, "mouseover"),
    mouseenter:   _.partial(eventBite, "mouseenter"),
    mouseleave:   _.partial(eventBite, "mouseleave"),
    hover     :   _.partial(eventBite, "hover"),
     
   //  process functions
   variable     : eatVars,
   'function'   : eatFuncs,
   params       : eatParams,
  },

  d3things = {
    // colors
    category10  : _.partial(assembled3things, 'pre', 'scale'),
    category20  : _.partial(assembled3things, 'pre', 'scale'),
    category20b : _.partial(assembled3things, 'pre', 'scale'),
    category20c : _.partial(assembled3things, 'pre', 'scale'),

    // axes
    linear      : _.partial(assembled3things, 'pre', 'scale'),
    log         : _.partial(assembled3things, 'pre', 'scale'),
    identity    : _.partial(assembled3things, 'pre', 'scale'),
    sqrt        : _.partial(assembled3things, 'pre', 'scale'),
    pow         : _.partial(assembled3things, 'pre', 'scale'),
    quantize    : _.partial(assembled3things, 'pre', 'scale'),
    quantile    : _.partial(assembled3things, 'pre', 'scale'),
    threshold   : _.partial(assembled3things, 'pre', 'scale'),
    time        : _.partial(assembled3things, 'post', 'scale')

  };

  // SMALL FUNCS
  function atomicBite(meth, arg){
    return meth + "(" + arg + ")";
  }

  function cleanBite(val){
    eval('var moo = function(d){ ' + val['function'] + '; }');
    return 'rawData.forEach(' + moo + ');';
  }

  function eventBite(type, bite){
    return atomicBite(".on", stringWrap(type) + ", " + bite['function']);
  }

  function funcsBite(val){
    return val['function'];
  }

  function prettyBite(prefix, bite){
    return atomicBite(prefix, pretty(guts.objectify(bite, {}) , 4, "JSON"));
  }
  
  function stringWrap(check){
    return _.isString(check) ? '"' + check + '"' : check;
  }

  function dExpand(toExpand){
    return function(d) { return toExpand }
  }

  function makeVar(v, val){
    return 'var ' + v + ' = ' + process(val) + ';';
  }

  // BIG BITES
  function dataBite(bite){
    var str = "";
    str += "function draw_" + bite.name + "(rawData){";
    str +=  bite.clean ? cleanBite(bite.clean) : '';
    str += _.map(bite.children, function(c){
        return 'draw_' + c + '(rawData);'
    }).join('');
    str += '} \n\n'
    str += "queue().defer(d3" + bite.filetype + ", '";
    str += bite.file + "')";
    str += ".await( function(err, data) { ";
    str += "if(err){ console.log(err) } ";
    str += "draw_" + bite.name + "(data); } );";
    return str;
  }

  function canvasBite(bite){
    var str = "",
        margins = bite.margins ? 
                  assembleMargins(eatParams(bite.margins)) : 
                  { top: 0, right: 0, bottom: 0, left: 0 };
    
    bite.width   = bite.width - margins.left - margins.right;
    bite.height  = bite.height - margins.top - margins.bottom;

    str += "var margin = " + pretty(margins) + ", ";
    str += "width = " + bite.width +  ", ";
    str += "height = " + bite.height + ";";
    str += "var svg = d3.select('" + bite.selector + "')";
    str += ".append('svg')";
    str += ".attr('width', width  + margin.left + margin.right)";
    str += ".attr('height', height + margin.top + margin.bottom)";
    str += ".append('g')";
    str += ".attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');";
    return str;
  }

  // ASSEMBLERS
  function assembled3things(director, label, itself){
    if(director === 'pre'){
      return 'd3.' + label + '.' + itself + '()';
    } else if (director === 'post'){
      return 'd3.' + itself + '.' + label + '()';
    } else {
      throw new Error('Cannot assemble d3things; unknown director.');
    }
  }

  function assembleMargins(margins){
    var obj = {};
    if (margins.length === 4){
      obj.top     = +margins[0];
      obj.right   = +margins[1];
      obj.bottom  = +margins[2];
      obj.left    = +margins[3];
    } else if (margins.length === 3){
      obj.top     = +margins[0];
      obj.right   = +margins[1];
      obj.bottom  = +margins[2];
      obj.left    = +margins[1];
    } else if (margins.length === 2){
      obj.top     = +margins[0];
      obj.right   = +margins[1];
      obj.bottom  = +margins[0];
      obj.left    = +margins[1];
    } else if (margins.length === 1){
      obj.top     = +margins[0];
      obj.right   = +margins[0];
      obj.bottom  = +margins[0];
      obj.left    = +margins[0];
    } else {
      throw new Error('Incorrect margin arity');
    }
    return obj;
  } 


  // PROCESS FUNCS
   
  function eatVars(varObj, parent){
    return _.includes(_.keys(d3things), varObj.variable) ?
        d3things[varObj.variable](varObj.variable)
      : varObj.variable.match(/\bd\./) ?
        dExpand(varObj.variable)
      : lookup(varObj.variable, parent);
  }

  function eatFuncs(funcObj){
    eval('var moo = ' + funcObj['function']);
    return moo;
  }

  function eatParams(paramsObj){
    return paramsObj.params;
  }

  function lookup(toFind, scope){
    console.log('lookup called', toFind, scope);
    var lookat = _.filter(structure, function(f){
      return _.includes(_.keys(f), 'parent') && f.parent === scope;
    });

    var val = _.findLast(lookat, function(n){
      return _.inclues(_.keys(n), toFind);
    });

    if (val) return val;

    var grandparent =  _.result(_.findWhere(structure, { name: scope }), 'parent');
    if (grandparent) return lookup(toFind, grandparent);

    throw new Error('ReferenceError: ' + toFind + ' is not defined.')
    // find everything with the same parent
    // do any contain what you are looking for in the keys? if yes, return val
    // if not, call again, passing grandparent as scope
    // if no grandparent, error
  }

  // WORKHORSE FUNCS
  
  function process(value, parent){
    return guts.isHashMap(value) ?
        noms[_.keys(value)](value, parent)
      : stringWrap(value);
  }

  function build(expressions){
    // console.log('EXPS', expressions);
    return _.map(expressions, function(exp){
      if (guts.isHashMap(exp)){
        var key = _.first(_.keys(_.omit(exp, 'parent')));
        return _.includes(_.keys(exp), 'name') ?
             noms[exp.name.split('_')[0]](exp)
           : _.includes(_.keys(noms), key) ?
             noms[key](exp[key])
           : atomicBite(key, process(exp[key], exp.parent));
      } else {
        throw new Error('Invalid input:' + exp);
      }
    }).join('');
  }

  function arrange(structure){
    var dataBites = _.filter(structure, function(f){ return _.has(f, 'name') && f.name.split('_')[0] === 'data' }),
        restBites = _.reject(structure, function(f){ return _.has(f, 'name') && f.name.split('_')[0] === 'data' });
        // console.log(restBites.concat(dataBites));
    return restBites.concat({closer: '}'}, dataBites);
  }

  // _.map(structure, arrange);
  // _.map(structure, build);
  console.log(beautify(_.map(_.map(structure, arrange), build).join(''), {"break_chained_methods": true}));
  // return beautify(_.map(structure, build).join(''), {"break_chained_methods": true});
}

exports.string  = buildString;
exports.flags   = flags;