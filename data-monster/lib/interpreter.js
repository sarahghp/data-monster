var util = require('util'),
    _    = require('lodash'),
    path = require('path'),
    uuid = require('uuid-v4');

function chomper(ast){

  // var structure = { 

  // }; 

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
    // console.log('ast in node', ast);

    var id = (function createID(){
      var check = ast.op + '_' + uuid().split('-')[0];
      if (_.includes(structure, check)){
        return createID();
      } else {
        return check;
      }
    })();

    return id;

    // // call the appropriate generation function to create a node
    // nodes[ast[0].op](id, ast[0].exp, parent); 

    // // then call generate with new structure
    // generate(_.drop(ast), parent, structure);
  }


  // Generative functions

  function dataGen(ast, parent, structure){
  // console.log('ast in data', ast); 
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

    // call generate on the rest of the expression, with data as new parent
    // here we move into the data expression list and the outside object is sloughed
    
    return _.forEach(_.drop(ast.exp), function(el){
      return generate(el, id, structure);
    })

    // generate(_.drop(exp), id, structure.push(leaf));
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
    
    return _.forEach(_.drop(newExp), function(el){
      return generate(el, id, structure);
    })


    // no drop here since the drop is handled above 
    // generate(newExp, id, structure.push(leaf)); 

  }

  function elemGen(ast, parent, structure){
    var id   = createNode(ast, structure),
        leaf = { name: id },
        exp  = ast.exp;

    addChildren(parent, id, structure);
    
    leaf['parent']    = parent;
    leaf['type']      = exp[0].op;
    leaf['req_specs'] = Object.create(Object.prototype);

    // Drills into particular element type and then consumes the associated expressions / values
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

    structure.push(leaf);
    // generate(_.drop(exp), id, structure.push(leaf));

    return _.forEach(_.drop(exp), function(el){
      return generate(el, id, structure);
    })
  }

  // Population Functions

  function assign(ast, parent, structure){ //Q: Just add inline to generate?
      console.log('ast in assign', ast);
      
      var obj = Object.create(Object.prototype);
      obj[ast.op]  = ast.exp;
      obj['parent'] = parent;
      structure.push(obj);
      
      console.log('structure in assign', structure);

      return _.forEach(_.drop(ast.exp), function(el){
        return generate(el, structure);
      })
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
        structure = structure || [];

    // Have we consumed everything?

    // if(!ast.length){
    //   console.log('structure finished!');
    //   return structure;
    // }

    // if no, check if it is 'data', 'canvas', or 'elem' for the svg shapes [excepting text]: 
    // (rect, circle, ellipse, line, polyline, polygon, path)
    // if yes, call a parent creator
    // 
    
    var current = ast;
    // console.log(current);

    if (current.hasOwnProperty('op') && (nodes[current.op])) {
      nodes[current.op](ast, parent, structure);

    // is it special?

    } else if (current.hasOwnProperty('op') && (special[current.op])) {
      special[current.op](ast, parent, structure);

    // default: call assigner

    } else {
      assign(ast, parent, structure);
    }
  }


  // NOW LET'S GET DOWN TO BUSINESS

  // ast comes as an array of objects, each object mapping to a full spec expression,
  // therefore we must apply the assignment function to each

  // return _.forEach(ast, function(el){
  //   return generate(el);
  // }).join("\n\n");


  // var log = _.forEach(ast, function(el){
  //   console.log(el);
  //   return generate(el);
  // }).join("\n\n");
  // console.log('final', util.inspect(log, false, null));
  // 
  
  var log = _.forEach(ast, function(el){
    // console.log(el);
    return generate(el);
  });
  console.log('final', util.inspect(log, false, null));

}

exports.chomper = chomper;