(function(jQuery, $) {
	jQuery.fn.carddisplay = function(options) {
		var me,
			listeners;

		options = jQuery.extend({}, jQuery.fn.carddisplay.options, options);
		me = this;

		listeners = $({});
		listeners.on('carddisplay', function(event, message) {
			jQuery.fn.carddisplay.showcards.call(me, message.data, options);
		});
		return listeners;
	};

	/**
		<div class="poker-card-display poker-card-display-hidden">
			<a class="poker-card">8</a>
			<a class="poker-card poker-card-back">
				<img src="img/inovex-logo.png" alt="" />
			</a>
			<span class="poker-card-player">Khalid</a>
		</div>
	*/
	jQuery.fn.carddisplay.showcards = function(cardsData, options) {
		var cardsTotal,
			cards,
			cardsHiddenClass;

		cardsTotal = 0;
		cards = cardsData.cards;
		if (cardsData.show === false) {
			cardsHiddenClass = 'poker-card-display-hidden';
		}

		$(this).empty();
		$(options.pokerCardsShowButton).attr('disabled', 'disabled');
		for (var userId in cards) {
			var card,
				pokerCardId,
				amountDevs;

			cardsTotal++;

			pokerCardId = 'poker-card-' + userId;
			card = $('#' + pokerCardId);

			if (!card.is('div')) {
				card = $('<div id="' + pokerCardId + '" class="poker-card-display ' + cardsHiddenClass + '">' +
					'<a class="poker-card poker-card-value">#</a>' +
					'<a class="poker-card poker-card-back">' +
						'<img src="img/inovex-logo.png" alt="" />' +
					'</a>' +
					'<span class="poker-card-player">#</a>' +
				'</div>');
				$(this).append(card);
			}
			card.find('.poker-card-value').html(cards[userId]);
			card.find('.poker-card-player').text(window.currentUsers[userId].name);

			amountDevs = $('.poker-role-developer').length;
			// Schauen, ob mind. 2 devs abgestimmt haben
			if (amountDevs > 0 && $('.poker-card-value').length > 1) {
				$(options.pokerCardsShowButton).removeAttr('disabled');
			}
		}
		if (cardsTotal == 0) {
			$('.' + options.pokerCardSelectedClass).removeClass(options.pokerCardSelectedClass);
		};
	}

	jQuery.fn.carddisplay.options = {
		pokerCardsShowButton: null,
		pokerCardSelectedClass: null
	};
})(jQuery, jQuery);