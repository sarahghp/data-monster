
// Canvas variables

var margin = {top:    20, 
              right:  20, 
              bottom: 60, 
              left:   60},
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


// Scale variables

var xScale = d3.scale.linear()
  .range([0, width]),

  yScale = d3.scale.linear()
    .range([height, 0]),

  color = d3.scale.category10();

// Draw scatterplot

function draw (error, data){

  // Prepare the data by changing label and making sure numbers are numbers

  data.forEach(function(d) {
    d.Shape_Count = +d.Shape_Count
    d.ratio = +d["Image_Height/Image_Width "]
  })

  // Add in scale domain now that we have the data

  var maxShapes = d3.max(data, function(d){return d.Shape_Count}),
      maxShapes = maxShapes + (maxShapes * .25) // Make it a little taller
      maxRatio = d3.max(data, function(d){return d.ratio});

    xScale.domain([0, maxRatio]);
    yScale.domain([0, maxShapes]);

  // Checking to see what the data looks like
  
  console.log(data);


  // Make the chart

  var svg = d3.select('#scatterplot')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.selectAll('circle')
      .data(data)
    .enter()
      .append('circle')
        .attr('cx', function(d){ return xScale(d.ratio)})
        .attr('cy', function(d){ return yScale(d.Shape_Count) })
        .attr('r', 4)
        .attr('fill', function(d){ return color(d.Year)})
      .on('mouseover', function(d){
        var xPosition = event.clientX + scrollX < width - 200 ? event.clientX + scrollX : event.clientX + scrollX - 200,
            yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,
            text = d.Year + ': ' + d.Title;
        d3.select('#tooltip')
          .style('left', xPosition + 'px')
          .style('top', yPosition + 'px')
          .select('#values')
          .text(text);
        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mouseout', function(){
        d3.select('#tooltip').classed('hidden', true);
      })
      .on('click', function(d){
        window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+'+d.Title);
      });

  //Axes
  
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

  svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
        .append('text')
          .attr('class', 'label')
          .attr('x', width)
          .attr('y', 50)
          .style('text-anchor', 'end')
          .text('Height: Width Ratio');

  svg.append('g')
      .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
        .attr('class', 'label')
        .attr('y', -10)
        .style('text-anchor', 'end')
        .text('Num Shapes');

}

queue().defer(d3.tsv, 'van_gogh_additional_measurements.tsv').
       .await(draw);
