(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./header.js');
require('./language-chart.js')
},{"./header.js":2,"./language-chart.js":3}],2:[function(require,module,exports){
(function (global){
// var stuff = require('jquery');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./vendor/scroll.js');

module.exports = (function() {

  $(document).ready(function() {
    var scrollInterval;

    $(window).on('scrollstart', function() {
      var top = $(window).scrollTop();
      
      scrollInterval = setInterval(function() {
        var updatedTop = $(window).scrollTop();
        var hideHeader = updatedTop > 60 && updatedTop >= top;
        hideHeader ? $('header').css('top', '-60px') : $('header').css('top', '0px');
        top = updatedTop;
      }, 250)
    });

    $(window).on('scrollend', function() {
      clearInterval(scrollInterval);
    });
  })

  $('.js-navigation-menu').removeClass("show");

  $('#js-mobile-menu').on('click', function(e) {
    e.preventDefault();
    $('.js-navigation-menu').slideToggle(function(){
      if($('.js-navigation-menu').is(':hidden')) {
        $('.js-navigation-menu').removeAttr('style');
      }
    });
  });

}())
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./vendor/scroll.js":4}],3:[function(require,module,exports){
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
},{"d3":"d3"}],4:[function(require,module,exports){
/**
 * jQuery extension, add support `scrollstart` and `scrollend` events.
 *
 * @author  RubaXa  <trash@rubaxa.org>
 * @github  https://gist.github.com/RubaXa/5568964
 * @license MIT
 *
 *
 * @settings
 *      $.special.scrollend.delay = 300; // default ms
 *
 * @flags
 *      $.isScrolled; // boolean
 *
 * @binding
 *      $(window).bind('scrollstart scrollend', function (evt){
 *          if( evt.type == 'scrollstart' ){
 *              // logic
 *          }
 *      });
 *
 */
module.exports = (function ($){
    var
          ns        = (new Date).getTime()
        , special   = $.event.special
        , dispatch  = $.event.handle || $.event.dispatch
 
        , scroll        = 'scroll'
        , scrollStart   = scroll + 'start'
        , scrollEnd     = scroll + 'end'
        , nsScrollStart = scroll +'.'+ scrollStart + ns
        , nsScrollEnd   = scroll +'.'+ scrollEnd + ns
    ;
 
    special.scrollstart = {
        setup: function (){
            var pid, handler = function (evt/**$.Event*/){
                if( pid == null ){
                    evt.type = scrollStart;
                    dispatch.apply(this, arguments);
                }
                else {
                    clearTimeout(pid);
                }
 
                pid = setTimeout(function(){
                    pid = null;
                }, special.scrollend.delay);
 
            };
 
            $(this).bind(nsScrollStart, handler);
        },
 
        teardown: function (){
            $(this).unbind(nsScrollStart);
        }
    };
 
    special.scrollend = {
        delay: 300,
 
        setup: function (){
            var pid, handler = function (evt/**$.Event*/){
                var _this = this, args = arguments;
 
                clearTimeout(pid);
                pid = setTimeout(function(){
                    evt.type = scrollEnd;
                    dispatch.apply(_this, args);
                }, special.scrollend.delay);
 
            };
 
            $(this).bind(nsScrollEnd, handler);
 
        },
 
        teardown: function (){
            $(this).unbind(nsScrollEnd);
        }
    };
 
 
    $.isScrolled = false;
    $(window).bind(scrollStart+' '+scrollEnd, function (evt/**Event*/){
        $.isScrolled = (evt.type == scrollStart);
        $('body')[$.isScrolled ? 'addClass' : 'removeClass']('is-scrolled');
    });
})(jQuery);
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy9sYW5ndWFnZS1jaGFydC5qcyIsInNyYy9zY3JpcHRzL3ZlbmRvci9zY3JvbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOzs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vaGVhZGVyLmpzJyk7XG5yZXF1aXJlKCcuL2xhbmd1YWdlLWNoYXJ0LmpzJykiLCIvLyB2YXIgc3R1ZmYgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuJCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuJCA6IG51bGwpO1xucmVxdWlyZSgnLi92ZW5kb3Ivc2Nyb2xsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY3JvbGxJbnRlcnZhbDtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICBcbiAgICAgIHNjcm9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cGRhdGVkVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICB2YXIgaGlkZUhlYWRlciA9IHVwZGF0ZWRUb3AgPiA2MCAmJiB1cGRhdGVkVG9wID49IHRvcDtcbiAgICAgICAgaGlkZUhlYWRlciA/ICQoJ2hlYWRlcicpLmNzcygndG9wJywgJy02MHB4JykgOiAkKCdoZWFkZXInKS5jc3MoJ3RvcCcsICcwcHgnKTtcbiAgICAgICAgdG9wID0gdXBkYXRlZFRvcDtcbiAgICAgIH0sIDI1MClcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9KTtcbiAgfSlcblxuICAkKCcuanMtbmF2aWdhdGlvbi1tZW51JykucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xuXG4gICQoJyNqcy1tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLmpzLW5hdmlnYXRpb24tbWVudScpLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uKCl7XG4gICAgICBpZigkKCcuanMtbmF2aWdhdGlvbi1tZW51JykuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAkKCcuanMtbmF2aWdhdGlvbi1tZW51JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbn0oKSkiLCJ2YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbWFyZ2luID0ge3RvcDogMzAsIHJpZ2h0OiAyMCwgYm90dG9tOiAzMCwgbGVmdDogMjB9O1xuICB2YXIgd2lkdGggPSBwYXJzZUludChkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLnN0eWxlKCd3aWR0aCcpLCAxMCk7XG4gIHZhciB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gIHZhciBiYXJIZWlnaHQgPSA0MDtcbiAgdmFyIHNwYWNpbmcgPSAzO1xuICB2YXIgaGVpZ2h0O1xuXG4gIC8vIHNjYWxlcyBhbmQgYXhlc1xuICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAgIC5kb21haW4oWzAsIDEwXSk7IC8vIGhhcmQtY29kaW5nIHRoaXMgYmVjYXVzZSBJIGtub3cgdGhlIGRhdGFcblxuICAvLyBvcmRpbmFsIHNjYWxlcyBhcmUgZWFzaWVyIGZvciB1bmlmb3JtIGJhciBoZWlnaHRzXG4gIC8vIEknbGwgc2V0IGRvbWFpbiBhbmQgcmFuZ2VCYW5kcyBhZnRlciBkYXRhIGxvYWRzXG4gIHZhciB5ID0gZDMuc2NhbGUub3JkaW5hbCgpOyBcblxuICB2YXIgY29sb3JTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuICAgICAgICAgICAgICAgICAgICAuZG9tYWluKFsnTGFuZ3VhZ2UnLCAnTGlicmFyeS9GcmFtZXdvcmsnLCAnU29mdHdhcmUvTWFuYWdlbWVudC9EZXBsb3ltZW50J10pXG4gICAgICAgICAgICAgICAgICAgIC5yYW5nZShbJyMwZjAnLCAnbWFnZW50YScsICdjeWFuJ10pO1xuXG4gIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgIC5zY2FsZSh4KVxuXG4gIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgdmFyIGNoYXJ0ID0gZDMuc2VsZWN0KCcubGFuZ3VhZ2UtY2hhcnQnKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuc3R5bGUoJ3dpZHRoJywgKHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpICsgJ3B4JylcbiAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBbbWFyZ2luLmxlZnQsIG1hcmdpbi50b3BdICsgJyknKTtcblxuICBkMy5qc29uKCcuLi8uLi9kYXRhL3NraWxscy5qc29uJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgYXBwZW5kQ2hhcnQoZGF0YS5za2lsbHMpXG4gIH0pXG5cbiAgZnVuY3Rpb24gYXBwZW5kQ2hhcnQoZGF0YSkge1xuICAgIC8vIHNldCB5IGRvbWFpblxuICAgIHkuZG9tYWluKGQzLnJhbmdlKGRhdGEubGVuZ3RoKSlcbiAgICAgICAgLnJhbmdlQmFuZHMoWzAsIGRhdGEubGVuZ3RoICogYmFySGVpZ2h0XSk7XG4gICAgXG4gICAgLy8gc2V0IGhlaWdodCBiYXNlZCBvbiBkYXRhXG4gICAgLy8gaGVpZ2h0ID0geS5yYW5nZUV4dGVudCgpWzFdO1xuICAgIGhlaWdodCA9IGRhdGEubGVuZ3RoICogYmFySGVpZ2h0O1xuICAgIGQzLnNlbGVjdChjaGFydC5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCAoaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pICsgJ3B4JylcblxuXG4gICAgLy8gYWRkIHRvcCBhbmQgYm90dG9tIGF4ZXNcbiAgICBjaGFydC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzIHRvcCcpXG4gICAgICAgIC5jYWxsKHhBeGlzLm9yaWVudCgndG9wJykpO1xuICAgIFxuICAgIGNoYXJ0LmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd4IGF4aXMgYm90dG9tJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgaGVpZ2h0ICsgJyknKVxuICAgICAgICAuY2FsbCh4QXhpcy5vcmllbnQoJ2JvdHRvbScpKTtcblxuICAgIHZhciBiYXJzID0gY2hhcnQuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmRhdGEoZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gJ3RyYW5zbGF0ZSgwLCcgICsgeShpKSArICcpJzsgfSk7XG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFja2dyb3VuZCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5LnJhbmdlQmFuZCgpKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCk7XG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGVyY2VudCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5LnJhbmdlQmFuZCgpKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbihkKSB7IFxuICAgICAgICAgIHJldHVybiB4KGQucGVyY2VudCAvIDEwKTsgXG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBjb2xvclNjYWxlKGQuY2F0ZWdvcnkpXG4gICAgICAgIH0pXG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLm5hbWU7IH0pXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICduYW1lJylcbiAgICAgICAgLmF0dHIoJ3knLCB5LnJhbmdlQmFuZCgpIC0gMTApXG4gICAgICAgIC5hdHRyKCd4Jywgc3BhY2luZylcbiAgICAgICAgLnN0eWxlKCdjb2xvcicsICd3aGl0ZScpXG5cbiAgICB2YXIgbGVnZW5kID0gY2hhcnQuc2VsZWN0QWxsKFwiLmxlZ2VuZFwiKVxuICAgICAgICAuZGF0YShjb2xvclNjYWxlLmRvbWFpbigpKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICB2YXIgdHJhbnNsYXRlWSA9ICgzMCAqIGkpICsgaGVpZ2h0IC0gMTAwXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKDAsXCIgKyB0cmFuc2xhdGVZICsgXCIpXCI7XG4gICAgICAgIH0pO1xuXG4gICAgbGVnZW5kLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHdpZHRoIC0gMTgpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTgpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDE4KVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gY29sb3JTY2FsZShkKTtcbiAgICAgICAgfSk7XG5cbiAgICBsZWdlbmQuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgd2lkdGggLSAyNSlcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDgpXG4gICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLXRleHQnKVxuICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGRcbiAgICAgICAgfSlcblxuICAgIGQzLnNlbGVjdCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemUpOyBcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICAgIC8vIHVwZGF0ZSB3aWR0aFxuICAgICAgd2lkdGggPSBwYXJzZUludChkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLnN0eWxlKCd3aWR0aCcpLCAxMCk7XG4gICAgICB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG5cbiAgICAgIC8vIHJlc2l6ZSB0aGUgY2hhcnRcbiAgICAgIHgucmFuZ2UoWzAsIHdpZHRoXSk7XG4gICAgICBkMy5zZWxlY3QoY2hhcnQubm9kZSgpLnBhcmVudE5vZGUpXG4gICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCAoeS5yYW5nZUV4dGVudCgpWzFdICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pICsgJ3B4JylcbiAgICAgICAgICAuc3R5bGUoJ3dpZHRoJywgKHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpICsgJ3B4Jyk7XG5cbiAgICAgIGNoYXJ0LnNlbGVjdEFsbCgncmVjdC5iYWNrZ3JvdW5kJylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCk7XG5cbiAgICAgIGNoYXJ0LnNlbGVjdEFsbCgncmVjdC5wZXJjZW50JylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbihkKSB7IHJldHVybiB4KGQucGVyY2VudCAvIDEwKTsgfSk7XG5cbiAgICAgIC8vIHVwZGF0ZSBheGVzXG4gICAgICBjaGFydC5zZWxlY3QoJy54LmF4aXMudG9wJykuY2FsbCh4QXhpcy5vcmllbnQoJ3RvcCcpKTtcbiAgICAgIGNoYXJ0LnNlbGVjdCgnLnguYXhpcy5ib3R0b20nKS5jYWxsKHhBeGlzLm9yaWVudCgnYm90dG9tJykpO1xuICB9XG5cblxufSgpKTsiLCIvKipcbiAqIGpRdWVyeSBleHRlbnNpb24sIGFkZCBzdXBwb3J0IGBzY3JvbGxzdGFydGAgYW5kIGBzY3JvbGxlbmRgIGV2ZW50cy5cbiAqXG4gKiBAYXV0aG9yICBSdWJhWGEgIDx0cmFzaEBydWJheGEub3JnPlxuICogQGdpdGh1YiAgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vUnViYVhhLzU1Njg5NjRcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqXG4gKiBAc2V0dGluZ3NcbiAqICAgICAgJC5zcGVjaWFsLnNjcm9sbGVuZC5kZWxheSA9IDMwMDsgLy8gZGVmYXVsdCBtc1xuICpcbiAqIEBmbGFnc1xuICogICAgICAkLmlzU2Nyb2xsZWQ7IC8vIGJvb2xlYW5cbiAqXG4gKiBAYmluZGluZ1xuICogICAgICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsc3RhcnQgc2Nyb2xsZW5kJywgZnVuY3Rpb24gKGV2dCl7XG4gKiAgICAgICAgICBpZiggZXZ0LnR5cGUgPT0gJ3Njcm9sbHN0YXJ0JyApe1xuICogICAgICAgICAgICAgIC8vIGxvZ2ljXG4gKiAgICAgICAgICB9XG4gKiAgICAgIH0pO1xuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCQpe1xuICAgIHZhclxuICAgICAgICAgIG5zICAgICAgICA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG4gICAgICAgICwgc3BlY2lhbCAgID0gJC5ldmVudC5zcGVjaWFsXG4gICAgICAgICwgZGlzcGF0Y2ggID0gJC5ldmVudC5oYW5kbGUgfHwgJC5ldmVudC5kaXNwYXRjaFxuIFxuICAgICAgICAsIHNjcm9sbCAgICAgICAgPSAnc2Nyb2xsJ1xuICAgICAgICAsIHNjcm9sbFN0YXJ0ICAgPSBzY3JvbGwgKyAnc3RhcnQnXG4gICAgICAgICwgc2Nyb2xsRW5kICAgICA9IHNjcm9sbCArICdlbmQnXG4gICAgICAgICwgbnNTY3JvbGxTdGFydCA9IHNjcm9sbCArJy4nKyBzY3JvbGxTdGFydCArIG5zXG4gICAgICAgICwgbnNTY3JvbGxFbmQgICA9IHNjcm9sbCArJy4nKyBzY3JvbGxFbmQgKyBuc1xuICAgIDtcbiBcbiAgICBzcGVjaWFsLnNjcm9sbHN0YXJ0ID0ge1xuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgcGlkLCBoYW5kbGVyID0gZnVuY3Rpb24gKGV2dC8qKiQuRXZlbnQqLyl7XG4gICAgICAgICAgICAgICAgaWYoIHBpZCA9PSBudWxsICl7XG4gICAgICAgICAgICAgICAgICAgIGV2dC50eXBlID0gc2Nyb2xsU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gXG4gICAgICAgICAgICAgICAgcGlkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwaWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIHNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5KTtcbiBcbiAgICAgICAgICAgIH07XG4gXG4gICAgICAgICAgICAkKHRoaXMpLmJpbmQobnNTY3JvbGxTdGFydCwgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQodGhpcykudW5iaW5kKG5zU2Nyb2xsU3RhcnQpO1xuICAgICAgICB9XG4gICAgfTtcbiBcbiAgICBzcGVjaWFsLnNjcm9sbGVuZCA9IHtcbiAgICAgICAgZGVsYXk6IDMwMCxcbiBcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdmFyIHBpZCwgaGFuZGxlciA9IGZ1bmN0aW9uIChldnQvKiokLkV2ZW50Ki8pe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBpZCk7XG4gICAgICAgICAgICAgICAgcGlkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBldnQudHlwZSA9IHNjcm9sbEVuZDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2guYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0sIHNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5KTtcbiBcbiAgICAgICAgICAgIH07XG4gXG4gICAgICAgICAgICAkKHRoaXMpLmJpbmQobnNTY3JvbGxFbmQsIGhhbmRsZXIpO1xuIFxuICAgICAgICB9LFxuIFxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHRoaXMpLnVuYmluZChuc1Njcm9sbEVuZCk7XG4gICAgICAgIH1cbiAgICB9O1xuIFxuIFxuICAgICQuaXNTY3JvbGxlZCA9IGZhbHNlO1xuICAgICQod2luZG93KS5iaW5kKHNjcm9sbFN0YXJ0KycgJytzY3JvbGxFbmQsIGZ1bmN0aW9uIChldnQvKipFdmVudCovKXtcbiAgICAgICAgJC5pc1Njcm9sbGVkID0gKGV2dC50eXBlID09IHNjcm9sbFN0YXJ0KTtcbiAgICAgICAgJCgnYm9keScpWyQuaXNTY3JvbGxlZCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnaXMtc2Nyb2xsZWQnKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7Il19
