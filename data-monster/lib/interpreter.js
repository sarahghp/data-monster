var util = require('util'),
    _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){

  var nodes = {
    'data':     dataGen, 
    'canvas':   canvasGen,
    'elem':     elemGen
  };

  var special = {
    'axis-x':   scaleAndAxisPop,
    'axis-y':   scaleAndAxisPop,
    'scale-x':  scaleAndAxisPop,
    'scale-y':  scaleAndAxisPop,
  };

  // Utility functions

  function addChildren(parent, child, structure){
    var parentIndex = _.findIndex(structure, { name: parent});

    structure[parentIndex]['children'] ? 
      structure[parentIndex]['children'].push(child) :
      (structure[parentIndex]['children'] = [child]) ;

    return structure;
  }

  function addInto(pairs, obj){
    var obj = obj || {};
    _.forEach(pairs, function(val, key){
      obj[key] = val;
    });
    return obj;
  }

  function createNode(ast, structure){
    var id = (function createID(){
      var check = ast.op + '_' + uuid().split('-')[0];
      if (_.includes(structure, check)){
        return createID();
      } else {
        return check;
      }
    })();

    return id;
  }

  function objectify (pairArrays, toObj, defaultKey){
    _.forEach(pairArrays, function(pair){
      if (pair.length < 2) {
        toObj[defaultKey] = pair[0];
      } else {
        toObj[pair[0]] = pair[1];
      }
    });
    return toObj;
  }

  function setOpToExp(objArray, toObj, defaultKey){
    _.forEach(objArray, function(obj){
      if (!obj.op){
        toObj[defaultKey] = obj;
      } else {
        toObj[obj.op] = obj.exp;
      }
    });
    return toObj;
  }


  // Generative functions

  function dataGen(ast, parent, structure){
    var id        = createNode(ast, structure),
        leaf      = { name: id },
        file      = ast.exp[0],                 // the first argument to a data call is the data itself or filename
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

    structure.push(leaf);

    if (_.rest(ast.exp).length){
      _.invoke(_.rest(ast.exp), function(){
         generate(this, id, structure);
      });
    }
    return structure;
  }

  function canvasGen(ast, parent, structure){

    var id   = createNode(ast, structure),
        leaf = { name: id },
        exp  = ast.exp,
        newExp;

    // add canvas id to parent's list of children
    parent && addChildren(parent, id, structure);  
    
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

    structure.push(leaf)
    
    if (newExp.length){
      _.invoke(newExp, function(){
         generate(this, id, structure);
      });
    }

    return structure;
  }

  function elemGen(ast, parent, structure){
    var id          = createNode(ast, structure),
        leaf        = { name: id },
        parentIndex = _.findIndex(structure, { name: parent }),
        exp         = ast.exp;

    addChildren(parent, id, structure);
    
    leaf['parent']    = parent;
    leaf['type']      = exp[0].op;
    leaf['req_specs'] = Object.create(Object.prototype);

    _.forEach(exp[0].exp, function(el){
      // return array pairs to hash pairs & add in xPrim & yPrim
      var val = el[1];
      leaf['req_specs'][el[0]] = val;
      
      if (val.variable && val.variable.match(/\bd\./)){
        if (el[0].match(/x/)) { 
          structure[parentIndex]['xPrim'] = val.variable;
        } else if (el[0].match(/y/)){
          structure[parentIndex]['yPrim'] = val.variable;
        } 
      }
    });

    structure.push(leaf);

    if (_.rest(exp).length){
      _.invoke(_.rest(exp), function(){
         generate(this, parent, structure);
      });
    }

    return structure;
  }

  // Population Functions

  function assign(ast, parent, structure){ //Q: Just add inline to generate?
      
      var obj = Object.create(Object.prototype);
      obj[ast.op]  = ast.exp;
      obj['parent'] = parent;
      structure.push(obj);
    
      if (_.rest(ast.exp).length){
        _.invoke(_.rest(ast.exp), function(){
           generate(this, parent, structure);
        });
      }

      return structure;
  }

  function scaleAndAxisPop(ast, parent, structure){
    var breakOp = ast.op.split('-'),
        label   = breakOp[1] + _.capitalize(breakOp[0]),
        outer   = objectify([[label, {}]], {}),
        inner   = addInto({'parent': parent}, outer[label]);

        setOpToExp(ast.exp, inner);        
        return structure.push(outer);
  }


  // GENERATE FUNC — BEST FUNC

  function generate(ast, parent, structure){

    var parent    = parent || undefined,
        structure = structure || [];    

    if (ast.hasOwnProperty('op') && (nodes[ast.op])) {
      return nodes[ast.op](ast, parent, structure);

    } else if (ast.hasOwnProperty('op') && (special[ast.op])) {
      return special[ast.op](ast, parent, structure);

    } else {
      return assign(ast, parent, structure);

    } 
  }


  // NOW LET'S GET DOWN TO BUSINESS
  

  var log = _.map(ast, function(el){
    return generate(el);
  });
  console.log('final', util.inspect(log, false, null));
}

exports.chomper = chomper;