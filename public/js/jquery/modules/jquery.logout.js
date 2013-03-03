(function($, jQuery) {
	jQuery.fn.logout = function(options) {
		options = jQuery.extend({}, jQuery.fn.logout.options, options);

		this.each(function(key, item) {
			$(item).on('click', function() {
				var user;

				window.managedSocket.close();

				user = JSON.parse(localStorage.getItem(options.lsUserKey));

				$.ajax({
					async: true,
					url: '/logout',
					method: 'post',
					data: user,
					success: function() {
						localStorage.clear();
						window.location.reload();
					}
				});
			})
		});
	};

	jQuery.fn.logout.options = {
		lsUserKey: 'user'
	};
})(jQuery, jQuery);