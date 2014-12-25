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

    $(window).on('scrollstart', function() {
      $('body').css('margin-top', '-60px');
    });

    $(window).on('scrollend', function() {
      $('body').css('margin-top', '0px');
    });
  })
  // console.log($);
  
  // $(document).ready(function() {

  //   $(window).scroll(function(e) {

  //     var headlineSlide = $(window).scrollTop() > 20 ? 10 : -20;
  //     $('header').css("margin-top", headlineSlide + "px");

  //     didScroll = true;
  //   });

  //   function hasScrolled() {
  //     var st = $(this).scrollTop();

  //     // Make sure they scroll more than delta
  //     if(Math.abs(lastScrollTop - st) <= delta)
  //       return;

  //     // If they scrolled down and are past the navbar, add class .nav-up.
  //     // This is necessary so you never see what is "behind" the navbar.
  //     if (st > lastScrollTop && st > navbarHeight){
  //       // Scroll Down
  //       $('#header').removeClass('nav-down').addClass('nav-up');
  //     } else {
  //       // Scroll Up
  //       if(st + $(window).height() < $(document).height()) {
  //           $('#header').removeClass('nav-up').addClass('nav-down');
  //       }
  //     }

  //     lastScrollTop = st;
  //   }

  //   });


  // }) 

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9hcHAuanMiLCJzcmMvc2NyaXB0cy9oZWFkZXIuanMiLCJzcmMvc2NyaXB0cy92ZW5kb3Ivc2Nyb2xsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gcmVxdWlyZSgnLi92ZW5kb3Ivc2Nyb2xsLmpzJyk7XG5yZXF1aXJlKCcuL2hlYWRlci5qcycpOyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8vIHZhciBzdHVmZiA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XG5yZXF1aXJlKCcuL3ZlbmRvci9zY3JvbGwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICAkKCdib2R5JykuY3NzKCdtYXJnaW4tdG9wJywgJy02MHB4Jyk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgJCgnYm9keScpLmNzcygnbWFyZ2luLXRvcCcsICcwcHgnKTtcbiAgICB9KTtcbiAgfSlcbiAgLy8gY29uc29sZS5sb2coJCk7XG4gIFxuICAvLyAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuICAvLyAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSkge1xuXG4gIC8vICAgICB2YXIgaGVhZGxpbmVTbGlkZSA9ICQod2luZG93KS5zY3JvbGxUb3AoKSA+IDIwID8gMTAgOiAtMjA7XG4gIC8vICAgICAkKCdoZWFkZXInKS5jc3MoXCJtYXJnaW4tdG9wXCIsIGhlYWRsaW5lU2xpZGUgKyBcInB4XCIpO1xuXG4gIC8vICAgICBkaWRTY3JvbGwgPSB0cnVlO1xuICAvLyAgIH0pO1xuXG4gIC8vICAgZnVuY3Rpb24gaGFzU2Nyb2xsZWQoKSB7XG4gIC8vICAgICB2YXIgc3QgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuXG4gIC8vICAgICAvLyBNYWtlIHN1cmUgdGhleSBzY3JvbGwgbW9yZSB0aGFuIGRlbHRhXG4gIC8vICAgICBpZihNYXRoLmFicyhsYXN0U2Nyb2xsVG9wIC0gc3QpIDw9IGRlbHRhKVxuICAvLyAgICAgICByZXR1cm47XG5cbiAgLy8gICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIC5uYXYtdXAuXG4gIC8vICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAvLyAgICAgaWYgKHN0ID4gbGFzdFNjcm9sbFRvcCAmJiBzdCA+IG5hdmJhckhlaWdodCl7XG4gIC8vICAgICAgIC8vIFNjcm9sbCBEb3duXG4gIC8vICAgICAgICQoJyNoZWFkZXInKS5yZW1vdmVDbGFzcygnbmF2LWRvd24nKS5hZGRDbGFzcygnbmF2LXVwJyk7XG4gIC8vICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAvLyBTY3JvbGwgVXBcbiAgLy8gICAgICAgaWYoc3QgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPCAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAvLyAgICAgICAgICAgJCgnI2hlYWRlcicpLnJlbW92ZUNsYXNzKCduYXYtdXAnKS5hZGRDbGFzcygnbmF2LWRvd24nKTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuXG4gIC8vICAgICBsYXN0U2Nyb2xsVG9wID0gc3Q7XG4gIC8vICAgfVxuXG4gIC8vICAgfSk7XG5cblxuICAvLyB9KSBcblxufSgpKVxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLyoqXG4gKiBqUXVlcnkgZXh0ZW5zaW9uLCBhZGQgc3VwcG9ydCBgc2Nyb2xsc3RhcnRgIGFuZCBgc2Nyb2xsZW5kYCBldmVudHMuXG4gKlxuICogQGF1dGhvciAgUnViYVhhICA8dHJhc2hAcnViYXhhLm9yZz5cbiAqIEBnaXRodWIgIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1J1YmFYYS81NTY4OTY0XG4gKiBAbGljZW5zZSBNSVRcbiAqXG4gKlxuICogQHNldHRpbmdzXG4gKiAgICAgICQuc3BlY2lhbC5zY3JvbGxlbmQuZGVsYXkgPSAzMDA7IC8vIGRlZmF1bHQgbXNcbiAqXG4gKiBAZmxhZ3NcbiAqICAgICAgJC5pc1Njcm9sbGVkOyAvLyBib29sZWFuXG4gKlxuICogQGJpbmRpbmdcbiAqICAgICAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbHN0YXJ0IHNjcm9sbGVuZCcsIGZ1bmN0aW9uIChldnQpe1xuICogICAgICAgICAgaWYoIGV2dC50eXBlID09ICdzY3JvbGxzdGFydCcgKXtcbiAqICAgICAgICAgICAgICAvLyBsb2dpY1xuICogICAgICAgICAgfVxuICogICAgICB9KTtcbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgkKXtcbiAgICB2YXJcbiAgICAgICAgICBucyAgICAgICAgPSAobmV3IERhdGUpLmdldFRpbWUoKVxuICAgICAgICAsIHNwZWNpYWwgICA9ICQuZXZlbnQuc3BlY2lhbFxuICAgICAgICAsIGRpc3BhdGNoICA9ICQuZXZlbnQuaGFuZGxlIHx8ICQuZXZlbnQuZGlzcGF0Y2hcbiBcbiAgICAgICAgLCBzY3JvbGwgICAgICAgID0gJ3Njcm9sbCdcbiAgICAgICAgLCBzY3JvbGxTdGFydCAgID0gc2Nyb2xsICsgJ3N0YXJ0J1xuICAgICAgICAsIHNjcm9sbEVuZCAgICAgPSBzY3JvbGwgKyAnZW5kJ1xuICAgICAgICAsIG5zU2Nyb2xsU3RhcnQgPSBzY3JvbGwgKycuJysgc2Nyb2xsU3RhcnQgKyBuc1xuICAgICAgICAsIG5zU2Nyb2xsRW5kICAgPSBzY3JvbGwgKycuJysgc2Nyb2xsRW5kICsgbnNcbiAgICA7XG4gXG4gICAgc3BlY2lhbC5zY3JvbGxzdGFydCA9IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdmFyIHBpZCwgaGFuZGxlciA9IGZ1bmN0aW9uIChldnQvKiokLkV2ZW50Ki8pe1xuICAgICAgICAgICAgICAgIGlmKCBwaWQgPT0gbnVsbCApe1xuICAgICAgICAgICAgICAgICAgICBldnQudHlwZSA9IHNjcm9sbFN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHBpZCk7XG4gICAgICAgICAgICAgICAgfVxuIFxuICAgICAgICAgICAgICAgIHBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcGlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LCBzcGVjaWFsLnNjcm9sbGVuZC5kZWxheSk7XG4gXG4gICAgICAgICAgICB9O1xuIFxuICAgICAgICAgICAgJCh0aGlzKS5iaW5kKG5zU2Nyb2xsU3RhcnQsIGhhbmRsZXIpO1xuICAgICAgICB9LFxuIFxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAkKHRoaXMpLnVuYmluZChuc1Njcm9sbFN0YXJ0KTtcbiAgICAgICAgfVxuICAgIH07XG4gXG4gICAgc3BlY2lhbC5zY3JvbGxlbmQgPSB7XG4gICAgICAgIGRlbGF5OiAzMDAsXG4gXG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHZhciBwaWQsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0LyoqJC5FdmVudCovKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuIFxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChwaWQpO1xuICAgICAgICAgICAgICAgIHBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnR5cGUgPSBzY3JvbGxFbmQ7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoLmFwcGx5KF90aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9LCBzcGVjaWFsLnNjcm9sbGVuZC5kZWxheSk7XG4gXG4gICAgICAgICAgICB9O1xuIFxuICAgICAgICAgICAgJCh0aGlzKS5iaW5kKG5zU2Nyb2xsRW5kLCBoYW5kbGVyKTtcbiBcbiAgICAgICAgfSxcbiBcbiAgICAgICAgdGVhcmRvd246IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgJCh0aGlzKS51bmJpbmQobnNTY3JvbGxFbmQpO1xuICAgICAgICB9XG4gICAgfTtcbiBcbiBcbiAgICAkLmlzU2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAkKHdpbmRvdykuYmluZChzY3JvbGxTdGFydCsnICcrc2Nyb2xsRW5kLCBmdW5jdGlvbiAoZXZ0LyoqRXZlbnQqLyl7XG4gICAgICAgICQuaXNTY3JvbGxlZCA9IChldnQudHlwZSA9PSBzY3JvbGxTdGFydCk7XG4gICAgICAgICQoJ2JvZHknKVskLmlzU2Nyb2xsZWQgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oJ2lzLXNjcm9sbGVkJyk7XG4gICAgfSk7XG59KShqUXVlcnkpOyJdfQ==
