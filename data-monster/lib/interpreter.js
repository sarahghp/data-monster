var util = require('util'),
    _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4'),
    guts = require('./guts.js'); // guts is the dm-specific utils file

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
        file      = ast.exp[0],                 // the first argument to a data call is the data itself or filename
        extension = path.extname(file),
        additions = { name: id,
                      file: file,
                      filetype: extension,
                    };

    structure.push(guts.addInto(additions,{}));

    if (guts.thereIsMore(ast.exp)){
      _.invoke(_.rest(ast.exp), function(){
         generate(this, id, structure);
      });
    }
    return structure;
  }

  function canvasGen(ast, parent, structure){
    var id   = createNode(ast, structure),
        exp  = ast.exp,
        newExp,
        additions = { name: id, 
                      parent: parent,
                      width: exp[0],
                      height: exp[1]
                    };

    // add canvas id to parent's list of children
    parent && addChildren(parent, id, structure);

    // check for optional margins and assign selector & margins based on result
    if (_.isObject(exp[2])) {
      additions['margins'] = exp[2];
      additions['selector'] = exp[3];
      newExp = _.drop(exp, 4);
    } else {
      additions['selector'] = exp[2];
      newExp = _.drop(exp, 3);
    }

    structure.push(guts.addInto(additions, {}))
    
    if (newExp.length){
      _.invoke(newExp, function(){
         generate(this, id, structure);
      });
    }

    return structure;
  }

  function elemGen(ast, parent, structure){
    var id          = createNode(ast, structure),
        parentIndex = _.findIndex(structure, { name: parent }),
        exp         = ast.exp,
        innerExp    = exp.exp || exp[0].exp,
        additions   = { name: id, 
                        parent: parent,
                        type: exp.exp || exp[0].op,
                        req_specs: guts.objectify(innerExp, {}, 'oops')
                      };

    addChildren(parent, id, structure);    
    

    var tests =  function(personalizer){
        return function(val, key) {
          return _.has(val, 'variable') && val.variable.match(/\bd\./) && _.includes(key, personalizer);
        }
      };

    var primPartial = _.partial(guts.finder, additions.req_specs, _, 'variable');

    additions.xPrim = primPartial(tests('x'));
    additions.yPrim = primPartial(tests('y'));

    structure.push(guts.addInto(additions, {}));

    if (guts.thereIsMore(exp)){
      _.invoke(_.rest(exp), function(){
         generate(this, parent, structure);
      });
    }

    return structure;
  }

  // Population Functions

  function assign(ast, parent, structure){ 
    var additions = guts.objectify([[ast.op, ast.exp],['parent', parent]],{});
    structure.push(guts.addInto(additions, {}));
    
      if (guts.thereIsMore(ast.exp)){
        _.invoke(_.rest(ast.exp), function(){
           generate(this, parent, structure);
        });
      }

      return structure;
  }

  function scaleAndAxisPop(ast, parent, structure){
    var breakOp = ast.op.split('-'),
        label   = breakOp[1] + _.capitalize(breakOp[0]),
        outer   = guts.objectify([[label, {}]], {}),
        inner   = guts.addInto({'parent': parent}, outer[label]);

        guts.setAtoB('op', 'exp')(ast.exp, inner, breakOp[0]);    
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

  return _.map(ast, function(el){
    return generate(el);
  });
}

exports.chomper = chomper;