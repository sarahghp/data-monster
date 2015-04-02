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
    xScale: { 
      scale:
      range: 
      domain: }
    yScale: { 
      scale:
      range: 
      domain: }
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

{ 'data-eb544ee9-5824-4725-8e18-dc88d39fa109':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [Function],
     funcs: [ [Function: tiger], [Function: kitty] ],
     children:
      [ 'canvas-8818f339-43eb-438c-9d82-3fc3a940abba',
        'canvas-ea8ea461-989c-4826-8ff7-e80d156d1e7c' ] },
  'canvas-8818f339-43eb-438c-9d82-3fc3a940abba':
   { parent: 'data-eb544ee9-5824-4725-8e18-dc88d39fa109',
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
      [ 'elem-47dacdf9-6ad6-44a8-9c69-de845166a891',
        'elem-047d1ef3-92ce-4679-a377-ec4378ac4e9d' ],
     xPrim: 'd.ratio',
     yPrim: 'd.Shape_Count',
     xAxis:
      { attr:
         [ [ 'class', 'label' ],
           [ 'x', { variable: 'width' } ],
           [ 'y', 50 ] ],
        style: [ [ 'text-anchor', 'end' ] ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ [ 'class', 'label' ], [ 'y', -10 ] ],
        style: [ [ 'text-anchor', 'end' ] ],
        text: [ 'Num Shapes' ] } },
  'elem-47dacdf9-6ad6-44a8-9c69-de845166a891':
   { parent: 'canvas-8818f339-43eb-438c-9d82-3fc3a940abba',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] },
     attr: [ [ 'class', 'dot' ] ],
     tooltip:
      { text: 'default',
        parent: 'elem-47dacdf9-6ad6-44a8-9c69-de845166a891' },
     click: [Function] },
  'elem-047d1ef3-92ce-4679-a377-ec4378ac4e9d':
   { parent: 'canvas-8818f339-43eb-438c-9d82-3fc3a940abba',
     type: 'line',
     req_specs: { x1: 0, y1: 100, x2: { variable: 'width' }, y2: 100 } },
  'canvas-ea8ea461-989c-4826-8ff7-e80d156d1e7c':
   { parent: 'data-eb544ee9-5824-4725-8e18-dc88d39fa109',
     width: 100,
     height: 60,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-08b6b0fe-3c07-46cf-a194-a2fe23c2aa9d' ],
     xPrim: 'd.ratio',
     yPrim: 'd.Shape_Count' },
  'elem-08b6b0fe-3c07-46cf-a194-a2fe23c2aa9d':
   { parent: 'canvas-ea8ea461-989c-4826-8ff7-e80d156d1e7c',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] } } }