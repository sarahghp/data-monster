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
    canvas : function(arg) { /* console.log('canvas', arg); */ return util.inspect(arg, false, null)},
    elem   : function(arg) { /* console.log('elem', arg); */ return util.inspect(arg, false, null)},
    xAxis  : function(arg) { /* console.log('xAxis', arg); */ return util.inspect(arg, false, null)},
    yAxis  : function(arg) { /* console.log('yAxis', arg); */ return util.inspect(arg, false, null)},
    xScale : function(arg) { /* console.log('xScale', arg); */ return util.inspect(arg, false, null)},
    yScale : function(arg) { /* console.log('yScale', arg); */ return util.inspect(arg, false, null)},
   
   // special processes 
    attr   : _.partial(prettyBite,".attr"),
    style  : _.partial(prettyBite,".style"),
   
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
    return meth + "(" + arg + ")"
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
  
  function assembled3things(director, label, itself){
    if(director === 'pre'){
      return 'd3.' + label + '.' + itself;
    } else if (director === 'post'){
      return 'd3.' + itself + '.' + label;
    } else {
      throw new Error('Cannot assemble d3things; unknown director.');
    }
  }

  function parensWrap(wrapper, val){
    return wrapper + '(' + val + ')';
  }

  function stringWrap(check){
    return _.isString(check) ? '"' + check + '"' : check;
  }

  function dExpand(toExpand){
    return function(d) { return toExpand }
  }

  // BIG WRITERS
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
    return restBites.concat(dataBites);
  }

  // _.map(structure, arrange);
  // _.map(structure, build);
  console.log(beautify(_.map(_.map(structure, arrange), build).join(''), {"break_chained_methods": true}));
  // return beautify(_.map(structure, build).join(''), {"break_chained_methods": true});
}

exports.string  = buildString;
exports.flags   = flags;