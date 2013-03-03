(function($, jQuery) {
	jQuery.fn.cardselection = function(options) {
		options = jQuery.extend({}, jQuery.fn.cardselection.options, options);

		this.on('click', function(event) {
			var socket,
				cardValue,
				user,
				selectedCard;

			socket = window.managedSocket;
			selectedCard = $(event.target);
			cardValue = selectedCard.html();
			user = JSON.parse(localStorage.getItem(options.lsUserKey));

			socketData = {
				type: 'play-card',
				userId: user.id,
				cardValue: cardValue
			};

			socket.send(JSON.stringify(socketData));
			$('.' + options.selectedClass).removeClass(options.selectedClass);
			selectedCard.addClass(options.selectedClass);
		})
	};

	jQuery.fn.cardselection.options = {
		lsUserKey: 'user'
	};
})(jQuery, jQuery);