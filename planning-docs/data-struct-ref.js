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
    color
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

{ special:
   { tooltips:
      [ { text: 'default',
          parent: 'elem-86723ad1-6f66-4d42-a09e-ea2a99ddf42b' } ] },
  'data-c1267098-35b2-4b3b-9930-80e2f6e1291e':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [Function],
     funcs: [ [Function: tiger], [Function: kitty] ],
     children:
      [ 'canvas-afe71b79-6cbf-4a3c-8b3a-282aae453e1a',
        'canvas-7e281257-41ef-427b-92a8-c2208b3e845c' ] },
  'canvas-afe71b79-6cbf-4a3c-8b3a-282aae453e1a':
   { parent: 'data-c1267098-35b2-4b3b-9930-80e2f6e1291e',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#scatterplot',
     color: [ { variable: 'category10' } ],
     children: [ 'elem-86723ad1-6f66-4d42-a09e-ea2a99ddf42b' ],
     xAxis:
      { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ { class: 'label' }, { y: -10 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Num Shapes' ] } },
  'elem-86723ad1-6f66-4d42-a09e-ea2a99ddf42b':
   { parent: 'canvas-afe71b79-6cbf-4a3c-8b3a-282aae453e1a',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] },
     attr: [ [ 'class', 'dot' ] ],
     click: [Function],
     xScale:
      { scale: { variable: 'log' },
        domain: { short_params: [ '0', 'height' ] },
        range: { short_params: [ '200', '400' ] } } },
  'canvas-7e281257-41ef-427b-92a8-c2208b3e845c':
   { parent: 'data-c1267098-35b2-4b3b-9930-80e2f6e1291e',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-6d83cb5d-03bc-403e-8b75-ddb6b5fa26c7' ] },
  'elem-6d83cb5d-03bc-403e-8b75-ddb6b5fa26c7':
   { parent: 'canvas-7e281257-41ef-427b-92a8-c2208b3e845c',
     type: 'circle',
     req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } } }