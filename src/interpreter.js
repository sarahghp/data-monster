var util = require('util'),
    _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){

  var structure = { 
    special: {
      tooltips: []
    }
  }; 

  var nodes = {
    'data':     dataGen, 
    'canvas':   canvasGen,
    'elem':     svgGen,
  };

  var special = {
    'tooltips': tooltipPop,
    'axis-x': axisPop,
    'axis-y': axisPop,
    'scale-x': scalePop,
    'scale-y': scalePop
  };

  // Utility functions

  function addChildren(parent, child){
    // if child array exists, push to it, otherwise create
    // think about creating prototypes and prepopulating empty array

    structure[parent]['children'] ? 
      structure[parent]['children'].push(child) :
      (structure[parent]['children'] = [child]) ;
  }

  function handleSiblings(ast, parent){
    var consumed = _.drop(ast);
    (consumed.length) && generate(consumed, parent); 
  }

  function assign(ast, parent){
    structure[parent][ast[0].op] = ast[0].exp;
    generate(_.drop(ast), parent); // parent passes through because assign cannot create a new scope 
  }

  function createNode(ast, parent){

    // create unique id for node and add it to the structure object
    var id = ast[0].op + '-' + uuid();
    console.log(structure);
    structure[id] = Object.create(Object.prototype);
    console.log(structure);

    // call the appropriate generation function on child exp
    nodes[ast[0].op](id, ast[0].exp, parent); 

    // and also call sibling generate
    handleSiblings(ast, parent);
  }

  // Generative functions

  function dataGen(id, exp){ 
    var leaf      = structure[id],
        file      = exp[0],                 // the first argument to a data call is the data itself or filename
        extension = path.extname(file);
    
    leaf['file'] = file;

    if(extension === ''){
      if(file instanceof Array){
        leaf['filetype'] = 'array';
      } else if(typeof file === 'object' && !file){
        leaf['filetype'] = 'json';
      }
    } else {
      leaf['filetype'] = extension;
    }

    // call generate on the rest of the expression, with data as new parent
    // here we move into the data expression list and the outside object is sloughed

    generate(_.drop(exp), id);    
  }

  function canvasGen(id, exp, parent){

    addChildren(parent, id);  // add canvas id to parent's list of children

    var leaf = structure[id],
        newExp;
    
    leaf['parent'] = parent;
    leaf['width']  = exp[0];
    leaf['height'] = exp[1];

    // check for optional margins and assign selector & margins based on result
    if (typeof exp[2] === 'object' && exp[2]) {
      leaf['margins'] = exp[2];
      leaf['selector'] = exp[3];
      newExp = _.drop(exp, 4);
    } else {
      leaf['selector'] = exp[2];
      newExp = _.drop(exp, 3);
    }

    // call generate on rest of the expression; doesn't use handleSiblings 
    // since the drop is brancing / handled internally 
    generate(newExp, id); 

  }

  function svgGen(id, exp, parent){
    addChildren(parent, id);

    var leaf = structure[id];
    
    leaf['parent']    = parent;
    leaf['type']      = exp[0].op;
    leaf['req_specs'] = Object.create(Object.prototype);

    _.forEach(exp[0].exp, function(el){
      leaf['req_specs'][el[0]] = el[1]; // return array pairs to hash pairs
    });

    handleSiblings(exp, id);
  }

  // Population Functions

  function tooltipPop (ast, parent){
    var tooltip    = Object.create(Object.prototype);
    tooltip.text   = ast[0][1] || 'default';
    tooltip.parent = parent;
    
    structure.special.tooltips.push(tooltip);

    handleSiblings(ast, parent);
  }

  function axisPop(ast, parent){
    var type    = ast[0].op.split('-')[1],
        axisObj = (structure[parent][(type + 'Axis')] = Object.create(Object.prototype));

        _.forEach(ast[0].exp, function(el){
          axisObj[el.op] = _.map(el.exp, function(inside_el){

            var inside_obj = Object.create(Object.prototype);
            
            if (typeof inside_el === 'string'){
              inside_obj = inside_el;                   // strings pass through
            } else {
              inside_obj[inside_el[0]] = inside_el[1]; // return array pairs to hash pairs
            }

            return inside_obj;
          })
        });

    handleSiblings(ast, parent);
  }

  function scalePop(ast, parent){
    var type    = ast[0].op.split('-')[1],
        scaleObj = (structure[parent][(type + 'Scale')] = Object.create(Object.prototype));

    _.forEach(ast[0].exp, function(el){
      if (el.hasOwnProperty('variable')){
        scaleObj['scale'] = el;
      } else {
        scaleObj[el.op] = el.exp[0];
      }
    })

    handleSiblings(ast, parent);
  }

  // GENERATE FUNC — BEST FUNC

  function generate(ast, parent){

    var parent = parent || undefined;

    // Have we consumed everything?

    if(!ast.length){
      console.log('finished!');
      return
    }

    // if no, check if it is 'data', 'canvas', or 'elem' for the svg shapes [excepting text]: 
    // (rect, circle, ellipse, line, polyline, polygon, path)
    // if yes, call a parent creator

    if (ast[0].hasOwnProperty('op') && (nodes[ast[0].op])) {
      createNode(ast, parent);

    // is it special (tooltips, axis) -> variables will be stored as their own object and replaced in
    // interpretation step 2; a list is in the data-struct-ref,js file

    } else if (ast[0].hasOwnProperty('op') && (special[ast[0].op])) {
      special[ast[0].op](ast, parent);

    // default: call assigner

    } else {
      assign(ast, parent);
    } 
  }


  // NOW LET'S GET DOWN TO BUSINESS

  // ast comes as an array of arrays, each inner array mapping to a full spec expression,
  // therefore we must apply the assignment function to each

  _.forEach(ast, function(el){
    return generate(el);
  });

  console.log('final', util.inspect(structure, false, null));

  return structure;

}

module.exports = chomper;