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
    // 'axis-x':   axisPop,
    // 'axis-y':   axisPop,
    // 'scale-x':  scalePop,
    // 'scale-y':  scalePop,
  };

  // Utility functions

  function addChildren(parent, child, structure){
    var parentIndex = _.findIndex(structure, { name: parent});

    structure[parentIndex]['children'] ? 
      structure[parentIndex]['children'].push(child) :
      (structure[parentIndex]['children'] = [child]) ;

    return structure;
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

  function axisPop(ast, parent){
    var type    = ast[0].op.split('-')[1],
        axisObj = (structure[parent][(type + 'Axis')] = Object.create(Object.prototype));

        axisObj.parent = parent;

        _.forEach(ast[0].exp, function(el){

          axisObj[el.op] = el.exp;

        });

    generate(_.rest(ast), parent);
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

    generate(_.rest(ast), parent);
  }


  // GENERATE FUNC — BEST FUNC

  function generate(ast, parent, structure){

    var parent    = parent || undefined,
        structure = structure || [];    


    if (ast.hasOwnProperty('op') && (nodes[ast.op])) {
      // console.log('nodes called');
      return nodes[ast.op](ast, parent, structure);

    } else if (ast.hasOwnProperty('op') && (special[ast.op])) {
      return special[ast.op](ast, parent, structure);

    } else {
      // console.log('assign called');
      return assign(ast, parent, structure);

    } 
  }


  // NOW LET'S GET DOWN TO BUSINESS
  

  var log = _.map(ast, function(el){
    return generate(el);
  });
  console.log('final', util.inspect(log, false, null));
  // console.log('final', log);

}

exports.chomper = chomper;