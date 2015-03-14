// v1

{ exp: { data: [ 15 ] } }
{ exp: { data: [ 'title' ] } }
{ exp: { data: [ 'van_gogh_additional_measurements.tsv' ] } }
{ exp: { color: [ { variable: 'category10' } ] } }
{ exp: { tooltip: ['true'] } }
{ exp: { canvas: [1000, 600] } }
{ exp: { canvas: [ 1000, 600, '#scatterplot'] } }
{ exp: { circle: [['cx', 'ratio'], ['cy', 'Shape_Count'], ['r', 4], ['fill', 'year']]  } } 
{ exp: { circle: [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] } ] } }
{ exp: { circle: [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] }, { op : 'tooltip', exp : [ 'false' ] } ] } }
{ exp: { clean : [ "d.Shape_Count = +d.Shape_Count", "d.ratio = +d['Image_Height/Image_Width ']" ] } }
{ exp: { click : "function(d) { window.open('https ... +'+d.Title);" } })}


//v2

[ [ { op : 'data', exp : [ 15 ] } ] ]
[ [ { op : 'data', exp : [ 'title' ] } ] ]
[ [ { op : 'data', exp : [ 'van_gogh_additional_measurements.tsv' ] } ] ]
[ [ { op : 'color', exp : [ { variable : 'category10' } ] } ] ]
[ [ { op : 'tooltip', exp : [ 'true' ] } ] ]
[ [ { op : 'canvas', exp : [ 1000, 600 ] } ] ]
[ [ { op : 'canvas', exp : [ 1000, 600, '#scatterplot' ] } ] ]
[ [ { op : 'circle', exp : [ [ 'cx', 'ratio' ], [ 'cy', 'Shape_Count' ], [ 'r', 4 ], [ 'fill', 'year' ] ] } ] ]
[ [ { op : 'circle', exp : [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] } ] } ] ]
[ [ { op : 'circle', exp : [ { op : 'attr', exp : [ [ 'class', 'dot' ] ] }, { op : 'tooltip', exp : [ 'false' ] } ] } ] ]
[ [ { op : 'clean', exp : [ 'd.Shape_Count = +d.Shape_Count, d.ratio = +d["Image_Height/Image_Width "]' ] } ] ]


[ [ { op : 'click', exp : [ 'function(d)  window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title);' ] } ] ]

[ [ { op : 'data', exp : [ 'van_gogh_additional_measurements.tsv' ] } ], [ { op : 'canvas', exp : [ 1000, 600 ] } ] ]
[ [ { op : 'data', exp : [ 'van_gogh_additional_measurements.tsv', { op : 'canvas', exp : [ 1000, 600 ] } ] } ] ]