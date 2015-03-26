// generate [keys] using uuid gen

{

  [data]: {
    file:
    filetype:
    clean: [ ] // array of funcs
    children: [ ] // refs to children
  }

  [canvas]: {
    selector:
    height:
    width:
    margins:
    color:
    xAxis:  { 
      scale:          // these will have defualts if not populated here
      orientation:    // these will have defualts if not populated here
      [other_specs] } // attr, style, &c., each is its own 
    yAxis:  { 
      scale:          // these will have defualts if not populated here
      orientation:    // these will have defualts if not populated here
      [other_specs] } // attr, style, &c., each is its own 
    parent: // is a data, named
    children: [ ] // refs to children
  }
  
  [svg_elem]: {
  // generate name based on selected node // clashes throw errors
    type:
    req_specs: { } // an object with the required svg properties, eg {'cx': 'ratio', 'cy': 'Shape_Count' }
    xScale: { 
      scale:
      range: 
      domain: }
    yScale: { 
      scale:
      range: 
      domain: }
    [opt_specs] // attr, style, &c., each is its own
    parent: // is a canvas, named
    children: [ ] // refs to children
  }
         

  special: {
    tooltips: [{
      text:
      parent: 
    }]
  }
}

// Example

{ 'data-ddd6b46c-41b4-4217-bd32-fd35d78ab6d3':
  { file: 'van_gogh_additional_measurements.tsv',
    filetype: '.tsv',
    clean: [Function],
    funcs: [ [Function: tiger], [Function: kitty] ],
    children:
     [ 'canvas-63e39549-15a3-4720-83a1-1f4607a25372',
       'canvas-617ad791-bce0-4b98-bf56-f32e4e54b3ee' ] },
 'canvas-63e39549-15a3-4720-83a1-1f4607a25372':
  { parent: 'data-ddd6b46c-41b4-4217-bd32-fd35d78ab6d3',
    width: 1000,
    height: 600,
    margins: { short_params: [ '20', '20', '60', '60' ] },
    selector: '#scatterplot',
    color: [ { variable: 'category10' } ],
    xScale:
     { scale: { variable: 'log' },
       domain: { short_params: [ '0', 'height' ] },
       range: { short_params: [ '200', '400' ] } },
    children:
     [ 'elem-40c60b8c-7d62-431d-83fd-81e2542c50c1',
       'elem-4193a8e1-48f0-414c-9939-e54949d6aabe' ],
    xAxis:
     { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
       style: [ { 'text-anchor': 'end' } ],
       text: [ 'Height: Width Ratio' ] },
    yAxis:
     { attr: [ { class: 'label' }, { y: -10 } ],
       style: [ { 'text-anchor': 'end' } ],
       text: [ 'Num Shapes' ] } },
 'elem-40c60b8c-7d62-431d-83fd-81e2542c50c1':
  { parent: 'canvas-63e39549-15a3-4720-83a1-1f4607a25372',
    type: 'circle',
    req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] },
    xPrim: 'd.ratio',
    yPrim: 'd.Shape_Count',
    attr: [ [ 'class', 'dot' ] ],
    tooltip:
     { text: 'default',
       parent: 'elem-40c60b8c-7d62-431d-83fd-81e2542c50c1' },
    click: [Function] },
 'elem-4193a8e1-48f0-414c-9939-e54949d6aabe':
  { parent: 'canvas-63e39549-15a3-4720-83a1-1f4607a25372',
    type: 'line',
    req_specs: { x1: 0, y1: 100, x2: { variable: 'width' }, y2: 100 } },
 'canvas-617ad791-bce0-4b98-bf56-f32e4e54b3ee':
  { parent: 'data-ddd6b46c-41b4-4217-bd32-fd35d78ab6d3',
    width: 1000,
    height: 600,
    margins: { short_params: [ '20', '20', '60', '60' ] },
    selector: '#booooop',
    children: [ 'elem-12eb5eaf-eb98-4914-8b26-52bfdfbfac9e' ] },
 'elem-12eb5eaf-eb98-4914-8b26-52bfdfbfac9e':
  { parent: 'canvas-617ad791-bce0-4b98-bf56-f32e4e54b3ee',
    type: 'circle',
    req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } } }