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

{ 'data-20d59c0f-076d-4387-9438-81bfe905c468':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [Function],
     funcs: [ [Function: tiger], [Function: kitty] ],
     children:
      [ 'canvas-a15d977b-0123-418d-8b1e-973c27c21036',
        'canvas-13da326e-8ea2-4704-a87d-efb8290c9693' ] },
  'canvas-a15d977b-0123-418d-8b1e-973c27c21036':
   { parent: 'data-20d59c0f-076d-4387-9438-81bfe905c468',
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
      [ 'elem-97f7dc7b-ced1-47e5-a864-a9305afd158e',
        'elem-df2a35cd-5b0f-4892-b7e4-9e2142d71c89' ],
     xPrim: 'd.ratio',
     yPrim: 'd.Shape_Count',
     xAxis:
      { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ { class: 'label' }, { y: -10 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Num Shapes' ] } },
  'elem-97f7dc7b-ced1-47e5-a864-a9305afd158e':
   { parent: 'canvas-a15d977b-0123-418d-8b1e-973c27c21036',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] },
     attr: [ [ 'class', 'dot' ] ],
     tooltip:
      { text: 'default',
        parent: 'elem-97f7dc7b-ced1-47e5-a864-a9305afd158e' },
     click: [Function] },
  'elem-df2a35cd-5b0f-4892-b7e4-9e2142d71c89':
   { parent: 'canvas-a15d977b-0123-418d-8b1e-973c27c21036',
     type: 'line',
     req_specs: { x1: 0, y1: 100, x2: { variable: 'width' }, y2: 100 } },
  'canvas-13da326e-8ea2-4704-a87d-efb8290c9693':
   { parent: 'data-20d59c0f-076d-4387-9438-81bfe905c468',
     width: 100,
     height: 60,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-2f9509c6-3d78-419f-974c-9f0a8f909117' ],
     xPrim: 'd.ratio',
     yPrim: 'd.Shape_Count' },
  'elem-2f9509c6-3d78-419f-974c-9f0a8f909117':
   { parent: 'canvas-13da326e-8ea2-4704-a87d-efb8290c9693',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] } } }