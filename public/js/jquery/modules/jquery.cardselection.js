(function($, jQuery) {
	jQuery.fn.cardselection = function(options) {
		options = jQuery.extend({}, jQuery.fn.cardselection.options, options);

		this.on('click', function(event) {
			var socket,
				cardValue,
				user;

			socket = window.managedSocket;
			cardValue = $(event.target).html();
			user = JSON.parse(localStorage.getItem(options.lsUserKey));

			socketData = {
				type: 'play-card',
				userId: user.id,
				cardValue: cardValue
			};

			socket.send(JSON.stringify(socketData));
		})
	};

	jQuery.fn.cardselection.options = {
		lsUserKey: 'user'
	};
})(jQuery, jQuery);