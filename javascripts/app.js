$(document).ready(function() {
	$('#responsive-menu-button').sidr({
		name: 'sidr-main',
		source: '#navigation'
	});

  $(window).touchwipe({
    wipeLeft: function() {
      // Close
      $.sidr('close', 'sidr-main');
    },
    wipeRight: function() {
      // Open
      $.sidr('open', 'sidr-main');
    },
    preventDefaultEvents: false
  });

	$('#project-slider').owlCarousel({
		singleItem: true,
		navigation: true,
		navigationText: ["<button class='carousel-nav'>prev</button>", "<button class='carousel-nav'>next</button>"]
	});

	$('a').click(function() {
		$.sidr('close', 'sidr-main')
	})

	$('html').smoothScroll(300);

});
