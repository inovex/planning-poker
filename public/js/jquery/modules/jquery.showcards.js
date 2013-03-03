(function($, jQuery) {
	jQuery.fn.showcards = function(options) {
		options = jQuery.extend({}, jQuery.fn.showcards.options, options);

		$(this).on('click', function(event) {
			var pushData = {
				type: 'show-cards'
			};
			window.managedSocket.send(JSON.stringify(pushData));
		});
	};	

	jQuery.fn.showcards.options = {
		
	};
})(jQuery, jQuery);