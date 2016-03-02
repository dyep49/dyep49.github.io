const d3 = require('d3');

let margin;
let containerWidth;
let width;
let barHeight;
let spacing;
let height;
let chart;
let x;
let y;
let colorScale;
let xAxis;

function resize() {
    // update width
  const updatedWidthContainer = parseInt(d3.select('.language-chart').style('width'), 10);
  const updatedWidth = updatedWidthContainer - margin.left - margin.right;

    // resize the chart
  x.range([0, updatedWidth]);
  d3.select(chart.node().parentNode)
        .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        .style('width', (updatedWidth + margin.left + margin.right) + 'px');

  chart.selectAll('.legend')
      .style('display', () => {
        const mobile = d3.select('.mobile-legend').style('display') !== 'none';
        return mobile ? 'none' : 'block';
      })
      .attr('transform', (d, i) => {
        const translateY = (30 * i) + height - 100;
        const translateX = updatedWidth - width;
        return 'translate(' + translateX + ',' + translateY + ')';
      });

  chart.selectAll('rect.background')
        .attr('width', updatedWidth);

  chart.selectAll('rect.percent')
        .attr('width', d => x(d.percent / 10));

    // update axes
  chart.select('.x.axis.top').call(xAxis.orient('top'));
  chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));
}

module.exports = function appendChart(data) {
  margin = { top: 30, right: 20, bottom: 30, left: 20 };
  containerWidth = parseInt(d3.select('.language-chart').style('width'), 10);
  width = containerWidth - margin.left - margin.right;
  barHeight = 40;
  spacing = 3;
  // create the chart
  chart = d3.select('.language-chart').append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');
  // scales and axes
  x = d3.scale.linear()
      .range([0, width])
      .domain([0, 10]); // hard-coding this because I know the data

  // ordinal scales are easier for uniform bar heights
  // I'll set domain and rangeBands after data loads
  y = d3.scale.ordinal();

  colorScale = d3.scale.ordinal()
                    .domain(['Language', 'Library/Framework', 'Everything Else'])
                    .range(['#0f0', 'magenta', 'cyan']);

  xAxis = d3.svg.axis()
      .scale(x)
      .tickFormat(d => {
        let axisLabel = d;
        switch (axisLabel) {
          case 3:
            axisLabel = '3*';
            break;
          case 6:
            axisLabel = '6**';
            break;
          case 8:
            axisLabel = '8***';
            break;
          default:
            axisLabel;
        }
        return axisLabel;
      });


    // set y domain
  y.domain(d3.range(data.length))
      .rangeBands([0, data.length * barHeight]);

  // set height based on data
  // height = y.rangeExtent()[1];
  height = data.length * barHeight;
  d3.select(chart.node().parentNode)
      .style('height', (height + margin.top + margin.bottom) + 'px');


  // add top and bottom axes
  chart.append('g')
      .attr('class', 'x axis top')
      .call(xAxis.orient('top'));

  chart.append('g')
      .attr('class', 'x axis bottom')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis.orient('bottom'));

  const bars = chart.selectAll('.bar')
      .data(data)
    .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', (d, i) => 'translate(0,' + y(i) + ')');

  bars.append('rect')
      .attr('class', 'background')
      .attr('height', y.rangeBand())
      .attr('width', width);

  bars.append('rect')
      .attr('class', 'percent')
      .attr('height', y.rangeBand())
      .attr('width', d => x(d.percent / 10))
      .attr('fill', d => colorScale(d.category));

  bars.append('text')
      .text(d => d.name)
      .attr('class', 'name')
      .attr('y', y.rangeBand() - 10)
      .attr('x', spacing)
      .style('color', 'white');

  const legend = chart.selectAll('.legend')
      .data(colorScale.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        const translateY = (30 * i) + height - 100;
        return 'translate(0,' + translateY + ')';
      })
      .style('display', () => {
        const mobile = d3.select('.mobile-legend').style('display') !== 'none';
        return mobile ? 'none' : 'block';
      });

  legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => colorScale(d));

  legend.append('text')
      .attr('x', width - 25)
      .attr('y', 8)
      .attr('dy', '.35em')
      .attr('class', 'legend-text')
      .style('text-anchor', 'end')
      .text(d => d);

  d3.select(window).on('resize', resize);
};
