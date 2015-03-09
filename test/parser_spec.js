//TODO: Figure out function, clean, short hash

var parser = require('../src/parser.js');

describe('parser', function(){
  it('makes a parser', function(){
    expect(parser.parse).toBeDefined();
  });

  it('comrehends a spec with a number', function(){
    var ast = parser.parse("(data: 15)");
    // console.log(ast);
    expect(ast).toEqual({ exp: { data: [ 15 ] } });
  });

  it('comrehends a spec with a basic string', function(){
    var ast = parser.parse("(data: 'title')");
    // console.log(ast);
    expect(ast).toEqual({ exp: { data: [ 'title' ] } });
  });

  it('comrehends a spec with a file string', function(){
    var ast = parser.parse("(data: 'van_gogh_additional_measurements.tsv')");
    // console.log(ast);
    expect(ast).toEqual({ exp: { data: [ 'van_gogh_additional_measurements.tsv' ] } });
  });

  it('comrehends a spec with a bare word', function(){
    var ast = parser.parse("(color: category10)");
    // console.log(ast);
    expect(ast).toEqual({ exp: { color: [ { variable: category10 } ] } });
  });

  it('comrehends a spec with a boolean', function(){
    var ast = parser.parse("(tooltip: true)");
    // console.log(ast);
    expect(ast).toEqual({ exp: { tooltip: [ 'true' ] } });
  });

  it('comrehends a spec with multiple entries of one type', function(){
    var ast = parser.parse("(canvas: 1000 600)");
    // console.log(ast);
    expect(ast).toEqual({ exp: { data: [1000, 600] } });
  });

  it('comrehends a spec with multiple entries of multiple types, excluding specs & short-hash', function(){
    var ast = parser.parse("canvas: 1000 600 '#scatterplot'");
    // console.log(ast);
    expect(ast).toEqual({ exp: { canvas: [ 1000, 600, '#scatterplot'] } });
  });

  it('comrehends a spec with a full hash', function(){
    var ast = parser.parse("circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } ");
    // console.log(ast);
    expect(ast).toEqual({ exp: { circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } } });
  });

  it('comrehends a spec with one other spec', function(){
    var ast = parser.parse("circle: attr: { 'class': 'dot' }");
    // console.log(ast);
    // Is this one stupid? Should I not have a full expression and instead just have it be inside?
    expect(ast).toEqual({ exp: { circle: { exp: { attr:  { 'class': 'dot' } } } } });
  });

  it('comrehends a spec with one other spec, alternative', function(){
    var ast = parser.parse("circle: attr: { 'class': 'dot' }");
    // console.log(ast);
    expect(ast).toEqual({ exp: { circle: { attr:  { 'class': 'dot' } } } });
  });

  it('comrehends a spec with multiple oher specs', function(){
    var ast = parser.parse("circle: attr: { 'class': 'dot' } tooltips: true");
    // console.log(ast);
    expect(ast).toEqual({ exp: { circle: [ { attr: { 'class': 'dot' } }, { tooltips: true }] } });
  });

});