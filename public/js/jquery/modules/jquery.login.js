(function(jQuery, $) {
	jQuery.fn.login = function(options) {
		options = jQuery.extend({}, jQuery.fn.login.options, options);
		var user;

		user = localStorage.getItem(options.lsUserKey);
		if (user !== null) {
			$(options.overlay).hide();
		}

		// Klickhandler registrieren
		$(this).each(function(key, item) {
			var eventData;

			eventData = {
				options: options,
				form: item
			};

			$(item).on('submit', eventData, jQuery.fn.login.loginUser);
		});
	};

	jQuery.fn.login.loginUser = function(event) {
		var loadOptions;

		event.preventDefault();
		loadOptions = {
			method: 'POST',
			data: $(event.data.form).serialize(),
		};
		$.ajax('/login', loadOptions).done(function(data) {
			localStorage.setItem(event.data.options.lsUserKey, data);
		});
	};

	jQuery.fn.login.options = {
		overlay: null,
		lsUserKey: 'user'
	};
})(jQuery, jQuery);