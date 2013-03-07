(function(jQuery, $) {
	jQuery.fn.login = function(options) {
		options = jQuery.extend({}, jQuery.fn.login.options, options);
		var user;

		// Klickhandler registrieren
		$(this).each(function(key, item) {
			var eventData;

			eventData = {
				options: options,
				form: item
			};

			$(item).on('submit', eventData, jQuery.fn.login.loginUserCallback);
		});

		return {
			onopen: function(event) {
				user = localStorage.getItem(options.lsUserKey);
				if (user !== null) {
					user = JSON.parse(user);
					jQuery.fn.login.loginUser(user, options);
				}
			},
			onmessage: function(data) {
				var socketData;
				localStorage.setItem(options.lsUserKey, JSON.stringify(data.user));
				jQuery.fn.login.postLogin(data.user, options);

				socketData = {
					type: 'get-initial-data'
				};
				window.managedSocket.send(JSON.stringify(socketData));
			}
		};
	};

	jQuery.fn.login.loginUserCallback = function(event) {
		var options,
			formData,
			user;

		options = event.data.options;
		// Prevent default and disable login button
		event.preventDefault();
		$(event.data.form).find('.poker-login-submit').attr('disabled', 'disabled');
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
		$(options.nameClass).html(user.name);
		$(options.roleClass).html(options.availableRoles[user.role]);
		$(options.roleClass).addClass('poker-role-' + user.role);
		$(options.userInfoClass).show();
	};

	jQuery.fn.login.openWebSocket = function() {
		window.managedSocket.open();
	}

	jQuery.fn.login.options = {
		availableRoles: {
			developer: 'Entwickler',
			productOwner: 'Product Owner',
			scrumMaster: 'Scrum Master'
		},
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
			}
		},
		overlay: null,
		lsUserKey: 'user',
		nameClass: null,
		roleClass: null
	};
})(jQuery, jQuery);