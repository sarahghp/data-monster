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
          parent: 'elem-e2af0605-f96b-4365-80d3-6e04c5ef1c65' } ] },
  'data-d77a57ec-02a8-4682-bf55-2dfec3fd17d0':
   { file: 'van_gogh_additional_measurements.tsv',
     filetype: '.tsv',
     clean: [ 'd.Shape_Count = +d.Shape_Count,\n             d.ratio = +d["Image_Height/Image_Width "]' ],
     children:
      [ 'canvas-a0a0f55f-8b0a-4bdb-9c8c-2c8dd1951baa',
        'canvas-5ee350e6-9399-4bc5-a710-67e0cf0cf102' ] },
  'canvas-a0a0f55f-8b0a-4bdb-9c8c-2c8dd1951baa':
   { parent: 'data-d77a57ec-02a8-4682-bf55-2dfec3fd17d0',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#scatterplot',
     children: [ 'elem-e2af0605-f96b-4365-80d3-6e04c5ef1c65' ],
     xAxis:
      { attr: [ { class: 'label' }, { x: { variable: 'width' } }, { y: 50 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Height: Width Ratio' ] },
     yAxis:
      { attr: [ { class: 'label' }, { y: -10 } ],
        style: [ { 'text-anchor': 'end' } ],
        text: [ 'Num Shapes' ] } },
  'elem-e2af0605-f96b-4365-80d3-6e04c5ef1c65':
   { parent: 'canvas-a0a0f55f-8b0a-4bdb-9c8c-2c8dd1951baa',
     type: 'circle',
     req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' },
     attr: [ [ 'class', 'dot' ] ],
     click: [ 'function(d)  window.open(\'https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+\'+d.Title);' ],
     xScale:
      { scale: { variable: 'log' },
        domain: { short_params: [ '0', 'height' ] },
        range: { short_params: [ '200', '400' ] } } },
  'canvas-5ee350e6-9399-4bc5-a710-67e0cf0cf102':
   { parent: 'data-d77a57ec-02a8-4682-bf55-2dfec3fd17d0',
     width: 1000,
     height: 600,
     margins: { short_params: [ '20', '20', '60', '60' ] },
     selector: '#booooop',
     children: [ 'elem-8f737dc4-577b-4ef4-8a24-2014a757cf5b' ] },
  'elem-8f737dc4-577b-4ef4-8a24-2014a757cf5b':
   { parent: 'canvas-5ee350e6-9399-4bc5-a710-67e0cf0cf102',
     type: 'circle',
     req_specs: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' },
     color: [ 'func' ] } }