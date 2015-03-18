var structure = require('../src/parser.js').structure,
    chomper   = require('../src/interpreter.js').chomper,
    _         = require('lodash'),
    __        = require('lodash-contrib');

describe('structure', function(){
  it('is defined', function(){
    expect(structure).toBeDefined();
  });

  it('is an object', function(){
    expect(structure).toEqual(jasmine.any(Object));
  });

  it('does not contain any undefined terms', function(){

    var arr = [];

    __.walk.preorder(structure, function(value, key, parent){
      (key === undefined) && arr.push(parent) && console.log('undefined parent is:', parent);
      (value === undefined) && arr.push(parent) && console.log('undefined parent is:', parent);
    });

    expect(arr.length).toEqual(1); // this is a hacky way to test, since the walk always returns 1 undefined

  })
});

describe('chomper', function(){
  it('can chomp a data spec with a file', function(){

  });

  it('can chomp a data spec with an array', function(){

  });

  it('can chomp a data spec with a json object', function(){

  });

  it('assigns canvas children to data parent', function(){

  });

  it('can can create a canvas without a parent', function(){

  });

  it('handles canvas siblings', function(){

  });

  it('handles element siblings', function(){

  });

})




