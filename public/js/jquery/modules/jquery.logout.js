(function($, jQuery) {
	jQuery.fn.logout = function(options) {
		this.each(function(key, item) {
			$(item).on('click', function() {
				localStorage.clear();
				window.managedSocket.close();
				window.location.reload();
			})
		});
	};
})(jQuery, jQuery);