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
    data   : '',
    canvas : '',
    elem   : '',
    axis   : '',
    scale  : '',
   //  attr   : attrBite,
   //  style  : styleBite,
   //  tooltip: ttBite,

   // // events <- add more, consider method to take other DOM methods
   //  click     :   function(args){ return eventBite(args)('click')},
   //  mouseover :   function(args){ return eventBite(args)('mouseover')},
   //  mouseenter:   function(args){ return eventBite(args)('mouseenter')},
   //  mouseleave:   function(args){ return eventBite(args)('mouseleave')},
   //  hover     :   function(args){ return eventBite(args)('hover')},
  },

  d3things = {
    // colors
    category10  : 'pre',
    category20  : 'pre',
    category20b : 'pre',
    category20c : 'pre',

    // axes
    linear      : 'pre',
    log         : 'pre',
    identity    : 'pre',
    sqrt        : 'pre',
    pow         : 'pre',
    quantize    : 'pre',
    quantile    : 'pre',
    threshold   : 'pre',
    time        : 'post'

  };


  // WORKHORSE FUNCS
  
  function process(value){

  }

  function build(expressions){
    // similar to generate: check if element is in noms otherwise output string key(process(value)) 
    return _.map(expressions, function(exp){
      var key = _.first(_.keys(_.omit(exp, 'parent')));
      return key + "(" + exp[key] + ")";
    }).join('');
     // return expressions;
  }

  // _.map(structure, build);
  console.log(beautify(_.map(structure, build).join(''), {"break_chained_methods": true}));
  // return beautify(_.map(structure, build).join(''), {"break_chained_methods": true});
}

exports.string  = buildString;
exports.flags   = flags;