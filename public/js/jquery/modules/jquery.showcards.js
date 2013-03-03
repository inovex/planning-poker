(function($, jQuery) {
	jQuery.fn.showcards = function(options) {
		var me;
		options = jQuery.extend({}, jQuery.fn.showcards.options, options);

		me = this
		$(this).on('click', function(event) {
			$('.' + options.selectorClass).removeClass(options.toggleClass);
			$(me).attr('disabled', 'disabled');
		});
	};	

	jQuery.fn.showcards.options = {
		selectorClass: null,
		toggleClass: null
	};
})(jQuery, jQuery);