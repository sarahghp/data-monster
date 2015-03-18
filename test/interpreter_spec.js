var parser = require('../src/parser.js').parser,
    structure = require('../src/parser.js').structure,
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
    var dm = chomper(parser.parse("(data: 'van_gogh_additional_measurements.tsv')"));
    expect(JSON.stringify(dm)).toMatch(/("file":"van_gogh_additional_measurements.tsv")|("filetype":".tsv")/g);

  });

  it('can chomp a data spec with an array', function(){
    var dm = chomper(parser.parse("(data: [1, 2, 4])"));
    expect(JSON.stringify(dm)).toMatch(/("file":"[1, 2, 4]")|("filetype":"array")/g);
  });

  xit('assigns canvas children to data parent', function(){
    // var dm = ;
    expect(dm).toEqual();
  });

  xit('can can create a canvas without a parent', function(){
    // var dm = ;
    expect(dm).toEqual();
  });

  xit('handles canvas siblings', function(){
    // var dm = ;
    expect(dm).toEqual();
  });

  xit('handles element siblings', function(){
    // var dm = ;
    expect(dm).toEqual();
  });

})




