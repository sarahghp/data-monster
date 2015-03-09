var parser = require('../src/parser.js');

describe('parser', function(){
  it('makes a parser', function(){
    expect(parser.parse).toBeDefined();
  });

  it('comrehends a spec with a number', function(){
    var ast = parser.parse("(data: 15)");
    console.log(ast);
    expect(ast).toEqual({ exp: { data: [ 15 ] } });
  });

  it('comrehends a spec with a number', function(){
    var ast = parser.parse("(data: 15)");
    console.log(ast);
    expect(ast).toEqual({ exp: { data: [ 15 ] } });
  });





});