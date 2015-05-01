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
    // 'tooltips': tooltipPop,
    // 'axis-x':   axisPop,
    // 'axis-y':   axisPop,
    // 'scale-x':  scalePop,
    // 'scale-y':  scalePop,
    // 'clean':    cleanPop,
    // 'function': funcPop
  };

  // Utility functions

  function addChildren(parent, child, structure){
    var parentIndex = _.findIndex(structure, { name: parent});

    structure[parentIndex]['children'] ? 
      structure[parentIndex]['children'].push(child) :
      (structure[parentIndex]['children'] = [child]) ;

    return structure;
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
      val = 'var moo = function(d){ ' + toInter + '; }';
    } else if (wrapper){
      val = 'var moo = function(d){ return ' + wrapper + '(' + toInter + ') }';
    } else {
      val = 'var moo = function(d){ return ' + toInter + ' }';
    }
    
    eval(val);
    return moo;
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

    structure.push(leaf)

    return _.forEach(_.drop(ast.exp), function(el){
      return generate(el, id, structure);
    });
  }

  function canvasGen(ast, parent, structure){

    var id   = createNode(ast, structure),
        leaf = { name: id },
        exp  = ast.exp,
        newExp;

    parent && addChildren(parent, id, structure);  // add canvas id to parent's list of children
    
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
    
    // no drop here since the drop is handled above 
    return _.forEach(newExp, function(el){
      return generate(el, id, structure);
    });
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
      // return array pairs to hash pairs
      var val = el[1];
      if ((typeof val === 'object') && val.hasOwnProperty('variable') && val.variable.match(/fill|\bd\./)){
        
        if (el[0].match(/x/)) { 
          structure[parentIndex]['xPrim'] = val.variable;
          leaf['req_specs'][el[0]] = convertToDFunc(val.variable, 'xScale');
        } else if (el[0].match(/y/)){
          structure[parentIndex]['yPrim'] = val.variable;
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

    structure.push(leaf);

    return _.forEach(_.drop(exp), function(el){
      return generate(el, id, structure);
    })
  }

  // Population Functions

  function assign(ast, parent, structure){ //Q: Just add inline to generate?
      // console.log('ast in assign', ast, 'parent in assign', parent);
      // console.log('ast in assign', ast);
      
      var obj = Object.create(Object.prototype);
      obj[ast.op]  = ast.exp;
      obj['parent'] = parent;
      structure.push(obj);
      
      // console.log('structure in assign', structure);

      return _.forEach(_.drop(ast.exp), function(el){
        return generate(el, parent, structure);
      });
  }

  function axisPop(ast, parent){
    var type    = ast[0].op.split('-')[1],
        axisObj = (structure[parent][(type + 'Axis')] = Object.create(Object.prototype));

        axisObj.parent = parent;

        _.forEach(ast[0].exp, function(el){

          axisObj[el.op] = el.exp;

        });

    generate(_.drop(ast), parent);
  }

  function cleanPop(ast, parent){
    var assignments = ast[0].exp[0].exp
                      .split(",\n")
                      .map(function(el){
                        return el.trim();
                      })
                      .join(';');

    structure[parent]['clean'] = convertToDFunc(assignments, 'clean');

    generate(_.drop(ast), parent);
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

     generate(_.drop(ast), parent);
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

    generate(_.drop(ast), parent);
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
    generate(_.drop(ast), parent);
  }

  // GENERATE FUNC — BEST FUNC

  function generate(ast, parent, structure){

    var parent    = parent || undefined,
        structure = structure || [],
        current   = ast;    

    if (current.hasOwnProperty('op') && (nodes[current.op])) {
      return nodes[current.op](ast, parent, structure);

    } else if (current.hasOwnProperty('op') && (special[current.op])) {
      return special[current.op](ast, parent, structure);

    } else {
      return assign(ast, parent, structure);
    }
  }


  // NOW LET'S GET DOWN TO BUSINESS
  
  var log = _.forEach(ast, function(el){
    // console.log(el);
    return generate(el);
  });
  // console.log('finalest confusion', util.inspect(log, false, null));

}

exports.chomper = chomper;