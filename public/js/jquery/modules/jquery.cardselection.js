(function($, jQuery) {
	jQuery.fn.cardselection = function(options) {
		options = jQuery.extend({}, jQuery.fn.cardselection.options, options);

		this.on('click', function(event) {
			var socket,
				cardValue,
				user,
				selectedCard,
				pokerCardsBack;

			// Ignore request if the poker cards are not already shown
			pokerCardsBack = $(options.pokerCardBackClass); 
			if (pokerCardsBack.length > 0 && !pokerCardsBack.is(':visible')) {
				return;
			}

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
		lsUserKey: 'user',
		selectedClass: null,
		pokerCardBackClass: null
	};
})(jQuery, jQuery);