var util = require('util'),
    _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){

  var structure = { 

  }; 

  var nodes = {
    'data':     dataGen, 
    'canvas':   canvasGen,
    'elem':     elemGen
  };

  var special = {
    'tooltips': tooltipPop,
    'axis-x':   axisPop,
    'axis-y':   axisPop,
    'scale-x':  scalePop,
    'scale-y':  scalePop,
    'clean':    cleanPop,
    'function': funcPop
  };

  // Utility functions

  function addChildren(parent, child){
    // if child array exists, push to it, otherwise create

    structure[parent]['children'] ? 
      structure[parent]['children'].push(child) :
      (structure[parent]['children'] = [child]) ;
  }

  function convertToFunc(func){
    var val = 'var moo = ' + func;
    eval(val);
    return moo;
  }

  function convertToDFunc(toInter, wrapper){
    // this rigamarole sets the value to the actual unexecuted function
    var val;

    if (wrapper === 'clean'){
      val = 'var moo = function(d){ ' + toInter + ' }';
    } else if (wrapper){
      val = 'var moo = function(d){ return ' + wrapper + '(' + toInter + ') }';
    } else {
      val = 'var moo = function(d){ return ' + toInter + ' }';
    }
    
    eval(val);
    return moo;
  }

  function createNode(ast, parent){

    var id;

    (function createID(){
      id = ast[0].op + '_' + uuid().split('-')[0];
      if (structure[id]){
        createID();
      } else {
        structure[id] = Object.create(Object.prototype);
      }
    })();

    // call the appropriate generation function on child exp
    nodes[ast[0].op](id, ast[0].exp, parent); 

    // and also call sibling generate
    handleSiblings(ast, parent);
  }

  function handleSiblings(ast, parent){
    var consumed = _.drop(ast);
    (consumed.length) && generate(consumed, parent); 
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
      } else {
        console.log('Error: Invalid data type');
      }
    } else {
      leaf['filetype'] = extension;
    }

    // call generate on the rest of the expression, with data as new parent
    // here we move into the data expression list and the outside object is sloughed

    handleSiblings(exp, id);   
  }

  function canvasGen(id, exp, parent){

    parent && addChildren(parent, id);  // add canvas id to parent's list of children

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

  function elemGen(id, exp, parent){
    addChildren(parent, id);

    var leaf = structure[id];
    
    leaf['parent']    = parent;
    leaf['type']      = exp[0].op;
    leaf['req_specs'] = Object.create(Object.prototype);

    _.forEach(exp[0].exp, function(el){
      // return array pairs to hash pairs
      var val = el[1];
      if ((typeof val === 'object') && val.hasOwnProperty('variable') && val.variable.match(/fill|\bd\./)){
        
        if (el[0].match(/x/)) { 
          structure[parent]['xPrim'] = val.variable;
          leaf['req_specs'][el[0]] = convertToDFunc(val.variable, 'xScale');
        } else if (el[0].match(/y/)){
          structure[parent]['yPrim'] = val.variable;
          leaf['req_specs'][el[0]] = convertToDFunc(val.variable, 'yScale');
        } else if (el[0].match(/fill/)){
          leaf['req_specs'][el[0]] = convertToDFunc(val.variable, 'color');
        } else {
          leaf['req_specs'][el[0]] = convertToDFunc(val.variable);
        }
 

      } else {
        leaf['req_specs'][el[0]] = val;
      }
    });

    handleSiblings(exp, id);
  }

  // Population Functions

  function assign(ast, parent){
    // find functions and dispatch them 
    if (typeof ast[0].exp[0] === 'object' && !(ast[0].exp[0] instanceof Array) && ast[0].exp[0].op === 'function'){
      funcPop(ast, parent);
    } else {
      structure[parent][ast[0].op] = ast[0].exp;
      handleSiblings(ast, parent);
    }
  }

  function axisPop(ast, parent){
    var type    = ast[0].op.split('-')[1],
        axisObj = (structure[parent][(type + 'Axis')] = Object.create(Object.prototype));

        axisObj.parent = parent;

        _.forEach(ast[0].exp, function(el){

          axisObj[el.op] = el.exp;

        });

    handleSiblings(ast, parent);
  }

  function cleanPop(ast, parent){
    var interStr    = "";
    var assignments = ast[0].exp[0].exp
                      .split("\n")
                      .map(function(el){
                        return el.trim();
                      });
    _.forEach(assignments, function(el){
      interStr += el;
    })

    structure[parent]['clean'] = convertToDFunc(interStr, 'clean');

    handleSiblings(ast, parent);
  }

  function funcPop(ast, parent){
     if (ast[0].op === 'funcs'){
      _.forEach(ast[0].exp, function(el){
        structure[parent]['funcs'] ? 
          structure[parent]['funcs'].push(convertToFunc(el.exp)) :
          (structure[parent]['funcs'] = [convertToFunc(el.exp)]) ;
      } )
     } else {
      structure[parent][ast[0].op] = convertToFunc(ast[0].exp[0].exp);
     }

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

  function tooltipPop (ast, parent){
    var tooltip    = Object.create(Object.prototype);
    tooltip.parent = parent;

    if (ast[0][1]) {
      if (ast[0][1].match(/\bd\./)){
        tooltip.text = convertToDFunc(ast[0][1]);
      } else {
        tooltip.text = convertToFunc(ast[0][1]);
      }
    } else {
       tooltip.text = 'default';
    }
    
    structure[parent].tooltip = tooltip;

    handleSiblings(ast, parent);
  }

  // GENERATE FUNC — BEST FUNC

  function generate(ast, parent){

    var parent = parent || undefined;

    // Have we consumed everything?

    if(!ast.length){
      // console.log('structure finished!');
      return;
    }

    // if no, check if it is 'data', 'canvas', or 'elem' for the svg shapes [excepting text]: 
    // (rect, circle, ellipse, line, polyline, polygon, path)
    // if yes, call a parent creator

    if (ast[0].hasOwnProperty('op') && (nodes[ast[0].op])) {
      createNode(ast, parent);

    // is it special?

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

  // console.log('final', util.inspect(structure, false, null));

  return structure;

}

exports.chomper = chomper;