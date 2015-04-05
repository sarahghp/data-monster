(data: 'van_gogh_additional_measurements.tsv'
  (clean: #{ d.Shape_Count = +d.Shape_Count,
             d.ratio = +d["Image_Height/Image_Width "]                    
            }
  )
  (funcs: #{function tiger(){return 'tiger'}})
  (canvas: 1000 600 {20 20 60 60} '#scatterplot'
    (color: category10)
    (funcs: #{function kitty(){return 'kitty'}})
    (scale-x: linear 
              domain: { 0 maxX } 
              range:  { 0 width } ) 
    (elem: circle: { cx: d.ratio, cy: d.Shape_Count, r: 4, fill: d.Year }
           attr: { 'class': 'dot' }
           tooltips: true
           click: #{ function(d) { window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title); }})
    (axis-x: attr: { 'class': 'label', 'x': width, 'y': 50 }
             style: { 'text-anchor': 'end' }
             text: 'Height: Width Ratio' )
    (axis-y: attr: { 'class': 'label', 'y': -10 }
             style: { 'text-anchor': 'end' }
             text: 'Num Shapes' )
    (xAxis.ticks: 10)
    (.tickFormat: '%d')
    (elem: line: { x1: 0, y1: 100, x2: width, y2: 100})
    (svg.append: 'g')
  )
)