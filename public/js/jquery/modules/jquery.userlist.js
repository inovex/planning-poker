(function(jQuery, $) {
	jQuery.fn.userlist = function(options) {
		var me,
			listeners;

		options = jQuery.extend({}, jQuery.fn.userlist.options, options);
		me = $(this);

		listeners = $({});
		listeners.on('userlist', function(event, message) {
			jQuery.fn.userlist.update.call(me, message.data, options);
		});
		return listeners;
	};

	jQuery.fn.userlist.update = function(users, options) {
		var userArray,
			userArraySorted;

		window.currentUsers = users;

		userArray = jQuery.fn.userlist.sort(users, options);
		userArraySorted = [];

		
		// Second: Create HTML Elements in one one-dimensional array that then is already
		// sorted like we want it
		for (var role in options.availableRoles) {
			for (userId in userArray[role]) {
				user = userArray[role][userId];
				userArraySorted.push('<span class="poker-role poker-role-' + user.role + '">' + user.name.escape() + '</span>');
			}
		}
		// Third: Set logged in users
		$(this).html(userArraySorted.join(' '));
	};

	jQuery.fn.userlist.sort = function(users, options) {
		var userArray;

		userArray = [];
		// First: Sort the users by role
		// The sorting order is the one given in availableRoles (see index.html for this definition)
		for (var role in options.availableRoles) {
			userArray[role] = [];
		}
		for (userId in users) {
			var span,
				user;

			user = users[userId];
			userArray[user.role].push(user);
		}
		return userArray;
	};

	jQuery.fn.userlist.options = {
		availableRoles: {}
	};
})(jQuery, jQuery);