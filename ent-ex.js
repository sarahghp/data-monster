// Nested, with labels: This version is probably the easiest to parse and the easiest to add multiple
// charts with the same cleaning and data to, but as a user, is managing the nesting level annoying?

(data: 'van_gogh_additional_measurements.tsv'
  (clean: [ d.Shape_Count = +d.Shape_Count, 
            d.ratio = +d["Image_Height/Image_Width "])
  (canvas: 1000 600 {20 20 60 60} '#scatterplot'
    (color: category10)
    (circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } 
       attr: { 'class': 'dot' }
       tooltips: true // default behavior, doesn't need to be included
       click:  function(d) { window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title); })
    (axis-x: attr: { 'class': 'label', 'x': width, 'y': 50 }
             style: { 'text-anchor': 'end' }
             text: { 'Height: Width Ratio' } )
    (axis-y: attr: { 'class': 'label', 'y': -10 }
             style: { 'text-anchor': 'end' }
             text: { 'Num Shapes' } )
  )
)

// Less nested: In this case we would have to assume data applies to everything after until another data is declared, 
// likewise for canvas. We can probably write that, so is it better?

(data: 'van_gogh_additional_measurements.tsv')
(clean: [ d.Shape_Count = +d.Shape_Count, 
          d.ratio = +d["Image_Height/Image_Width "])
(canvas: 1000 600 {20 20 60 60} '#scatterplot')
(color: category10)
(circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } 
   attr: { 'class': 'dot' }
   tooltips: true // default behavior, doesn't need to be included
   click:  function(d) { window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title); })
(axis-x: attr: { 'class': 'label', 'x': width, 'y': 50 }
   style: { 'text-anchor': 'end' }
   text: { 'Height: Width Ratio' } )
(axis-y: attr: { 'class': 'label', 'y': -10 }
   style: { 'text-anchor': 'end' }
   text: { 'Num Shapes' } )


// Parens after intro: I think managing stuff with out any enclosure is a bidge too far, but with this setup, we 
// could maybe use the intro word for direction and then parens to set off contents. This is less LISPy, so less
// familiar but does that matter? After all, we already have a bunch of JS conventions in theis monster.

data: ('van_gogh_additional_measurements.tsv')
clean: ([ d.Shape_Count = +d.Shape_Count, 
          d.ratio = +d["Image_Height/Image_Width "])
canvas: (1000 600 {20 20 60 60} '#scatterplot')
color: (category10)
circle: ({ cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' } 
   attr: { 'class': 'dot' }
   tooltips: true // default behavior, doesn't need to be included
   click:  function(d) { window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title); })
axis-x: (attr: { 'class': 'label', 'x': width, 'y': 50 }
   style: { 'text-anchor': 'end' }
   text: { 'Height: Width Ratio' } )
axis-y: (attr: { 'class': 'label', 'y': -10 }
   style: { 'text-anchor': 'end' }
   text: { 'Num Shapes' } )