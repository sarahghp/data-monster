var add = require('../src/test-codes.js');

describe('add', function(){
  it('adds two numbers together', function(){
    expect(add(3, 4)).toEqual(7);
  });
});