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

final { special:
   { tooltips:
      [ { text: 'default',
          parent: 'elem-74f88a57-7c5d-4bed-8660-1ff245107f39' } ] },
  'data-7ee58d6c-b724-45bc-855f-af0ce483dc48':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [Function],
     funcs: [ [Function: tiger], [Function: kitty] ],
     children:
      [ 'canvas-f49afc70-27ef-42aa-82bb-3143b7d97327',
        'canvas-1ee69fe5-5e80-407d-8523-f4f1b077015a' ] },
  'canvas-f49afc70-27ef-42aa-82bb-3143b7d97327':
   { parent: 'data-7ee58d6c-b724-45bc-855f-af0ce483dc48',
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
      [ 'elem-74f88a57-7c5d-4bed-8660-1ff245107f39',
        'elem-8ebd1da3-d143-435b-a193-2bbebdb5a5be' ],
     xAxis:
      { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ { class: 'label' }, { y: -10 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Num Shapes' ] } },
  'elem-74f88a57-7c5d-4bed-8660-1ff245107f39':
   { parent: 'canvas-f49afc70-27ef-42aa-82bb-3143b7d97327',
     type: 'circle',
     req_specs: { cx: [Function], cy: [Function], r: 4, fill: [Function] },
     attr: [ [ 'class', 'dot' ] ],
     click: [Function] },
  'elem-8ebd1da3-d143-435b-a193-2bbebdb5a5be':
   { parent: 'canvas-f49afc70-27ef-42aa-82bb-3143b7d97327',
     type: 'line',
     req_specs: { x1: 0, y1: 100, x2: { variable: 'width' }, y2: 100 } },
  'canvas-1ee69fe5-5e80-407d-8523-f4f1b077015a':
   { parent: 'data-7ee58d6c-b724-45bc-855f-af0ce483dc48',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-6b6eab57-4c27-4c38-9ebd-bab2042cdf0b' ] },
  'elem-6b6eab57-4c27-4c38-9ebd-bab2042cdf0b':
   { parent: 'canvas-1ee69fe5-5e80-407d-8523-f4f1b077015a',
     type: 'circle',
     req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } } }