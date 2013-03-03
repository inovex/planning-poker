(function(jQuery, $) {
	jQuery.fn.login = function(options) {
		options = jQuery.extend({}, jQuery.fn.login.options, options);
		var user;

		user = localStorage.getItem(options.lsUserKey);
		if (user !== null) {
			user = JSON.parse(user);
			$.ajax({
				url: '/login',
				method: 'POST',
				data: user,
				success: function(data) {
					jQuery.fn.login.updateUserInfo(user, options);
					jQuery.fn.login.openWebSocket(options);
					$(options.overlay).hide(400);
				}
			});
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
		var options;

		// Prevent default and disable login button
		event.preventDefault();
		$(event.data.form).find('.poker-login-submit').attr('disabled', 'disabled');

		options = event.data.options;

		$.ajax({
			url: '/login',
			method: 'POST',
			data: $(event.data.form).serialize(),
			success: function(data) {
				localStorage.setItem(options.lsUserKey, JSON.stringify(data));
				jQuery.fn.login.updateUserInfo(data, options);
				jQuery.fn.login.openWebSocket(options);
				$(options.overlay).hide(400);	
			},
			fail: function(data) {
				$(event.data.form).find('.poker-login-submit').removeAttr('disabled');	
			}
		});
	};

	jQuery.fn.login.updateUserInfo = function(user, options) {
		$(options.nameClass).html(user.name);
		$(options.roleClass).html(options.availableRoles[user.role]);
		$(options.userInfoClass).show();
	};

	jQuery.fn.login.openWebSocket = function(options) {
		window.managedSocket.open();
	}

	jQuery.fn.login.options = {
		availableRoles: {
			dev: 'Entwickler',
			po: 'Product Owner',
			sm: 'Scrum Master'
		},
		overlay: null,
		lsUserKey: 'user',
		nameClass: null,
		roleClass: null
	};
})(jQuery, jQuery);