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
          console.log(translateX)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy9sYW5ndWFnZS1jaGFydC5qcyIsInNyYy9zY3JpcHRzL3ZlbmRvci9zY3JvbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOzs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vaGVhZGVyLmpzJyk7XG5yZXF1aXJlKCcuL2xhbmd1YWdlLWNoYXJ0LmpzJykiLCIvLyB2YXIgc3R1ZmYgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuJCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuJCA6IG51bGwpO1xucmVxdWlyZSgnLi92ZW5kb3Ivc2Nyb2xsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY3JvbGxJbnRlcnZhbDtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICBcbiAgICAgIHNjcm9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cGRhdGVkVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICB2YXIgaGlkZUhlYWRlciA9IHVwZGF0ZWRUb3AgPiA2MCAmJiB1cGRhdGVkVG9wID49IHRvcDtcbiAgICAgICAgaGlkZUhlYWRlciA/ICQoJ2hlYWRlcicpLmNzcygndG9wJywgJy02MHB4JykgOiAkKCdoZWFkZXInKS5jc3MoJ3RvcCcsICcwcHgnKTtcbiAgICAgICAgdG9wID0gdXBkYXRlZFRvcDtcbiAgICAgIH0sIDI1MClcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9KTtcbiAgfSlcblxuICAkKCcuanMtbmF2aWdhdGlvbi1tZW51JykucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xuXG4gICQoJyNqcy1tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCgnLm5hdmlnYXRpb24tdG9vbHMnKS50b2dnbGUoKTtcbiAgICAkKCcuanMtbmF2aWdhdGlvbi1tZW51Jykuc2xpZGVUb2dnbGUoZnVuY3Rpb24oKXtcbiAgICAgIGlmKCQoJy5qcy1uYXZpZ2F0aW9uLW1lbnUnKS5pcygnOmhpZGRlbicpKSB7XG4gICAgICAgICQoJy5qcy1uYXZpZ2F0aW9uLW1lbnUnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAkKCcubmF2aWdhdGlvbi10b29scycpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbn0oKSkiLCJ2YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbWFyZ2luID0ge3RvcDogMzAsIHJpZ2h0OiAyMCwgYm90dG9tOiAzMCwgbGVmdDogMjB9O1xuICB2YXIgd2lkdGggPSBwYXJzZUludChkMy5zZWxlY3QoJy5sYW5ndWFnZS1jaGFydCcpLnN0eWxlKCd3aWR0aCcpLCAxMCk7XG4gIHZhciB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gIHZhciBiYXJIZWlnaHQgPSA0MDtcbiAgdmFyIHNwYWNpbmcgPSAzO1xuICB2YXIgaGVpZ2h0O1xuXG4gIC8vIHNjYWxlcyBhbmQgYXhlc1xuICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAucmFuZ2UoWzAsIHdpZHRoXSlcbiAgICAgIC5kb21haW4oWzAsIDEwXSk7IC8vIGhhcmQtY29kaW5nIHRoaXMgYmVjYXVzZSBJIGtub3cgdGhlIGRhdGFcblxuICAvLyBvcmRpbmFsIHNjYWxlcyBhcmUgZWFzaWVyIGZvciB1bmlmb3JtIGJhciBoZWlnaHRzXG4gIC8vIEknbGwgc2V0IGRvbWFpbiBhbmQgcmFuZ2VCYW5kcyBhZnRlciBkYXRhIGxvYWRzXG4gIHZhciB5ID0gZDMuc2NhbGUub3JkaW5hbCgpOyBcblxuICB2YXIgY29sb3JTY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuICAgICAgICAgICAgICAgICAgICAuZG9tYWluKFsnTGFuZ3VhZ2UnLCAnTGlicmFyeS9GcmFtZXdvcmsnLCAnU29mdHdhcmUvTWFuYWdlbWVudC9EZXBsb3ltZW50J10pXG4gICAgICAgICAgICAgICAgICAgIC5yYW5nZShbJyMwZjAnLCAnbWFnZW50YScsICdjeWFuJ10pO1xuXG4gIHZhciB4QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgIC5zY2FsZSh4KVxuXG4gIC8vIGNyZWF0ZSB0aGUgY2hhcnRcbiAgdmFyIGNoYXJ0ID0gZDMuc2VsZWN0KCcubGFuZ3VhZ2UtY2hhcnQnKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuc3R5bGUoJ3dpZHRoJywgKHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpICsgJ3B4JylcbiAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBbbWFyZ2luLmxlZnQsIG1hcmdpbi50b3BdICsgJyknKTtcblxuICBkMy5qc29uKCcuLi8uLi9kYXRhL3NraWxscy5qc29uJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgYXBwZW5kQ2hhcnQoZGF0YS5za2lsbHMpXG4gIH0pXG5cbiAgZnVuY3Rpb24gYXBwZW5kQ2hhcnQoZGF0YSkge1xuICAgIC8vIHNldCB5IGRvbWFpblxuICAgIHkuZG9tYWluKGQzLnJhbmdlKGRhdGEubGVuZ3RoKSlcbiAgICAgICAgLnJhbmdlQmFuZHMoWzAsIGRhdGEubGVuZ3RoICogYmFySGVpZ2h0XSk7XG4gICAgXG4gICAgLy8gc2V0IGhlaWdodCBiYXNlZCBvbiBkYXRhXG4gICAgLy8gaGVpZ2h0ID0geS5yYW5nZUV4dGVudCgpWzFdO1xuICAgIGhlaWdodCA9IGRhdGEubGVuZ3RoICogYmFySGVpZ2h0O1xuICAgIGQzLnNlbGVjdChjaGFydC5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCAoaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pICsgJ3B4JylcblxuXG4gICAgLy8gYWRkIHRvcCBhbmQgYm90dG9tIGF4ZXNcbiAgICBjaGFydC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzIHRvcCcpXG4gICAgICAgIC5jYWxsKHhBeGlzLm9yaWVudCgndG9wJykpO1xuICAgIFxuICAgIGNoYXJ0LmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd4IGF4aXMgYm90dG9tJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgaGVpZ2h0ICsgJyknKVxuICAgICAgICAuY2FsbCh4QXhpcy5vcmllbnQoJ2JvdHRvbScpKTtcblxuICAgIHZhciBiYXJzID0gY2hhcnQuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmRhdGEoZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdiYXInKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4gJ3RyYW5zbGF0ZSgwLCcgICsgeShpKSArICcpJzsgfSk7XG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFja2dyb3VuZCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5LnJhbmdlQmFuZCgpKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCk7XG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAncGVyY2VudCcpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5LnJhbmdlQmFuZCgpKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbihkKSB7IFxuICAgICAgICAgIHJldHVybiB4KGQucGVyY2VudCAvIDEwKTsgXG4gICAgICAgIH0pXG4gICAgICAgIC5hdHRyKCdmaWxsJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBjb2xvclNjYWxlKGQuY2F0ZWdvcnkpXG4gICAgICAgIH0pXG4gICAgXG4gICAgYmFycy5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7IHJldHVybiBkLm5hbWU7IH0pXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICduYW1lJylcbiAgICAgICAgLmF0dHIoJ3knLCB5LnJhbmdlQmFuZCgpIC0gMTApXG4gICAgICAgIC5hdHRyKCd4Jywgc3BhY2luZylcbiAgICAgICAgLnN0eWxlKCdjb2xvcicsICd3aGl0ZScpXG5cbiAgICB2YXIgbGVnZW5kID0gY2hhcnQuc2VsZWN0QWxsKFwiLmxlZ2VuZFwiKVxuICAgICAgICAuZGF0YShjb2xvclNjYWxlLmRvbWFpbigpKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRcIilcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICB2YXIgdHJhbnNsYXRlWSA9ICgzMCAqIGkpICsgaGVpZ2h0IC0gMTAwXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKDAsXCIgKyB0cmFuc2xhdGVZICsgXCIpXCI7XG4gICAgICAgIH0pXG4gICAgICAgIC5zdHlsZSgnZGlzcGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtb2JpbGUgPSBkMy5zZWxlY3QoJy5tb2JpbGUtbGVnZW5kJykuc3R5bGUoJ2Rpc3BsYXknKSAhPT0gXCJub25lXCI7XG4gICAgICAgICAgcmV0dXJuIG1vYmlsZSA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xuICAgICAgICB9KVxuXG4gICAgbGVnZW5kLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJ4XCIsIHdpZHRoIC0gMTgpXG4gICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTgpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDE4KVxuICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gY29sb3JTY2FsZShkKTtcbiAgICAgICAgfSk7XG5cbiAgICBsZWdlbmQuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAuYXR0cihcInhcIiwgd2lkdGggLSAyNSlcbiAgICAgICAgLmF0dHIoXCJ5XCIsIDgpXG4gICAgICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kLXRleHQnKVxuICAgICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcImVuZFwiKVxuICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGRcbiAgICAgICAgfSlcblxuICAgIGQzLnNlbGVjdCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemUpOyBcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICAgIC8vIHVwZGF0ZSB3aWR0aFxuICAgICAgdmFyIHVwZGF0ZWRXaWR0aCA9IHBhcnNlSW50KGQzLnNlbGVjdCgnLmxhbmd1YWdlLWNoYXJ0Jykuc3R5bGUoJ3dpZHRoJyksIDEwKTtcbiAgICAgIHVwZGF0ZWRXaWR0aCA9IHVwZGF0ZWRXaWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXG4gICAgICAvLyByZXNpemUgdGhlIGNoYXJ0XG4gICAgICB4LnJhbmdlKFswLCB1cGRhdGVkV2lkdGhdKTtcbiAgICAgIGQzLnNlbGVjdChjaGFydC5ub2RlKCkucGFyZW50Tm9kZSlcbiAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsICh5LnJhbmdlRXh0ZW50KClbMV0gKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSkgKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgnd2lkdGgnLCAodXBkYXRlZFdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpICsgJ3B4Jyk7XG5cbiAgICAgIGNoYXJ0LnNlbGVjdEFsbCgnLmxlZ2VuZCcpXG4gICAgICAgIC5zdHlsZSgnZGlzcGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBtb2JpbGUgPSBkMy5zZWxlY3QoJy5tb2JpbGUtbGVnZW5kJykuc3R5bGUoJ2Rpc3BsYXknKSAhPT0gXCJub25lXCI7XG4gICAgICAgICAgcmV0dXJuIG1vYmlsZSA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgIHZhciB0cmFuc2xhdGVZID0gKDMwICogaSkgKyBoZWlnaHQgLSAxMDBcbiAgICAgICAgICB2YXIgdHJhbnNsYXRlWCA9IHVwZGF0ZWRXaWR0aCAtIHdpZHRoO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRyYW5zbGF0ZVgpXG4gICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdHJhbnNsYXRlWCArIFwiLFwiICsgdHJhbnNsYXRlWSArIFwiKVwiO1xuICAgICAgICB9KVxuXG5cblxuXG4gICAgICBjaGFydC5zZWxlY3RBbGwoJ3JlY3QuYmFja2dyb3VuZCcpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdXBkYXRlZFdpZHRoKTtcblxuICAgICAgY2hhcnQuc2VsZWN0QWxsKCdyZWN0LnBlcmNlbnQnKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgoZC5wZXJjZW50IC8gMTApOyB9KTtcblxuICAgICAgLy8gdXBkYXRlIGF4ZXNcbiAgICAgIGNoYXJ0LnNlbGVjdCgnLnguYXhpcy50b3AnKS5jYWxsKHhBeGlzLm9yaWVudCgndG9wJykpO1xuICAgICAgY2hhcnQuc2VsZWN0KCcueC5heGlzLmJvdHRvbScpLmNhbGwoeEF4aXMub3JpZW50KCdib3R0b20nKSk7XG4gIH1cblxuXG59KCkpOyIsIi8qKlxuICogalF1ZXJ5IGV4dGVuc2lvbiwgYWRkIHN1cHBvcnQgYHNjcm9sbHN0YXJ0YCBhbmQgYHNjcm9sbGVuZGAgZXZlbnRzLlxuICpcbiAqIEBhdXRob3IgIFJ1YmFYYSAgPHRyYXNoQHJ1YmF4YS5vcmc+XG4gKiBAZ2l0aHViICBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9SdWJhWGEvNTU2ODk2NFxuICogQGxpY2Vuc2UgTUlUXG4gKlxuICpcbiAqIEBzZXR0aW5nc1xuICogICAgICAkLnNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5ID0gMzAwOyAvLyBkZWZhdWx0IG1zXG4gKlxuICogQGZsYWdzXG4gKiAgICAgICQuaXNTY3JvbGxlZDsgLy8gYm9vbGVhblxuICpcbiAqIEBiaW5kaW5nXG4gKiAgICAgICQod2luZG93KS5iaW5kKCdzY3JvbGxzdGFydCBzY3JvbGxlbmQnLCBmdW5jdGlvbiAoZXZ0KXtcbiAqICAgICAgICAgIGlmKCBldnQudHlwZSA9PSAnc2Nyb2xsc3RhcnQnICl7XG4gKiAgICAgICAgICAgICAgLy8gbG9naWNcbiAqICAgICAgICAgIH1cbiAqICAgICAgfSk7XG4gKlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoJCl7XG4gICAgdmFyXG4gICAgICAgICAgbnMgICAgICAgID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgICAgICAgLCBzcGVjaWFsICAgPSAkLmV2ZW50LnNwZWNpYWxcbiAgICAgICAgLCBkaXNwYXRjaCAgPSAkLmV2ZW50LmhhbmRsZSB8fCAkLmV2ZW50LmRpc3BhdGNoXG4gXG4gICAgICAgICwgc2Nyb2xsICAgICAgICA9ICdzY3JvbGwnXG4gICAgICAgICwgc2Nyb2xsU3RhcnQgICA9IHNjcm9sbCArICdzdGFydCdcbiAgICAgICAgLCBzY3JvbGxFbmQgICAgID0gc2Nyb2xsICsgJ2VuZCdcbiAgICAgICAgLCBuc1Njcm9sbFN0YXJ0ID0gc2Nyb2xsICsnLicrIHNjcm9sbFN0YXJ0ICsgbnNcbiAgICAgICAgLCBuc1Njcm9sbEVuZCAgID0gc2Nyb2xsICsnLicrIHNjcm9sbEVuZCArIG5zXG4gICAgO1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsc3RhcnQgPSB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHZhciBwaWQsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0LyoqJC5FdmVudCovKXtcbiAgICAgICAgICAgICAgICBpZiggcGlkID09IG51bGwgKXtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnR5cGUgPSBzY3JvbGxTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHBpZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbFN0YXJ0LCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiBcbiAgICAgICAgdGVhcmRvd246IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh0aGlzKS51bmJpbmQobnNTY3JvbGxTdGFydCk7XG4gICAgICAgIH1cbiAgICB9O1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsZW5kID0ge1xuICAgICAgICBkZWxheTogMzAwLFxuIFxuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgcGlkLCBoYW5kbGVyID0gZnVuY3Rpb24gKGV2dC8qKiQuRXZlbnQqLyl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiBcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGV2dC50eXBlID0gc2Nyb2xsRW5kO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaC5hcHBseShfdGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbEVuZCwgaGFuZGxlcik7XG4gXG4gICAgICAgIH0sXG4gXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQodGhpcykudW5iaW5kKG5zU2Nyb2xsRW5kKTtcbiAgICAgICAgfVxuICAgIH07XG4gXG4gXG4gICAgJC5pc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgJCh3aW5kb3cpLmJpbmQoc2Nyb2xsU3RhcnQrJyAnK3Njcm9sbEVuZCwgZnVuY3Rpb24gKGV2dC8qKkV2ZW50Ki8pe1xuICAgICAgICAkLmlzU2Nyb2xsZWQgPSAoZXZ0LnR5cGUgPT0gc2Nyb2xsU3RhcnQpO1xuICAgICAgICAkKCdib2R5JylbJC5pc1Njcm9sbGVkID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdpcy1zY3JvbGxlZCcpO1xuICAgIH0pO1xufSkoalF1ZXJ5KTsiXX0=
