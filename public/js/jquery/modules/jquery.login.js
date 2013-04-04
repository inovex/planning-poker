(function(jQuery, $) {
	jQuery.fn.login = function(options) {
		options = jQuery.extend({}, jQuery.fn.login.options, options);
		var user,
			me,
			nameField,
			submitButton,
			listeners;

		me = $(this);
		// Klickhandler registrieren
		me.each(function(key, item) {
			var eventData;

			eventData = {
				options: options,
				form: item
			};

			$(item).on('submit', eventData, jQuery.fn.login.loginUserCallback);
		});

		nameField = me.find('input[type="text"]');
		submitButton = me.find('input[type="submit"]');
		// username must be at least 2 chars long
		nameField.on('keyup', function(event) {
			if ($(event.target).val().length >= 2) {
				submitButton.removeAttr('disabled');
			} else {
				submitButton.attr('disabled', 'disabled');
			}
		});

		listeners = $({});

		listeners.on('login', function(event, data) {
			var socketData;
			localStorage.setItem(options.lsUserKey, JSON.stringify(data.user));
			jQuery.fn.login.postLogin(data.user, options);

			socketData = {
				type: 'get-initial-data'
			};
			window.managedSocket.send(JSON.stringify(socketData));
		});

		listeners.on('open', function(event, wsEvent) {
			user = localStorage.getItem(options.lsUserKey);
			if (user !== null) {
				user = JSON.parse(user);
				jQuery.fn.login.loginUser(user, options);
			}
		});

		return listeners;
	};

	jQuery.fn.login.loginUserCallback = function(event) {
		var options,
			formData,
			user;

		// Prevent default
		event.preventDefault();

		// if submit button is disabled: do nothing (can occur when user presses enter but button is disabled)
		submitButton = $(event.data.form).find('.poker-login-submit');
		if (submitButton.attr('disabled') == 'disabled') {
			return;
		}

		options = event.data.options;
		// Disable login button and show user that something is happening
		submitButton.attr('disabled', 'disabled');
		$(event.data.form).find('.poker-login-submit').addClass(options.loaderBackgroundClass)

		user = {};
		formData = $(event.data.form).serializeArray();
		for (var i = 0; i < formData.length; i++) {
			user[formData[i].name] = formData[i].value;
		}

		jQuery.fn.login.loginUser(user, options);
	}

	jQuery.fn.login.loginUser = function(user, options) {
		var loginData;

		loginData = {
			type: 'login',
			user: user
		};

		window.managedSocket.send(JSON.stringify(loginData));
	};

	jQuery.fn.login.postLogin = function(user, options) {
		jQuery.fn.login.preparePageForRole(user.role, options);
		jQuery.fn.login.updateUserInfo(user, options);
		//jQuery.fn.login.openWebSocket();
		$(options.overlay).hide(400);
	};

	jQuery.fn.login.preparePageForRole = function(role, options) {
		for (var i in options.roleSettings[role].hide) {
			$(options.roleSettings[role].hide[i]).hide();
		}

		for (var i in options.roleSettings[role].show) {
			$(options.roleSettings[role].show[i]).show();
		}
	};

	jQuery.fn.login.updateUserInfo = function(user, options) {
		$(options.nameClass).text(user.name);
		$(options.roleClass).html(options.availableRoles[user.role]);
		$(options.roleClass).addClass('poker-role-' + user.role);
		$(options.userInfoClass).show();
	};

	jQuery.fn.login.openWebSocket = function() {
		window.managedSocket.open();
	}

	jQuery.fn.login.options = {
		availableRoles: {},
		loaderBackgroundClass: null,
		roleSettings: {
			developer: {
				show: [],
				hide: []
			},
			scrumMaster: {
				show: [],
				hide: []
			},
			productOwner: {
				show: [],
				hide: []
			},
			spectator: {
				show: [],
				hide: []
			}
		},
		overlay: null,
		lsUserKey: 'user',
		nameClass: null,
		roleClass: null
	};
})(jQuery, jQuery);