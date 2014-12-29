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

  $('#js-navigation-menu').removeClass("show");

  $('#js-mobile-menu').on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
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
                    .domain(['Language', 'Library/Framework', 'Management/Automation/Deployment'])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy9sYW5ndWFnZS1jaGFydC5qcyIsInNyYy9zY3JpcHRzL3ZlbmRvci9zY3JvbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2hlYWRlci5qcycpO1xucmVxdWlyZSgnLi9sYW5ndWFnZS1jaGFydC5qcycpIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLy8gdmFyIHN0dWZmID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcbnJlcXVpcmUoJy4vdmVuZG9yL3Njcm9sbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgc2Nyb2xsSW50ZXJ2YWw7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgXG4gICAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdXBkYXRlZFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmFyIGhpZGVIZWFkZXIgPSB1cGRhdGVkVG9wID4gNjAgJiYgdXBkYXRlZFRvcCA+PSB0b3A7XG4gICAgICAgIGhpZGVIZWFkZXIgPyAkKCdoZWFkZXInKS5jc3MoJ3RvcCcsICctNjBweCcpIDogJCgnaGVhZGVyJykuY3NzKCd0b3AnLCAnMHB4Jyk7XG4gICAgICAgIHRvcCA9IHVwZGF0ZWRUb3A7XG4gICAgICB9LCAyNTApXG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChzY3JvbGxJbnRlcnZhbCk7XG4gICAgfSk7XG4gIH0pXG5cbiAgJCgnI2pzLW5hdmlnYXRpb24tbWVudScpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcblxuICAkKCcjanMtbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoJyNqcy1uYXZpZ2F0aW9uLW1lbnUnKS5zbGlkZVRvZ2dsZShmdW5jdGlvbigpe1xuICAgICAgaWYoJCgnI2pzLW5hdmlnYXRpb24tbWVudScpLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgJCgnI2pzLW5hdmlnYXRpb24tbWVudScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG59KCkpXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbWFyZ2luID0ge3RvcDogMzAsIHJpZ2h0OiAyMCwgYm90dG9tOiAzMCwgbGVmdDogMjB9O1xuICB2YXIgd2lkdGggPSBwYXJzZUludChkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLnN0eWxlKCd3aWR0aCcpLCAxMCk7XG4gIHZhciB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gIHZhciBiYXJIZWlnaHQgPSA0MDtcbiAgdmFyIHNwYWNpbmcgPSAzO1xuICB2YXIgaGVpZ2h0O1xuXG4gIC8vIHNjYWxlcyBhbmQgYXhlc1xuICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAgIC5kb21haW4oWzAsIDEwXSk7IC8vIGhhcmQtY29kaW5nIHRoaXMgYmVjYXVzZSBJIGtub3cgdGhlIGRhdGFcblxuICAvLyBvcmRpbmFsIHNjYWxlcyBhcmUgZWFzaWVyIGZvciB1bmlmb3JtIGJhciBoZWlnaHRzXG4gIC8vIEknbGwgc2V0IGRvbWFpbiBhbmQgcmFuZ2VCYW5kcyBhZnRlciBkYXRhIGxvYWRzXG4gIHZhciB5ID0gZDMuc2NhbGUub3JkaW5hbCgpOyBcblxuICB2YXIgY29sb3JTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuICAgICAgICAgICAgICAgICAgICAuZG9tYWluKFsnTGFuZ3VhZ2UnLCAnTGlicmFyeS9GcmFtZXdvcmsnLCAnTWFuYWdlbWVudC9BdXRvbWF0aW9uL0RlcGxveW1lbnQnXSlcbiAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFsnIzBmMCcsICdtYWdlbnRhJywgJ2N5YW4nXSk7XG5cbiAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgLnNjYWxlKHgpXG5cbiAgLy8gY3JlYXRlIHRoZSBjaGFydFxuICB2YXIgY2hhcnQgPSBkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5zdHlsZSgnd2lkdGgnLCAod2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCkgKyAncHgnKVxuICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIFttYXJnaW4ubGVmdCwgbWFyZ2luLnRvcF0gKyAnKScpO1xuXG4gIGQzLmpzb24oJy4uLy4uL2RhdGEvc2tpbGxzLmpzb24nLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBhcHBlbmRDaGFydChkYXRhLnNraWxscylcbiAgfSlcblxuICBmdW5jdGlvbiBhcHBlbmRDaGFydChkYXRhKSB7XG4gICAgLy8gc2V0IHkgZG9tYWluXG4gICAgeS5kb21haW4oZDMucmFuZ2UoZGF0YS5sZW5ndGgpKVxuICAgICAgICAucmFuZ2VCYW5kcyhbMCwgZGF0YS5sZW5ndGggKiBiYXJIZWlnaHRdKTtcbiAgICBcbiAgICAvLyBzZXQgaGVpZ2h0IGJhc2VkIG9uIGRhdGFcbiAgICAvLyBoZWlnaHQgPSB5LnJhbmdlRXh0ZW50KClbMV07XG4gICAgaGVpZ2h0ID0gZGF0YS5sZW5ndGggKiBiYXJIZWlnaHQ7XG4gICAgZDMuc2VsZWN0KGNoYXJ0Lm5vZGUoKS5wYXJlbnROb2RlKVxuICAgICAgICAuc3R5bGUoJ2hlaWdodCcsIChoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSkgKyAncHgnKVxuXG5cbiAgICAvLyBhZGQgdG9wIGFuZCBib3R0b20gYXhlc1xuICAgIGNoYXJ0LmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd4IGF4aXMgdG9wJylcbiAgICAgICAgLmNhbGwoeEF4aXMub3JpZW50KCd0b3AnKSk7XG4gICAgXG4gICAgY2hhcnQuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ggYXhpcyBib3R0b20nKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcgKyBoZWlnaHQgKyAnKScpXG4gICAgICAgIC5jYWxsKHhBeGlzLm9yaWVudCgnYm90dG9tJykpO1xuXG4gICAgdmFyIGJhcnMgPSBjaGFydC5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkLCBpKSB7IHJldHVybiAndHJhbnNsYXRlKDAsJyAgKyB5KGkpICsgJyknOyB9KTtcbiAgICBcbiAgICBiYXJzLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdiYWNrZ3JvdW5kJylcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHkucmFuZ2VCYW5kKCkpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKTtcbiAgICBcbiAgICBiYXJzLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdwZXJjZW50JylcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHkucmFuZ2VCYW5kKCkpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKGQpIHsgXG4gICAgICAgICAgcmV0dXJuIHgoZC5wZXJjZW50IC8gMTApOyBcbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yU2NhbGUoZC5jYXRlZ29yeSlcbiAgICAgICAgfSlcbiAgICBcbiAgICBiYXJzLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQubmFtZTsgfSlcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25hbWUnKVxuICAgICAgICAuYXR0cigneScsIHkucmFuZ2VCYW5kKCkgLSAxMClcbiAgICAgICAgLmF0dHIoJ3gnLCBzcGFjaW5nKVxuICAgICAgICAuc3R5bGUoJ2NvbG9yJywgJ3doaXRlJylcblxuICAgIHZhciBsZWdlbmQgPSBjaGFydC5zZWxlY3RBbGwoXCIubGVnZW5kXCIpXG4gICAgICAgIC5kYXRhKGNvbG9yU2NhbGUuZG9tYWluKCkpXG4gICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZFwiKVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgIHZhciB0cmFuc2xhdGVZID0gKDMwICogaSkgKyBoZWlnaHQgLSAxMDBcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoMCxcIiArIHRyYW5zbGF0ZVkgKyBcIilcIjtcbiAgICAgICAgfSk7XG5cbiAgICBsZWdlbmQuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgd2lkdGggLSAxOClcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxOClcbiAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMTgpXG4gICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBjb2xvclNjYWxlKGQpO1xuICAgICAgICB9KTtcblxuICAgIGxlZ2VuZC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCB3aWR0aCAtIDI1KVxuICAgICAgICAuYXR0cihcInlcIiwgOClcbiAgICAgICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdsZWdlbmQtdGV4dCcpXG4gICAgICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gZFxuICAgICAgICB9KVxuXG4gICAgZDMuc2VsZWN0KHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZSk7IFxuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplKCkge1xuICAgICAgLy8gdXBkYXRlIHdpZHRoXG4gICAgICB3aWR0aCA9IHBhcnNlSW50KGQzLnNlbGVjdCgnLmxhbmd1YWdlLWNoYXJ0Jykuc3R5bGUoJ3dpZHRoJyksIDEwKTtcbiAgICAgIHdpZHRoID0gd2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcblxuICAgICAgLy8gcmVzaXplIHRoZSBjaGFydFxuICAgICAgeC5yYW5nZShbMCwgd2lkdGhdKTtcbiAgICAgIGQzLnNlbGVjdChjaGFydC5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsICh5LnJhbmdlRXh0ZW50KClbMV0gKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSkgKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgnd2lkdGgnLCAod2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodCkgKyAncHgnKTtcblxuICAgICAgY2hhcnQuc2VsZWN0QWxsKCdyZWN0LmJhY2tncm91bmQnKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKTtcblxuICAgICAgY2hhcnQuc2VsZWN0QWxsKCdyZWN0LnBlcmNlbnQnKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgoZC5wZXJjZW50IC8gMTApOyB9KTtcblxuICAgICAgLy8gdXBkYXRlIGF4ZXNcbiAgICAgIGNoYXJ0LnNlbGVjdCgnLnguYXhpcy50b3AnKS5jYWxsKHhBeGlzLm9yaWVudCgndG9wJykpO1xuICAgICAgY2hhcnQuc2VsZWN0KCcueC5heGlzLmJvdHRvbScpLmNhbGwoeEF4aXMub3JpZW50KCdib3R0b20nKSk7XG4gIH1cblxuXG59KCkpOyIsIi8qKlxuICogalF1ZXJ5IGV4dGVuc2lvbiwgYWRkIHN1cHBvcnQgYHNjcm9sbHN0YXJ0YCBhbmQgYHNjcm9sbGVuZGAgZXZlbnRzLlxuICpcbiAqIEBhdXRob3IgIFJ1YmFYYSAgPHRyYXNoQHJ1YmF4YS5vcmc+XG4gKiBAZ2l0aHViICBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9SdWJhWGEvNTU2ODk2NFxuICogQGxpY2Vuc2UgTUlUXG4gKlxuICpcbiAqIEBzZXR0aW5nc1xuICogICAgICAkLnNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5ID0gMzAwOyAvLyBkZWZhdWx0IG1zXG4gKlxuICogQGZsYWdzXG4gKiAgICAgICQuaXNTY3JvbGxlZDsgLy8gYm9vbGVhblxuICpcbiAqIEBiaW5kaW5nXG4gKiAgICAgICQod2luZG93KS5iaW5kKCdzY3JvbGxzdGFydCBzY3JvbGxlbmQnLCBmdW5jdGlvbiAoZXZ0KXtcbiAqICAgICAgICAgIGlmKCBldnQudHlwZSA9PSAnc2Nyb2xsc3RhcnQnICl7XG4gKiAgICAgICAgICAgICAgLy8gbG9naWNcbiAqICAgICAgICAgIH1cbiAqICAgICAgfSk7XG4gKlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoJCl7XG4gICAgdmFyXG4gICAgICAgICAgbnMgICAgICAgID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgICAgICAgLCBzcGVjaWFsICAgPSAkLmV2ZW50LnNwZWNpYWxcbiAgICAgICAgLCBkaXNwYXRjaCAgPSAkLmV2ZW50LmhhbmRsZSB8fCAkLmV2ZW50LmRpc3BhdGNoXG4gXG4gICAgICAgICwgc2Nyb2xsICAgICAgICA9ICdzY3JvbGwnXG4gICAgICAgICwgc2Nyb2xsU3RhcnQgICA9IHNjcm9sbCArICdzdGFydCdcbiAgICAgICAgLCBzY3JvbGxFbmQgICAgID0gc2Nyb2xsICsgJ2VuZCdcbiAgICAgICAgLCBuc1Njcm9sbFN0YXJ0ID0gc2Nyb2xsICsnLicrIHNjcm9sbFN0YXJ0ICsgbnNcbiAgICAgICAgLCBuc1Njcm9sbEVuZCAgID0gc2Nyb2xsICsnLicrIHNjcm9sbEVuZCArIG5zXG4gICAgO1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsc3RhcnQgPSB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHZhciBwaWQsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0LyoqJC5FdmVudCovKXtcbiAgICAgICAgICAgICAgICBpZiggcGlkID09IG51bGwgKXtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnR5cGUgPSBzY3JvbGxTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHBpZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbFN0YXJ0LCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiBcbiAgICAgICAgdGVhcmRvd246IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh0aGlzKS51bmJpbmQobnNTY3JvbGxTdGFydCk7XG4gICAgICAgIH1cbiAgICB9O1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsZW5kID0ge1xuICAgICAgICBkZWxheTogMzAwLFxuIFxuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgcGlkLCBoYW5kbGVyID0gZnVuY3Rpb24gKGV2dC8qKiQuRXZlbnQqLyl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiBcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGV2dC50eXBlID0gc2Nyb2xsRW5kO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaC5hcHBseShfdGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbEVuZCwgaGFuZGxlcik7XG4gXG4gICAgICAgIH0sXG4gXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQodGhpcykudW5iaW5kKG5zU2Nyb2xsRW5kKTtcbiAgICAgICAgfVxuICAgIH07XG4gXG4gXG4gICAgJC5pc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgJCh3aW5kb3cpLmJpbmQoc2Nyb2xsU3RhcnQrJyAnK3Njcm9sbEVuZCwgZnVuY3Rpb24gKGV2dC8qKkV2ZW50Ki8pe1xuICAgICAgICAkLmlzU2Nyb2xsZWQgPSAoZXZ0LnR5cGUgPT0gc2Nyb2xsU3RhcnQpO1xuICAgICAgICAkKCdib2R5JylbJC5pc1Njcm9sbGVkID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdpcy1zY3JvbGxlZCcpO1xuICAgIH0pO1xufSkoalF1ZXJ5KTsiXX0=
