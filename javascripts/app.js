$(document).ready(function() {
	$('#responsive-menu-button').sidr({
		source: '#navigation'
	});

	$('#project-slider').owlCarousel({
		singleItem: true,
		navigation: true
	});
});