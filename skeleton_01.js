// Canvas variables: width, height, margins

var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 1200 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var color = d3.scale.category20();

// Scale variables: scale type, default linear, height reversed

var lineScale = d3.scale.linear()
  .range([0, width]),

  basicYScale = d3.scale.linear()
    .range([height, 0]);


// Utiility functions: formats, 

var formatPercent = d3.format('.1%'),
    formatPercentPrecise = d3.format('.2%'),
    formatDollars = d3.format('$sk');


drawMedian: function(filename, div) {

  // Invoke draw function [will eventually be factored out in order to use queue, in _02]
  d3.json(filename, function(error, data){

    // Clean data
    
    data.forEach(function(element){
      // Cleaning equations
    });

    // Find max / extent, add scale domain

    var maxX = d3.max(data, function(d){ return d.xValue; }),
        maxY = d3.max(data, function(d){ return d.yValue; }),

    xScale.domain([0, maxX]);
    yScale.domain([0, maxY + (maxY * .15)]);


    // Draw

    var svg = d3.select(div)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');;


    svg.selectAll('________')
          .data(data)
        .enter()
          .append('________')
            .attr({ ...: ...,
                    ...: ...,
                    ..., ... })
          .on('mouseover', function(d){
            var xPosition = event.clientX + scrollX < width - 200 ? event.clientX + scrollX : event.clientX + scrollX - 200,
                yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,
                text = d.Major + ' -- shareWomen: ' + formatPercentPrecise(d.ShareWomen) + ' Median pay: ' + formatDollars(d.Median);
            d3.select('#tooltip')
              .style('left', xPosition + 'px')
              .style('top', yPosition + 'px')
              .select('#values')
              .text(text);
            d3.select('#tooltip').classed('hidden', false);
          })
          .on('mouseout', function(){
            d3.select('#tooltip').classed('hidden', true);
          });
    //Axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(formatDollars);

    svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
            .call(yAxis); 
  })
}

