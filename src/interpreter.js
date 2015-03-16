var _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){
  
  var structure = { }; 

  // var nodes = {
  //   'data':     dataGen, 
  //   'canvas':   canvasGen,
  //   'rect':     svgGen,
  //   'circle':   svgGen,
  //   'ellipse':  svgGen,
  //   'line':     svgGen,
  //   'polyline': svgGen,
  //   'polygon':  svgGen,
  //   'path':     svgGen
  // };

  // var special = {
  //   'tooltips': ,
  //   'variable':
  // };

  // // Utility functions

  // function addChildren(parent, child){
  //   // if child array exists, push to it, otherwise create
  //   // think about creating prototypes and prepopulating empty array

  //   structure[parent]['children'] ? 
  //     structure[parent]['children'].push(child) :
  //     (structure[parent]['children'] = [child]) ;
  // }

  // function assign(ast, parent){
  //   parent[ast.op]
  // }

  // function createNode(ast, parent){

  //   // create unique id for node and add it to the structure object
  //   var id = uuid();
  //   structure[id] = Object.create(Object.prototype);

  //   // then call the right generation function
  //   nodes[ast.op](id, ast.exp, parent, ast.op);

  // }

  // // Generative functions

  // function dataGen(id, exp){
  //   var leaf      = structure[id],
  //       file      = file,                 // the first argument to a data call is the data itself or filename
  //       extension = path.extname(file);
    
  //   leaf['file'] = file;

  //   if(extension === ''){
  //     if(file instanceof Array){
  //       leaf['filetype'] = 'array';
  //     } else if(typeof file === 'object' && !file){
  //       leaf['filetype'] = 'json';
  //     }
  //   } else {
  //     leaf['filetype'] = extension;
  //   }

  //   generate(exp.slice(1), id); // call generate on the rest of the arguments, with data as new parent    
  // }

  // function canvasGen(id, exp, parent){

  //   addChildren(parent, id);

  //   var leaf = structure[id];
    
  //   leaf['parent'] = parent;
  //   leaf['width']  = exp[0];
  //   leaf['height'] = exp[1];

  //   // check for optional margins and assign selector & margins based on result
  //   if (typeof exp[2] === 'object' && !exp[2]) {
  //     leaf['margins'] = exp[2];
  //     leaf['selector'] = exp[3];
  //     //create a remainder expression
  //   } else {
  //     leaf['selector'] = exp[2];
  //     //create a remainder expression
  //   }

  //   // and then recur over the remainder expression
  //   // moveOverArgs()

  // }

  // function svgGen(id, exp, parent, op){
  //   addChildren(parent, id);

  //   var leaf = structure[id];
    
  //   leaf['parent']    = parent;
  //   leaf['type']      = op;
  //   leaf['req_specs'] = Object.create(Object.prototype);

  //   _.forEach(exp, function(el){
  //     leaf['req_specs'][el[0]] = el[1]; // return array pairs to hash pairs
  //   })
  // }


  // function generate(ast, parent){

  //   var parent = parent || undefined;

  //   // check if it is 'data', 'canvas', or svg shape [excepting text] (rect, circle, ellipse, line, polyline, polygon, path)
  //   // if yes, call a parent creator

  //  (nodes[ast[0].op]) && createNode(ast, parent);


  //   // is it a variable or special (tooltips)

  //   // is it an expression, call move over expression

  //   // if no, call assigner

  //   assign(ast, parent);


  // }

  // // ast comes as an array of arrays, each inner array mapping to a full spec expression,
  // // therefore we must apply the assignment function to each

  // // _.forEach(ast, generate);

  return structure;

}

module.exports = chomper;