var structure = require('../src/parser.js').structure;

describe('structure', function(){
  it('returns an object', function(){
    expect(structure).toBeDefined();
    expect(structure).toEqual(jasmine.any(Object));
  });

});