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
          parent: 'elem-bb871e85-574a-4eb4-ada6-fa7e42b20148' } ] },
  'data-b970f456-2d80-465b-a9a3-61764f75a782':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [ 'd.Shape_Count = +d.Shape_Count,\n             d.ratio = +d["Image_Height/Image_Width "]' ],
     children:
      [ 'canvas-223d14f9-cbc8-46f9-b7c7-015fbff4aac9',
        'canvas-dd7e6b3c-5f48-4801-94d9-119f199ad4b5' ] },
  'canvas-223d14f9-cbc8-46f9-b7c7-015fbff4aac9':
   { parent: 'data-b970f456-2d80-465b-a9a3-61764f75a782',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#scatterplot',
     color: [ { variable: 'category10' } ],
     children: [ 'elem-bb871e85-574a-4eb4-ada6-fa7e42b20148' ],
     xAxis:
      { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ { class: 'label' }, { y: -10 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Num Shapes' ] } },
  'elem-bb871e85-574a-4eb4-ada6-fa7e42b20148':
   { parent: 'canvas-223d14f9-cbc8-46f9-b7c7-015fbff4aac9',
     type: 'circle',
     req_specs:
      { cx: 'function(d){ return d.ratio}',
        cy: 'function(d){ return d.Shape_Count}',
        r: 4,
        fill: 'function(d){ return d.year}' },
     attr: [ [ 'class', 'dot' ] ],
     click: [ 'function(d)  window.open(\'https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+\'+d.Title);' ],
     xScale:
      { scale: { variable: 'log' },
        domain: { short_params: [ '0', 'height' ] },
        range: { short_params: [ '200', '400' ] } } },
  'canvas-dd7e6b3c-5f48-4801-94d9-119f199ad4b5':
   { parent: 'data-b970f456-2d80-465b-a9a3-61764f75a782',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-44652704-4e82-4f52-a99b-d537b32f5478' ] },
  'elem-44652704-4e82-4f52-a99b-d537b32f5478':
   { parent: 'canvas-dd7e6b3c-5f48-4801-94d9-119f199ad4b5',
     type: 'circle',
     req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' },
     color: [ 'own_func' ] } }