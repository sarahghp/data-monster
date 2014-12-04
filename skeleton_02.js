var Monster = (function(){

  var parsed = {
      // actual object returned from the parser 
      shape: { shape: undefined, // expect svg shapes: circle, rect, path
               attr: undefined,  // expect object
               style: { }
             } 
    }

  var mouseover = function(d){
    var xPosition = event.clientX + scrollX < width - 200 ? event.clientX + scrollX : event.clientX + scrollX - 200,
        yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,
        text = '' + parsed.xValue + ': ' + d[parsed.xValue] + '; ' + parsed.yValue + ': '+ d[parsed.yValue];
    d3.select('#tooltip')
      .style('left', xPosition + 'px')
      .style('top', yPosition + 'px')
      .select('#values')
      .text(text);
    d3.select('#tooltip').classed('hidden', false);
  }

  var mouseout = function(){
    d3.select('#tooltip').classed('hidden', true);
  }

  return {

    compile: function(){
      // call deployQueue(), spit out text, in another file;
    },

    deployQueue: function(){
      // create queue to load all files, set local vars, call all charts
      // queue().defer(d3.filetype, filename)
      //        .await(Monster.chart);
    },


    // Should this be abstracted more and just call functions? 

    chart: function(data){
      // Clean data
      
      data.forEach(function(element){
        // Cleaning equations
      });

      // Find max / extent, add scale domain

      var maxX = d3.max(data, function(d){ return d[parsed.xValue]; }),
          maxY = d3.max(data, function(d){ return d[parsed.yValue]; }),

      xScale.domain([0, maxX]);
      yScale.domain([0, maxY + (maxY * .15)]);


      // Draw

      var svg = d3.select(parsed.div)
        .append('svg')
          .attr('width', this.consts.width + this.consts.margin.left + this.consts.margin.right)
          .attr('height', this.consts.height + this.consts.margin.top + this.consts.margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + this.consts.margin.left + ',' + this.consts.margin.top + ')');;


      svg.selectAll(parsed.shape.shape)
            .data(data)
          .enter()
            .append(parsed.shape.shape)
              .attr(parsed.shape.attr)
              .style(parsed.shape.style)
            .on('mouseover', this.helper.mouseover);
            .on('mouseout', this.helper.mouseout);
      
      //Axes

      this.consts.xAxis && this.axes.xAxis();
      this.consts.yAxis && this.axes.yAxis();      

      
    },

    
    // Needs to be abstracted, just plopped in for now
    axes: function(){
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('bottom');

      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient('left')
          .tickFormat(formatDollars);

          return {
            xAxis: function(){ 
              return svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
             },

             yAxis: function(){
              return svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis); 
             }
          }
    },

    transform: {
      filename: function(name){
        var arr = name.split('.');
        return arr[-1];
      },

      xScale: function(type, rangeLow, rangeHigh){
        if (type === 'time') {
          return d3.time.scale().range([rangeLow || 0, rangeHigh || this.width]);
        } else {
          return d3.scale[type]().range([rangeLow || 0, rangeHigh || this.width]);
        }
      },

      yScale: function(type, rangeLow, rangeHigh){
        if (type === 'time') {
          return d3.time.scale().range([rangeHigh || this.width, rangeLow || 0]);
        } else {
          return d3.scale[type]().range([rangeHigh || this.width, rangeLow || 0]);
        }
      }

    },

    consts: {
      width:          parsed.width || 900,
      height:         parsed.height || 600,
      marginkey:      parsed.margin || {top: 20, right: 20, bottom: 30, left: 40},
      filename:       parsed.filename,
      filetype:       transform.filename(this.filename),

      color:          parsed.color || d3.scale.category20(),
      xScale:         parsed.xScale ? transform.xScale(parsed.xScale, parsed.rangeLow, parsed.rangeHigh) : basicxScale = d3.scale.linear().range([0, this.width]),
      yScale:         parsed.yScale ? transform.yScale(parsed.yScale, parsed.rangeLow, parsed.rangeHigh) : basicxScale = d3.scale.linear().range([this.height, 0]),

      xAxis:          parsed.xAxis || true,
      yAxis:          parsed.yAxis || true,
    },

    helper: {
      mouseover:      parsed.mouseover || mouseover,
      mouseout:       parsed.mouseout || mouseout,
    }


  };


})();



