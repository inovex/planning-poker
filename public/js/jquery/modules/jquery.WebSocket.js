(function($){

    // attach to jQuery
    $.extend({
        // export WebSocket = $.WebSocket
        WebSocket: function(socketOptions, elements) {
			var socket;

			this.socketOptions = socketOptions;
			this.elements = elements;

			this.open = function() {
				var me;

				window.managedSocket = new WebSocket('ws://' + this.socketOptions.address + ':' + this.socketOptions.port);
				socket = window.managedSocket;
				me = this;

				socket.onopen = function(event) {
					var socketData = {
						type: 'get-initial-data'
					};
					socket.send(JSON.stringify(socketData));
				}

				socket.onmessage = function(event) {
					var data;
					data = JSON.parse(event.data);

					switch(data.type) {
						case 'userlist':
							me.handleUserList(data.data)
							break;

						case 'carddisplay':
							me.handleCardDisplay(data.data);
							break;

						case 'show-cards':
							me.handleShowCards();
							break;

						case 'userstory':
							me.handleUserstory(data.userstory);
							break;
					}
				}
			};

			this.handleUserList = function(users)  {
				window.currentUsers = users;
				var userArray;

				userArray = [];
				for (userId in users) {
					var span,
						user;

					user = users[userId];
					userArray.push('<span class="poker-role poker-role-' + user.role + '">' + user.name + '</span>');
				}
				$(this.elements.userlist).html(userArray.join(', '));
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
			this.handleCardDisplay = function(cardsData) {
				var cardsTotal,
					cards,
					cardsHiddenClass;

				cardsTotal = 0;
				cards = cardsData.cards;
				if (cardsData.show === false) {
					cardsHiddenClass = 'poker-card-display-hidden';
				}

				$(this.elements.pokerFelt).empty();
				$(this.elements.pokerCardsShowButton).attr('disabled', 'disabled');
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
						$(this.elements.pokerFelt).append(card);
					}
					card.find('.poker-card-value').html(cards[userId]);
					card.find('.poker-card-player').html(window.currentUsers[userId].name);

					amountDevs = $('.poker-role-developer').length;
					// Schauen, ob alle devs abgestimmt haben
					if (amountDevs > 0 && amountDevs == $('.poker-card-value').length) {
						$(this.elements.pokerCardsShowButton).removeAttr('disabled');
					}
				}
				if (cardsTotal == 0) {
					$('.' + this.elements.pokerCardSelectedClass).removeClass(this.elements.pokerCardSelectedClass);
				};
			}

			this.handleShowCards = function() {
				//showCardsSelectorClass: null,
				//showCardsToggleClass: null
				$('.' + this.elements.showCardsSelectorClass).removeClass(this.elements.showCardsToggleClass);
				$(this.elements.pokerCardsShowButton).attr('disabled', 'disabled');
			}

			this.handleUserstory = function(userstory) {
				userstory = userstory.nl2br();
				$(this.elements.userstoryText).html(userstory);
				$(this.elements.editUserStoryButton).removeAttr('disabled');
				if (userstory.length > 0) {
					$(this.elements.userstory).show(400);
				}
			};

			return this;
		}
	});
})(jQuery);