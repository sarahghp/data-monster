var writer = require('../src/writer.js').string;

describe('the writer', function(){
  it('returns a string', function(){
    expect(writer).toEqual(jasmine.any(String));
  });
});