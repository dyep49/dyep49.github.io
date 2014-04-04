$(document).ready(function() {
	$('#responsive-menu-button').sidr({
		source: '#navigation'
	});

	$('#project-slider').owlCarousel({
		singleItem: true,
		navigation: true,
		navigationText: ["<button class='carousel-nav'>prev</button>", "<button class='carousel-nav'>next</button>"]
	});
});