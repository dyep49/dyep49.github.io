(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// require('./vendor/scroll.js');
require('./header.js');
},{"./header.js":2}],2:[function(require,module,exports){
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
}())
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./vendor/scroll.js":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy92ZW5kb3Ivc2Nyb2xsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHJlcXVpcmUoJy4vdmVuZG9yL3Njcm9sbC5qcycpO1xucmVxdWlyZSgnLi9oZWFkZXIuanMnKTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyB2YXIgc3R1ZmYgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuJCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuJCA6IG51bGwpO1xucmVxdWlyZSgnLi92ZW5kb3Ivc2Nyb2xsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY3JvbGxJbnRlcnZhbDtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICBcbiAgICAgIHNjcm9sbEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB1cGRhdGVkVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICB2YXIgaGlkZUhlYWRlciA9IHVwZGF0ZWRUb3AgPiA2MCAmJiB1cGRhdGVkVG9wID49IHRvcDtcbiAgICAgICAgaGlkZUhlYWRlciA/ICQoJ2hlYWRlcicpLmNzcygndG9wJywgJy02MHB4JykgOiAkKCdoZWFkZXInKS5jc3MoJ3RvcCcsICcwcHgnKTtcbiAgICAgICAgdG9wID0gdXBkYXRlZFRvcDtcbiAgICAgIH0sIDI1MClcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhckludGVydmFsKHNjcm9sbEludGVydmFsKTtcbiAgICB9KTtcbiAgfSlcbn0oKSlcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIi8qKlxuICogalF1ZXJ5IGV4dGVuc2lvbiwgYWRkIHN1cHBvcnQgYHNjcm9sbHN0YXJ0YCBhbmQgYHNjcm9sbGVuZGAgZXZlbnRzLlxuICpcbiAqIEBhdXRob3IgIFJ1YmFYYSAgPHRyYXNoQHJ1YmF4YS5vcmc+XG4gKiBAZ2l0aHViICBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9SdWJhWGEvNTU2ODk2NFxuICogQGxpY2Vuc2UgTUlUXG4gKlxuICpcbiAqIEBzZXR0aW5nc1xuICogICAgICAkLnNwZWNpYWwuc2Nyb2xsZW5kLmRlbGF5ID0gMzAwOyAvLyBkZWZhdWx0IG1zXG4gKlxuICogQGZsYWdzXG4gKiAgICAgICQuaXNTY3JvbGxlZDsgLy8gYm9vbGVhblxuICpcbiAqIEBiaW5kaW5nXG4gKiAgICAgICQod2luZG93KS5iaW5kKCdzY3JvbGxzdGFydCBzY3JvbGxlbmQnLCBmdW5jdGlvbiAoZXZ0KXtcbiAqICAgICAgICAgIGlmKCBldnQudHlwZSA9PSAnc2Nyb2xsc3RhcnQnICl7XG4gKiAgICAgICAgICAgICAgLy8gbG9naWNcbiAqICAgICAgICAgIH1cbiAqICAgICAgfSk7XG4gKlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoJCl7XG4gICAgdmFyXG4gICAgICAgICAgbnMgICAgICAgID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgICAgICAgLCBzcGVjaWFsICAgPSAkLmV2ZW50LnNwZWNpYWxcbiAgICAgICAgLCBkaXNwYXRjaCAgPSAkLmV2ZW50LmhhbmRsZSB8fCAkLmV2ZW50LmRpc3BhdGNoXG4gXG4gICAgICAgICwgc2Nyb2xsICAgICAgICA9ICdzY3JvbGwnXG4gICAgICAgICwgc2Nyb2xsU3RhcnQgICA9IHNjcm9sbCArICdzdGFydCdcbiAgICAgICAgLCBzY3JvbGxFbmQgICAgID0gc2Nyb2xsICsgJ2VuZCdcbiAgICAgICAgLCBuc1Njcm9sbFN0YXJ0ID0gc2Nyb2xsICsnLicrIHNjcm9sbFN0YXJ0ICsgbnNcbiAgICAgICAgLCBuc1Njcm9sbEVuZCAgID0gc2Nyb2xsICsnLicrIHNjcm9sbEVuZCArIG5zXG4gICAgO1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsc3RhcnQgPSB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHZhciBwaWQsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0LyoqJC5FdmVudCovKXtcbiAgICAgICAgICAgICAgICBpZiggcGlkID09IG51bGwgKXtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnR5cGUgPSBzY3JvbGxTdGFydDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHBpZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbFN0YXJ0LCBoYW5kbGVyKTtcbiAgICAgICAgfSxcbiBcbiAgICAgICAgdGVhcmRvd246IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh0aGlzKS51bmJpbmQobnNTY3JvbGxTdGFydCk7XG4gICAgICAgIH1cbiAgICB9O1xuIFxuICAgIHNwZWNpYWwuc2Nyb2xsZW5kID0ge1xuICAgICAgICBkZWxheTogMzAwLFxuIFxuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgcGlkLCBoYW5kbGVyID0gZnVuY3Rpb24gKGV2dC8qKiQuRXZlbnQqLyl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiBcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocGlkKTtcbiAgICAgICAgICAgICAgICBwaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGV2dC50eXBlID0gc2Nyb2xsRW5kO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaC5hcHBseShfdGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfSwgc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkpO1xuIFxuICAgICAgICAgICAgfTtcbiBcbiAgICAgICAgICAgICQodGhpcykuYmluZChuc1Njcm9sbEVuZCwgaGFuZGxlcik7XG4gXG4gICAgICAgIH0sXG4gXG4gICAgICAgIHRlYXJkb3duOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICQodGhpcykudW5iaW5kKG5zU2Nyb2xsRW5kKTtcbiAgICAgICAgfVxuICAgIH07XG4gXG4gXG4gICAgJC5pc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgJCh3aW5kb3cpLmJpbmQoc2Nyb2xsU3RhcnQrJyAnK3Njcm9sbEVuZCwgZnVuY3Rpb24gKGV2dC8qKkV2ZW50Ki8pe1xuICAgICAgICAkLmlzU2Nyb2xsZWQgPSAoZXZ0LnR5cGUgPT0gc2Nyb2xsU3RhcnQpO1xuICAgICAgICAkKCdib2R5JylbJC5pc1Njcm9sbGVkID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdpcy1zY3JvbGxlZCcpO1xuICAgIH0pO1xufSkoalF1ZXJ5KTsiXX0=
