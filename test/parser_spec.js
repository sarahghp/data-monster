//TODO: Figure out function, clean

var parser = require('../src/parser.js');

describe('parser', function(){
  
  it('makes a parser', function(){
    expect(parser.parse).toBeDefined();
  });

  it('comprehends a spec with a number', function(){
    var ast = parser.parse("(data: 15)");
    expect(ast).toEqual({ exp: { data: [ 15 ] } });
  });

  it('comprehends a spec with a basic string', function(){
    var ast = parser.parse("(data: 'title')");
    expect(ast).toEqual({ exp: { data: [ 'title' ] } });
  });

  it('comprehends a spec with a file string', function(){
    var ast = parser.parse("(data: 'van_gogh_additional_measurements.tsv')");
    expect(ast).toEqual({ exp: { data: [ 'van_gogh_additional_measurements.tsv' ] } });
  });

  it('comprehends a spec with a variable', function(){
    var ast = parser.parse("(color: category10)");
    expect(ast).toEqual({ exp: { color: [ { variable: 'category10' } ] } });
  });

  it('comprehends a spec with a boolean', function(){
    var ast = parser.parse("(tooltip: true)");
    expect(ast).toEqual({ exp: { tooltip: ['true'] } });
  });

  it('comprehends a spec with multiple entries of one type', function(){
    var ast = parser.parse("(canvas: 1000 600)");
    expect(ast).toEqual({ exp: { canvas: [1000, 600] } });
  });

  it('comprehends a spec with multiple entries of multiple types, excluding specs & short-hash', function(){
    var ast = parser.parse("(canvas: 1000 600 '#scatterplot')");
    expect(ast).toEqual({ exp: { canvas: [ 1000, 600, '#scatterplot'] } });
  });

  it('comprehends a spec with a full hash', function(){
    var ast = parser.parse("(circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' })");
    expect(ast).toEqual({ exp: { circle: [['cx', 'ratio'], ['cy', 'Shape_Count'], ['r', 4], ['fill', 'year']]  } } );
  });

  it('comprehends a spec with one other spec', function(){
    var ast = parser.parse("(circle: attr: { 'class': 'dot' })");
    expect(ast).toEqual({ exp: { circle: [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] } ] } });
  });

  it('comprehends a spec with multiple other specs', function(){
    var ast = parser.parse("(circle: attr: { 'class': 'dot' } tooltip: false)");
    expect(ast).toEqual({ exp : { circle : [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] }, { op : 'tooltip', exp : [ 'false' ] } ] } });
  });

  it('comprehends the clean spec', function(){
    var ast = parser.parse("(clean: (( d.Shape_Count = +d.Shape_Count, d.ratio = +d['Image_Height/Image_Width '] )))");
    expect(ast).toEqual({ exp : { clean : [ "d.Shape_Count = +d.Shape_Count", "d.ratio = +d['Image_Height/Image_Width ']" ] } });
  })

  it('comprehends the short-form clean spec', function(){
    var ast = parser.parse("((( d.Shape_Count = +d.Shape_Count, d.ratio = +d['Image_Height/Image_Width '] )))");
    expect(ast).toEqual({ exp : { clean : [ "d.Shape_Count = +d.Shape_Count", "d.ratio = +d['Image_Height/Image_Width ']" ] } });
  })

  it('comprehends a function as a spec argument', function(){
    var ast = parser.parse("(clean: (( d.Shape_Count = +d.Shape_Count, d.ratio = +d['Image_Height/Image_Width '] )))");
    expect(ast).toEqual({ exp : { clean : [ "d.Shape_Count = +d.Shape_Count", "d.ratio = +d['Image_Height/Image_Width ']" ] } });
  })

});