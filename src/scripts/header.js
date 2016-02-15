const $ = require('jquery');
import './vendor/scroll.js';

module.exports = (function () {
  $(document).ready(() => {
    let scrollInterval;

    $(window).on('scrollstart', () => {
      let top = $(window).scrollTop();

      scrollInterval = setInterval(() => {
        const updatedTop = $(window).scrollTop();
        const hideHeader = updatedTop > 60 && updatedTop >= top;
        hideHeader ? $('header').css('top', '-60px') : $('header').css('top', '0px');
        top = updatedTop;
      }, 250);
    });

    $(window).on('scrollend', () => {
      clearInterval(scrollInterval);
    });
  });

  $('.js-navigation-menu').removeClass('show');

  $('#js-mobile-menu').on('click', (e) => {
    e.preventDefault();
    $('.navigation-tools').toggleClass('hide');
    $('.js-navigation-menu').slideToggle(() => {
      if ($('.js-navigation-menu').is(':hidden')) {
        $('.js-navigation-menu').removeAttr('style');
      }
    });
  });


  $.mark = {
    jump: options => {
      const defaults = {
        selector: 'a.scroll-on-page-link',
      };
      if (typeof options === 'string') defaults.selector = options;
      const updatedOptions = $.extend(defaults, options);
      return $(updatedOptions.selector).click(e => {
        const jumpobj = $(this);
        const target = jumpobj.attr('href');
        const thespeed = 1000;
        const offset = $(target).offset().top;
        $('html,body').animate({
          scrollTop: offset,
        }, thespeed, 'swing');
        e.preventDefault();
      });
    },
  };


  $(() => {
    $.mark.jump();
  });
}());
