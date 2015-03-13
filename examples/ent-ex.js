// Basic entry to generate scatterplot

(data: 'van_gogh_additional_measurements.tsv'
  // change array to obj for consitency? is easier to iterate on array
  (clean: #{ d.Shape_Count = +d.Shape_Count,
             d.ratio = +d["Image_Height/Image_Width "]                    
            }
  )
  (canvas: 1000 600 {20 20 60 60} '#scatterplot'
    (color: category10)
    (circle: { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year' }
       // to specify class for the chart 
       // { cx: 'ratio', cy: 'Shape_Count', r: 4, fill: 'year', class: 'circles' }
       attr: { 'class': 'dot' }
       tooltips: true // no longer default; must be indicated
       click: #{ function(d) { window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title); }})
    (axis-x: attr: { 'class': 'label', 'x': width, 'y': 50 }
             style: { 'text-anchor': 'end' }
             text: { 'Height: Width Ratio' } )
          // scale: { ??? }
          // orient: { bottom }
          // other things, like tick methods, etc.
    (axis-y: attr: { 'class': 'label', 'y': -10 }
             style: { 'text-anchor': 'end' }
             text: { 'Num Shapes' } )
  )
)