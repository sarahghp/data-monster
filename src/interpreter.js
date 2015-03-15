var _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){
  
  var structure = { }; 

  var nodes = {
    'data': , 
    'canvas': ,
    'rect': ,
    'circle': ,
    'ellipse': ,
    'line': ,
    'polyline': ,
    'polygon': ,
    'path': 
  };

  function addChildren(parent, child){
    // if child array exists, push to it, otherwise create
    // think about creating prototypes and prepopulating empty array

    structure[parent]['children'] ? 
      structure[parent]['children'].push(child) :
      (structure[parent]['children'] = [child]) ;
  }

  function dataGen(id, exp){
    var leaf = structure[id];
    leaf['filename'] = exp[0];
    leaf['filetype'] = path.extname(exp[0]);
  }

  function canvasGen(id, exp, parent){

    addChildren(parent, id);

    var leaf = structure[id];
    
    leaf['parent'] = parent;
    leaf['width']  = exp[0];
    leaf['height'] = exp[1];

    // check for optional margins and assign selector & margins based on result
    if (typeof exp[2] === 'object' && !exp[2]) {
      leaf['margins'] = exp[2];
      leaf['selector'] = exp[3];
    } else {
      leaf['selector'] = exp[2];
    }

  }

  function svgGen(id, exp, parent, op){
    addChildren(parent, id);

    var leaf = structure[id];
    
    leaf['parent']    = parent;
    leaf['type']      = op;
    leaf['req_specs'] = Object.create(Object.prototype);

    _.forEach(exp, function(el){
      leaf['req_specs'][el[0]] = el[1]; // return array pairs to hash pairs
    })
  }

  // ast comes as an array of arrays, each inner array mapping to a full spec expression,
  // therefore we must apply the assignment function to each

  // _.forEach(_.flatten(ast), generate);


  function generate(ast, parent){


    // check if it is 'data', 'canvas', or svg shape [excepting text] (rect, circle, ellipse, line, polyline, polygon, path)
    // if yes, call a parent creator

   (nodes[ast.op]) && nodes[ast.op](parent);


    // is it a variable or special (tooltips)

    // is it an expression, call move over expression

    // if no, call assigner


  }

  function assign(operator, expression, parent){

    
  }

  function createNode(){

    var id = uuid();

    structure[id] = Object.create(Object.prototype);

    then call the right generation function

    return function(op)

  }



  return structure;

}

module.exports = chomper;