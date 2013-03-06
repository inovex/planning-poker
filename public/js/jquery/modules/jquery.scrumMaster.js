(function($, jQuery) {
	jQuery.fn.scrumMaster = function(options) {
		options = jQuery.extend({}, jQuery.fn.scrumMaster.options, options);

		$(options.pokerCardsShowButton).on('click', function(event) {
			var pushData = {
				type: 'show-cards'
			};
			window.managedSocket.send(JSON.stringify(pushData));
		});
	};	

	jQuery.fn.scrumMaster.options = {
		pokerCardsShowButton: null,
		pokerCardsResetButton: null
	};
})(jQuery, jQuery);