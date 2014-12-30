var d3 = require('d3');

module.exports = (function() {

  var margin = {top: 30, right: 20, bottom: 30, left: 20};
  var width = parseInt(d3.select('.language-chart').style('width'), 10);
  var width = width - margin.left - margin.right;
  var barHeight = 40;
  var spacing = 3;
  var height;

  // scales and axes
  var x = d3.scale.linear()
      .range([0, width])
      .domain([0, 10]); // hard-coding this because I know the data

  // ordinal scales are easier for uniform bar heights
  // I'll set domain and rangeBands after data loads
  var y = d3.scale.ordinal(); 

  var colorScale = d3.scale.ordinal()
                    .domain(['Language', 'Library/Framework', 'Software/Management/Deployment'])
                    .range(['#0f0', 'magenta', 'cyan']);

  var xAxis = d3.svg.axis()
      .scale(x)

  // create the chart
  var chart = d3.select('.language-chart').append('svg')
      .style('width', (width + margin.left + margin.right) + 'px')
    .append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

  d3.json('../../data/skills.json', function(err, data) {
    appendChart(data.skills)
  })

  function appendChart(data) {
    // set y domain
    y.domain(d3.range(data.length))
        .rangeBands([0, data.length * barHeight]);
    
    // set height based on data
    // height = y.rangeExtent()[1];
    height = data.length * barHeight;
    d3.select(chart.node().parentNode)
        .style('height', (height + margin.top + margin.bottom) + 'px')


    // add top and bottom axes
    chart.append('g')
        .attr('class', 'x axis top')
        .call(xAxis.orient('top'));
    
    chart.append('g')
        .attr('class', 'x axis bottom')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.orient('bottom'));

    var bars = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) { return 'translate(0,'  + y(i) + ')'; });
    
    bars.append('rect')
        .attr('class', 'background')
        .attr('height', y.rangeBand())
        .attr('width', width);
    
    bars.append('rect')
        .attr('class', 'percent')
        .attr('height', y.rangeBand())
        .attr('width', function(d) { 
          return x(d.percent / 10); 
        })
        .attr('fill', function(d) {
          return colorScale(d.category)
        })
    
    bars.append('text')
        .text(function(d) { return d.name; })
        .attr('class', 'name')
        .attr('y', y.rangeBand() - 10)
        .attr('x', spacing)
        .style('color', 'white')

    var legend = chart.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          var translateY = (30 * i) + height - 100
          return "translate(0," + translateY + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
          return colorScale(d);
        });

    legend.append("text")
        .attr("x", width - 25)
        .attr("y", 8)
        .attr("dy", ".35em")
        .attr('class', 'legend-text')
        .style("text-anchor", "end")
        .text(function(d) {
          return d
        })

    d3.select(window).on('resize', resize); 
  }

  function resize() {
      // update width
      width = parseInt(d3.select('.language-chart').style('width'), 10);
      width = width - margin.left - margin.right;

      // resize the chart
      x.range([0, width]);
      d3.select(chart.node().parentNode)
          .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
          .style('width', (width + margin.left + margin.right) + 'px');

      chart.selectAll('rect.background')
          .attr('width', width);

      chart.selectAll('rect.percent')
          .attr('width', function(d) { return x(d.percent / 10); });

      // update axes
      chart.select('.x.axis.top').call(xAxis.orient('top'));
      chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));
  }


}());