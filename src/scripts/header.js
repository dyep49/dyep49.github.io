// var stuff = require('jquery');
var $ = require('jquery');
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