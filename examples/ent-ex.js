function tiger() {
    return 'tiger'
}

function draw_canvas_3bbbe2a2(data) {
    function kitty() {
        return 'kitty'
    }
    var margin = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 60
        },
        width = 920,
        height = 520;
    var maxY = d3.max(data, function(d) {
            return d.Shape_Count
        }),
        maxX = d3.max(data, function(d) {
            return d.ratio
        });
    maxY = maxY + (maxY * .25) // Make it a little taller 
    var xScale = d3.scale.linear()
        .domain([0, maxX])
        .range([0, width]),
        yScale = d3.scale.linear()
        .domain([0, maxY])
        .range([height, 0]),
        color = d3.scale.category10();
    var svg = d3.select('#scatterplot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'elements')
        .append('circle')
        .attr({
            cx: function(d) {
                return xScale(d.ratio)
            },
            cy: function(d) {
                return yScale(d.Shape_Count)
            },
            r: 4,
            fill: function(d) {
                return color(d.Year)
            }
        })
        .attr({
            "class": "dot"
        })
        .on('mouseover', function(d) {
            var xPosition = event.clientX + scrollX < width - 200 ? event.clientX + scrollX : event.clientX + scrollX - 200,
                yPosition = event.clientY + scrollY + 100 > height ? event.clientY + scrollY - 25 : event.clientY + scrollY + 5,
                text = d.ratio + '; ' + d.Shape_Count;
            d3.select('#tooltip')
                .style('left', xPosition + 'px')
                .style('top', yPosition + 'px')
                .select('#values')
                .text(text);
            d3.select('#tooltip')
                .classed('hidden', false);
        })
        .on('mouseout', function() {
            d3.select('#tooltip')
                .classed('hidden', true);
        })
        .on('click', function(d) {
            window.open('https://www.google.com/search?site=imghp&tbm=isch&q=van+gogh+' + d.Title);
        });
    svg.append('g')
        .attr('class', 'elements')
        .append('line')
        .attr({
            x1: 0,
            y1: 100,
            x2: 920,
            y2: 100
        });
    .append("g");
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr({
            "class": "label",
            "x": 920,
            "y": 50
        })
        .style({
            "text-anchor": "end"
        })
        .text("Height: Width Ratio");
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr({
            "class": "label",
            "y": -10
        })
        .style({
            "text-anchor": "end"
        })
        .text("Num Shapes");
};

function draw_data_3857b1fe(rawData) {
    rawData.forEach(function(d) {
        return d.Shape_Count = +d.Shape_Count, d.ratio = +d["Image_Height/Image_Width "]
    });
    draw_canvas_3bbbe2a2(rawData);
}

queue()
    .defer(d3.tsv, 'van_gogh_additional_measurements.tsv')
    .await(function(err, data) {
        if (err) {
            console.log(err)
        }
        draw_data_3857b1fe(data);
    });