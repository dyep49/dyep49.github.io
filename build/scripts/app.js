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
    $('.navigation-tools').toggle();
    $('.js-navigation-menu').slideToggle(function(){
      if($('.js-navigation-menu').is(':hidden')) {
        $('.js-navigation-menu').removeAttr('style');
        $('.navigation-tools').hide();
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
      .tickFormat(function(d) {
        switch(d) {
          case 3:
            d = "3*";
            break;
          case 6:
            d = "6**";
            break;
          case 8:
            d = "8***";
            break;
        }
        return d
      })

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
        })
        .style('display', function() {
          var mobile = d3.select('.mobile-legend').style('display') !== "none";
          return mobile ? "none" : "block";
        })

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
      var updatedWidth = parseInt(d3.select('.language-chart').style('width'), 10);
      updatedWidth = updatedWidth - margin.left - margin.right;

      // resize the chart
      x.range([0, updatedWidth]);
      d3.select(chart.node().parentNode)
          .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
          .style('width', (updatedWidth + margin.left + margin.right) + 'px');

      chart.selectAll('.legend')
        .style('display', function() {
          var mobile = d3.select('.mobile-legend').style('display') !== "none";
          return mobile ? "none" : "block";
        })
        .attr("transform", function (d, i) {
          var translateY = (30 * i) + height - 100
          var translateX = updatedWidth - width;
          return "translate(" + translateX + "," + translateY + ")";
        })




      chart.selectAll('rect.background')
          .attr('width', updatedWidth);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy9sYW5ndWFnZS1jaGFydC5qcyIsInNyYy9zY3JpcHRzL3ZlbmRvci9zY3JvbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOzs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2hlYWRlci5qcycpO1xucmVxdWlyZSgnLi9sYW5ndWFnZS1jaGFydC5qcycpIiwiLy8gdmFyIHN0dWZmID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcbnJlcXVpcmUoJy4vdmVuZG9yL3Njcm9sbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgc2Nyb2xsSW50ZXJ2YWw7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgXG4gICAgICBzY3JvbGxJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdXBkYXRlZFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmFyIGhpZGVIZWFkZXIgPSB1cGRhdGVkVG9wID4gNjAgJiYgdXBkYXRlZFRvcCA+PSB0b3A7XG4gICAgICAgIGhpZGVIZWFkZXIgPyAkKCdoZWFkZXInKS5jc3MoJ3RvcCcsICctNjBweCcpIDogJCgnaGVhZGVyJykuY3NzKCd0b3AnLCAnMHB4Jyk7XG4gICAgICAgIHRvcCA9IHVwZGF0ZWRUb3A7XG4gICAgICB9LCAyNTApXG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChzY3JvbGxJbnRlcnZhbCk7XG4gICAgfSk7XG4gIH0pXG5cbiAgJCgnLmpzLW5hdmlnYXRpb24tbWVudScpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcblxuICAkKCcjanMtbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoJy5uYXZpZ2F0aW9uLXRvb2xzJykudG9nZ2xlKCk7XG4gICAgJCgnLmpzLW5hdmlnYXRpb24tbWVudScpLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uKCl7XG4gICAgICBpZigkKCcuanMtbmF2aWdhdGlvbi1tZW51JykuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAkKCcuanMtbmF2aWdhdGlvbi1tZW51JykucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgJCgnLm5hdmlnYXRpb24tdG9vbHMnKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG59KCkpIiwidmFyIGQzID0gcmVxdWlyZSgnZDMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1hcmdpbiA9IHt0b3A6IDMwLCByaWdodDogMjAsIGJvdHRvbTogMzAsIGxlZnQ6IDIwfTtcbiAgdmFyIHdpZHRoID0gcGFyc2VJbnQoZDMuc2VsZWN0KCcubGFuZ3VhZ2UtY2hhcnQnKS5zdHlsZSgnd2lkdGgnKSwgMTApO1xuICB2YXIgd2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuICB2YXIgYmFySGVpZ2h0ID0gNDA7XG4gIHZhciBzcGFjaW5nID0gMztcbiAgdmFyIGhlaWdodDtcblxuICAvLyBzY2FsZXMgYW5kIGF4ZXNcbiAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLnJhbmdlKFswLCB3aWR0aF0pXG4gICAgICAuZG9tYWluKFswLCAxMF0pOyAvLyBoYXJkLWNvZGluZyB0aGlzIGJlY2F1c2UgSSBrbm93IHRoZSBkYXRhXG5cbiAgLy8gb3JkaW5hbCBzY2FsZXMgYXJlIGVhc2llciBmb3IgdW5pZm9ybSBiYXIgaGVpZ2h0c1xuICAvLyBJJ2xsIHNldCBkb21haW4gYW5kIHJhbmdlQmFuZHMgYWZ0ZXIgZGF0YSBsb2Fkc1xuICB2YXIgeSA9IGQzLnNjYWxlLm9yZGluYWwoKTsgXG5cbiAgdmFyIGNvbG9yU2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcbiAgICAgICAgICAgICAgICAgICAgLmRvbWFpbihbJ0xhbmd1YWdlJywgJ0xpYnJhcnkvRnJhbWV3b3JrJywgJ1NvZnR3YXJlL01hbmFnZW1lbnQvRGVwbG95bWVudCddKVxuICAgICAgICAgICAgICAgICAgICAucmFuZ2UoWycjMGYwJywgJ21hZ2VudGEnLCAnY3lhbiddKTtcblxuICB2YXIgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAuc2NhbGUoeClcbiAgICAgIC50aWNrRm9ybWF0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgc3dpdGNoKGQpIHtcbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBkID0gXCIzKlwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgZCA9IFwiNioqXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICBkID0gXCI4KioqXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZFxuICAgICAgfSlcblxuICAvLyBjcmVhdGUgdGhlIGNoYXJ0XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnLmxhbmd1YWdlLWNoYXJ0JykuYXBwZW5kKCdzdmcnKVxuICAgICAgLnN0eWxlKCd3aWR0aCcsICh3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KSArICdweCcpXG4gICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgW21hcmdpbi5sZWZ0LCBtYXJnaW4udG9wXSArICcpJyk7XG5cbiAgZDMuanNvbignLi4vLi4vZGF0YS9za2lsbHMuanNvbicsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGFwcGVuZENoYXJ0KGRhdGEuc2tpbGxzKVxuICB9KVxuXG4gIGZ1bmN0aW9uIGFwcGVuZENoYXJ0KGRhdGEpIHtcbiAgICAvLyBzZXQgeSBkb21haW5cbiAgICB5LmRvbWFpbihkMy5yYW5nZShkYXRhLmxlbmd0aCkpXG4gICAgICAgIC5yYW5nZUJhbmRzKFswLCBkYXRhLmxlbmd0aCAqIGJhckhlaWdodF0pO1xuICAgIFxuICAgIC8vIHNldCBoZWlnaHQgYmFzZWQgb24gZGF0YVxuICAgIC8vIGhlaWdodCA9IHkucmFuZ2VFeHRlbnQoKVsxXTtcbiAgICBoZWlnaHQgPSBkYXRhLmxlbmd0aCAqIGJhckhlaWdodDtcbiAgICBkMy5zZWxlY3QoY2hhcnQubm9kZSgpLnBhcmVudE5vZGUpXG4gICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgKGhlaWdodCArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tKSArICdweCcpXG5cblxuICAgIC8vIGFkZCB0b3AgYW5kIGJvdHRvbSBheGVzXG4gICAgY2hhcnQuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ggYXhpcyB0b3AnKVxuICAgICAgICAuY2FsbCh4QXhpcy5vcmllbnQoJ3RvcCcpKTtcbiAgICBcbiAgICBjaGFydC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzIGJvdHRvbScpXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJyArIGhlaWdodCArICcpJylcbiAgICAgICAgLmNhbGwoeEF4aXMub3JpZW50KCdib3R0b20nKSk7XG5cbiAgICB2YXIgYmFycyA9IGNoYXJ0LnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5kYXRhKGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQsIGkpIHsgcmV0dXJuICd0cmFuc2xhdGUoMCwnICArIHkoaSkgKyAnKSc7IH0pO1xuICAgIFxuICAgIGJhcnMuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhY2tncm91bmQnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgeS5yYW5nZUJhbmQoKSlcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpO1xuICAgIFxuICAgIGJhcnMuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BlcmNlbnQnKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgeS5yYW5nZUJhbmQoKSlcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oZCkgeyBcbiAgICAgICAgICByZXR1cm4geChkLnBlcmNlbnQgLyAxMCk7IFxuICAgICAgICB9KVxuICAgICAgICAuYXR0cignZmlsbCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gY29sb3JTY2FsZShkLmNhdGVnb3J5KVxuICAgICAgICB9KVxuICAgIFxuICAgIGJhcnMuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5uYW1lOyB9KVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbmFtZScpXG4gICAgICAgIC5hdHRyKCd5JywgeS5yYW5nZUJhbmQoKSAtIDEwKVxuICAgICAgICAuYXR0cigneCcsIHNwYWNpbmcpXG4gICAgICAgIC5zdHlsZSgnY29sb3InLCAnd2hpdGUnKVxuXG4gICAgdmFyIGxlZ2VuZCA9IGNoYXJ0LnNlbGVjdEFsbChcIi5sZWdlbmRcIilcbiAgICAgICAgLmRhdGEoY29sb3JTY2FsZS5kb21haW4oKSlcbiAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGVnZW5kXCIpXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgdmFyIHRyYW5zbGF0ZVkgPSAoMzAgKiBpKSArIGhlaWdodCAtIDEwMFxuICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZSgwLFwiICsgdHJhbnNsYXRlWSArIFwiKVwiO1xuICAgICAgICB9KVxuICAgICAgICAuc3R5bGUoJ2Rpc3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW9iaWxlID0gZDMuc2VsZWN0KCcubW9iaWxlLWxlZ2VuZCcpLnN0eWxlKCdkaXNwbGF5JykgIT09IFwibm9uZVwiO1xuICAgICAgICAgIHJldHVybiBtb2JpbGUgPyBcIm5vbmVcIiA6IFwiYmxvY2tcIjtcbiAgICAgICAgfSlcblxuICAgIGxlZ2VuZC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwieFwiLCB3aWR0aCAtIDE4KVxuICAgICAgICAuYXR0cihcIndpZHRoXCIsIDE4KVxuICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxOClcbiAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yU2NhbGUoZCk7XG4gICAgICAgIH0pO1xuXG4gICAgbGVnZW5kLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHdpZHRoIC0gMjUpXG4gICAgICAgIC5hdHRyKFwieVwiLCA4KVxuICAgICAgICAuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xlZ2VuZC10ZXh0JylcbiAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcbiAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBkXG4gICAgICAgIH0pXG5cbiAgICBkMy5zZWxlY3Qod2luZG93KS5vbigncmVzaXplJywgcmVzaXplKTsgXG4gIH1cblxuICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgICAvLyB1cGRhdGUgd2lkdGhcbiAgICAgIHZhciB1cGRhdGVkV2lkdGggPSBwYXJzZUludChkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLnN0eWxlKCd3aWR0aCcpLCAxMCk7XG4gICAgICB1cGRhdGVkV2lkdGggPSB1cGRhdGVkV2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcblxuICAgICAgLy8gcmVzaXplIHRoZSBjaGFydFxuICAgICAgeC5yYW5nZShbMCwgdXBkYXRlZFdpZHRoXSk7XG4gICAgICBkMy5zZWxlY3QoY2hhcnQubm9kZSgpLnBhcmVudE5vZGUpXG4gICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCAoeS5yYW5nZUV4dGVudCgpWzFdICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pICsgJ3B4JylcbiAgICAgICAgICAuc3R5bGUoJ3dpZHRoJywgKHVwZGF0ZWRXaWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KSArICdweCcpO1xuXG4gICAgICBjaGFydC5zZWxlY3RBbGwoJy5sZWdlbmQnKVxuICAgICAgICAuc3R5bGUoJ2Rpc3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgbW9iaWxlID0gZDMuc2VsZWN0KCcubW9iaWxlLWxlZ2VuZCcpLnN0eWxlKCdkaXNwbGF5JykgIT09IFwibm9uZVwiO1xuICAgICAgICAgIHJldHVybiBtb2JpbGUgPyBcIm5vbmVcIiA6IFwiYmxvY2tcIjtcbiAgICAgICAgfSlcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICB2YXIgdHJhbnNsYXRlWSA9ICgzMCAqIGkpICsgaGVpZ2h0IC0gMTAwXG4gICAgICAgICAgdmFyIHRyYW5zbGF0ZVggPSB1cGRhdGVkV2lkdGggLSB3aWR0aDtcbiAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB0cmFuc2xhdGVYICsgXCIsXCIgKyB0cmFuc2xhdGVZICsgXCIpXCI7XG4gICAgICAgIH0pXG5cblxuXG5cbiAgICAgIGNoYXJ0LnNlbGVjdEFsbCgncmVjdC5iYWNrZ3JvdW5kJylcbiAgICAgICAgICAuYXR0cignd2lkdGgnLCB1cGRhdGVkV2lkdGgpO1xuXG4gICAgICBjaGFydC5zZWxlY3RBbGwoJ3JlY3QucGVyY2VudCcpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oZCkgeyByZXR1cm4geChkLnBlcmNlbnQgLyAxMCk7IH0pO1xuXG4gICAgICAvLyB1cGRhdGUgYXhlc1xuICAgICAgY2hhcnQuc2VsZWN0KCcueC5heGlzLnRvcCcpLmNhbGwoeEF4aXMub3JpZW50KCd0b3AnKSk7XG4gICAgICBjaGFydC5zZWxlY3QoJy54LmF4aXMuYm90dG9tJykuY2FsbCh4QXhpcy5vcmllbnQoJ2JvdHRvbScpKTtcbiAgfVxuXG5cbn0oKSk7XG4iLCIvKipcbiAqIGpRdWVyeSBleHRlbnNpb24sIGFkZCBzdXBwb3J0IGBzY3JvbGxzdGFydGAgYW5kIGBzY3JvbGxlbmRgIGV2ZW50cy5cbiAqXG4gKiBAYXV0aG9yICBSdWJhWGEgIDx0cmFzaEBydWJheGEub3JnPlxuICogQGdpdGh1YiAgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vUnViYVhhLzU1Njg5NjRcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqXG4gKiBAc2V0dGluZ3NcbiAqICAgICAgJC5zcGVjaWFsLnNjcm9sbGVuZC5kZWxheSA9IDMwMDsgLy8gZGVmYXVsdCBtc1xuICpcbiAqIEBmbGFnc1xuICogICAgICAkLmlzU2Nyb2xsZWQ7IC8vIGJvb2xlYW5cbiAqXG4gKiBAYmluZGluZ1xuICogICAgICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsc3RhcnQgc2Nyb2xsZW5kJywgZnVuY3Rpb24gKGV2dCl7XG4gKiAgICAgICAgICBpZiggZXZ0LnR5cGUgPT0gJ3Njcm9sbHN0YXJ0JyApe1xuICogICAgICAgICAgICAgIC8vIGxvZ2ljXG4gKiAgICAgICAgICB9XG4gKiAgICAgIH0pO1xuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCQpe1xuICAgIHZhclxuICAgICAgICAgIG5zICAgICAgICA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpXG4gICAgICAgICwgc3BlY2lhbCAgID0gJC5ldmVudC5zcGVjaWFsXG4gICAgICAgICwgZGlzcGF0Y2ggID0gJC5ldmVudC5oYW5kbGUgfHwgJC5ldmVudC5kaXNwYXRjaFxuIFxuICAgICAgICAsIHNjcm9sbCAgICAgICAgPSAnc2Nyb2xsJ1xuICAgICAgICAsIHNjcm9sbFN0YXJ0ICAgPSBzY3JvbGwgKyAnc3RhcnQnXG4gICAgICAgICwgc2Nyb2xsRW5kICAgICA9IHNjcm9sbCArICdlbmQnXG4gICAgICAgICwgbnNTY3JvbGxTdGFydCA9IHNjcm9sbCArJy4nKyBzY3JvbGxTdGFydCArIG5zXG4gICAgICAgICwgbnNTY3JvbGxFbmQgICA9IHNjcm9sbCArJy4nKyBzY3JvbGxFbmQgKyBuc1xuICAgIDtcbiBcbiAgICBzcGVjaWFsLnNjcm9sbHN0YXJ0ID0ge1xuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgcGlkLCBoYW5kbGVyID0gZnVuY3Rpb24gKGV2dC8qKiQuRXZlbnQqLyl7XG4gICAgICAgICAgICAgICAgaWYoIHBpZCA9PSBudWxsICl7XG4gICAgICAgICAgICAgICAgICAgIGV2dC50eXBlID0gc2Nyb2xsU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gXG4gICAgICAgICAgICAgICAgcGlkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBwaWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIHNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5KTtcbiBcbiAgICAgICAgICAgIH07XG4gXG4gICAgICAgICAgICAkKHRoaXMpLmJpbmQobnNTY3JvbGxTdGFydCwgaGFuZGxlcik7XG4gICAgICAgIH0sXG4gXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQodGhpcykudW5iaW5kKG5zU2Nyb2xsU3RhcnQpO1xuICAgICAgICB9XG4gICAgfTtcbiBcbiAgICBzcGVjaWFsLnNjcm9sbGVuZCA9IHtcbiAgICAgICAgZGVsYXk6IDMwMCxcbiBcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdmFyIHBpZCwgaGFuZGxlciA9IGZ1bmN0aW9uIChldnQvKiokLkV2ZW50Ki8pe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBpZCk7XG4gICAgICAgICAgICAgICAgcGlkID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBldnQudHlwZSA9IHNjcm9sbEVuZDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2guYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0sIHNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5KTtcbiBcbiAgICAgICAgICAgIH07XG4gXG4gICAgICAgICAgICAkKHRoaXMpLmJpbmQobnNTY3JvbGxFbmQsIGhhbmRsZXIpO1xuIFxuICAgICAgICB9LFxuIFxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHRoaXMpLnVuYmluZChuc1Njcm9sbEVuZCk7XG4gICAgICAgIH1cbiAgICB9O1xuIFxuIFxuICAgICQuaXNTY3JvbGxlZCA9IGZhbHNlO1xuICAgICQod2luZG93KS5iaW5kKHNjcm9sbFN0YXJ0KycgJytzY3JvbGxFbmQsIGZ1bmN0aW9uIChldnQvKipFdmVudCovKXtcbiAgICAgICAgJC5pc1Njcm9sbGVkID0gKGV2dC50eXBlID09IHNjcm9sbFN0YXJ0KTtcbiAgICAgICAgJCgnYm9keScpWyQuaXNTY3JvbGxlZCA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnaXMtc2Nyb2xsZWQnKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7Il19
