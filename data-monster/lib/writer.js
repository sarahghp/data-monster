var fs        = require('fs'),
    util      = require('util'),
    _         = require('lodash'),
    pretty    = require('js-object-pretty-print').pretty, // unpacks objects
    beautify  = require('js-beautify').js_beautify,      // formats output
    guts      = require('./guts.js'),
    flags     = { tt   : false,
                  axis : false  };                      // to output companion files

function buildString(structure){

  // Lists
  var noms = {
    // special assemblies
    data   : '',
    canvas : '',
    elem   : '',
    xAxis  : '',
    yAxis  : '',
    xScale : '',
    yScale : '',
   // // special processes 
   //  attr   : attrBite,
   //  style  : styleBite,
   //  tooltip: ttBite,

   // // shorthand events
   //  click     :   function(args){ return eventBite(args)('click')},
   //  mouseover :   function(args){ return eventBite(args)('mouseover')},
   //  mouseenter:   function(args){ return eventBite(args)('mouseenter')},
   //  mouseleave:   function(args){ return eventBite(args)('mouseleave')},
   //  hover     :   function(args){ return eventBite(args)('hover')},
   //  
   //  process functions
   variable   : eatVars,
   'function' : eatFuncs
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
  
  function assembled3things(director, label, itself){
    if(director === 'pre'){
      return 'd3.' + label + '.' + itself;
    } else if (director === 'post'){
      return 'd3.' + itself + '.' + label;
    } else {
      throw new Error('Cannot assemble d3things; unknown director.');
    }
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

  // PROCESS FUNCS
  
  function eatVars(varObj, parent){
    return _.includes(_.keys(d3things), varObj.variable) ?
      d3things[varObj.variable](varObj.variable)
      : lookup(varObj.variable, parent);
  }

  function eatFuncs(funcObj, parent){
    // console.log('eatFuncs', funcObj, parent);
    return ['eatFuncs', funcObj];
  }

  // WORKHORSE FUNCS
  
  function process(value, parent){
    guts.isHashMap(value) ?
        console.log(noms[_.keys(value)](value, parent))
      : console.log(value);
  }

  function build(expressions){
    return _.map(expressions, function(exp){
      if (guts.isHashMap(exp)){
        var key = _.first(_.keys(_.omit(exp, 'parent')));
        return _.includes(_.keys(exp), 'name') ? 
             noms[exp.name.split('_')[0]]
           : _.includes(_.keys(noms), key) ?
             noms[key]
             // noms[key](exp.key) <-- eventual call
           : key + "(" + process(exp[key], exp.parent) + ")"
      } else {
        throw new Error('Invalid input:' + exp);
      }
    }).join('');
  }

  // _.map(structure, build);
  console.log(beautify(_.map(structure, build).join(''), {"break_chained_methods": true}));
  // return beautify(_.map(structure, build).join(''), {"break_chained_methods": true});
}

exports.string  = buildString;
exports.flags   = flags;