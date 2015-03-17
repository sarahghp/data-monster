var _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){

  var structure = { }; 

  var nodes = {
    'data':     dataGen, 
    'canvas':   canvasGen,
    'elem':     svgGen,
    // 'axis-x':
    // 'axis-y':
    // 'scale-x':
    // 'scale-y':
  };

  var special = {
    // 'tooltips': ,
    // 'variable': lookup;
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
    parent[ast[0].op] = ast[0].exp;
    // console.log('in assign', structure);
    generate(_.drop(ast), parent); // parent passes through because assign cannot create a new scope 
  }

  function createNode(ast, parent){

    // create unique id for node and add it to the structure object
    var id = ast[0].op + '-' + uuid();
    structure[id] = Object.create(Object.prototype);

    // call the appropriate generation function on child exp
    nodes[ast[0].op](id, ast[0].exp, parent, ast[0].op); 

    // and also call sibling generate
    handleSiblings(ast, parent);

  }

  // Generative functions

  function dataGen(id, exp){ 
    var leaf      = structure[id],
        file      = exp[0],                 // the first argument to a data call is the data itself or filename
        extension = path.extname(file);

        console.log('leaf', leaf)
    
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

    generate(newExp, id); 

  }

  function svgGen(id, exp, parent, op){
    addChildren(parent, id);

    var leaf = structure[id];
    
    leaf['parent']    = parent;
    leaf['type']      = op;
    leaf['req_specs'] = Object.create(Object.prototype);

    _.forEach(exp, function(el){
      console.log('in svg gen': el);
      leaf['req_specs'][el[0]] = el[1]; // return array pairs to hash pairs
    })
  }


  function generate(ast, parent){

    var parent = parent || undefined;

    // check if it is 'data', 'canvas', or 'elem' for the svg shapes [excepting text]: 
    // (rect, circle, ellipse, line, polyline, polygon, path)
    // if yes, call a parent creator


    // is it special (tooltips) -> variables will be stored as their own object and replaced in
    // interpretation step 2; a list is in the data-struct-ref,js file

    // is it an expression, call move over expression

    // if no, call assigner

    if(!ast.length){
      console.log('finished!');
      return
    }

    if (ast[0].hasOwnProperty('op') && (nodes[ast[0].op])) {
      createNode(ast, parent);
    } else {
      assign(ast, parent);
    } 





    


  }

  // ast comes as an array of arrays, each inner array mapping to a full spec expression,
  // therefore we must apply the assignment function to each

  _.forEach(ast, function(el){
    return generate(el);
  });

  console.log(structure);

  return structure;

}

module.exports = chomper;