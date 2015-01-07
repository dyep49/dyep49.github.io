// var stuff = require('jquery');
var $ = require('jquery');
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
    $('.navigation-tools').toggleClass('hide');
    $('.js-navigation-menu').slideToggle(function(){
      if($('.js-navigation-menu').is(':hidden')) {
        $('.js-navigation-menu').removeAttr('style');
      }
    });
  });


  $.mark = {
    jump: function (options) {
      console.log('stuff');
      var defaults = {
        selector: 'a.scroll-on-page-link'
      };
      if (typeof options == 'string') defaults.selector = options;
      var options = $.extend(defaults, options);
      return $(options.selector).click(function (e) {
        var jumpobj = $(this);
        var target = jumpobj.attr('href');
        var thespeed = 1000;
        var offset = $(target).offset().top;
        console.log('test');
        $('html,body').animate({
          scrollTop: offset
        }, thespeed, 'swing')
        e.preventDefault();
      })
    }
  }


  $(function(){  
    $.mark.jump();
  });

}())