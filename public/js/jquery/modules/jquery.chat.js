(function($, jQuery) {
	jQuery.fn.chat = function(options) {
		var me,
			listeners;

		options = jQuery.extend({}, jQuery.fn.chat.options, options);
		me = $(this);

		jQuery.fn.chat.registerTrayActions(me, options);
		jQuery.fn.chat.registerChat(me, options);

		listeners = $({});

		listeners.on('new-chat-message', function(event, data) {
			jQuery.fn.chat.receiveChatMessage(me, options, data);
		});

		return listeners;
	};

	jQuery.fn.chat.registerTrayActions = function(me, options) {
		var container,
			tray,
			toggleFunction,
			isChatOpen;

		tray = me.find('.' + options.tray);
		container = me.find('.' + options.container);

		toggleFunction = function(event) {
			container.toggle();
			tray.toggleClass(options.traySelected);
			if (container.is(':visible')) {
				me.find('input').focus();

				$('.' + options.tray).find('span').removeClass(options.newMessage);
				$('.' + options.newMessage).hide();
				$('.' + options.noNewMessage).show();
			}
		};

		isChatOpen = function(target) {
			return container.is(':visible') &&
				!target.hasClass(options.container) &&
				!target.parents().hasClass(options.container) &&
				!target.hasClass(options.tray) &&
				!target.parents().hasClass(options.tray);
		};

		tray.on('click', toggleFunction);

		$(document).on('click', function(event) {
			var target;

			target = $(event.target);
			if (isChatOpen(target)) {
				toggleFunction(event);
			}
		});

		$(document).on('keydown', function(event) {
			if (event.keyCode == 27 && container.is(':visible')) {
				toggleFunction(event);
			}
		});
	}

	jQuery.fn.chat.registerChat = function(me, options) {
		var container,
			newMessageForm,
			newMessageText,
			postNewMessage;

		container = me.find('.' + options.container);
		newMessageForm = container.find('form');
		newMessageText = newMessageForm.find('input');

		postNewMessage = function(event) {
			var newMessage,
				messageText;
			event.preventDefault();

			messageText = newMessageText.val();
			// Don't allow empty messages
			// Also don't allow messages that only consist of spaces
			if (messageText.replace(/ /g, "").length > 0) {
				newMessage = {
					type: 'post-chat-message',
					text: messageText
				};
				window.managedSocket.send(JSON.stringify(newMessage));
			}
		};

		newMessageForm.on('submit', postNewMessage);
		newMessageForm.find('img').on('click', postNewMessage);
	};

	jQuery.fn.chat.receiveChatMessage = function(me, options, message) {
		var newMessage,
			container,
			messageText;

		messageText = message.text.escape();
		messageText = messageText.parselinks();
		newMessage = $(
			'<p>' + 
				'<span class="poker-role-' + message.user.role + '">' + message.user.name.escape() + ':</span> ' +
				'<span>' + messageText + '</span>' +
			'</p>'
		);
		me.find('.' + options.messages).append(newMessage);
		me.find('.' + options.container).find('input').val("");
		// Doesn't work with this as needed. Need to find another way
		// $('html, body').stop().animate({ scrollTop: newMessage.offset().top }, 10);

		// If chat window is not open, show that there are new chat messages
		container = me.find('.' + options.container);
		if (!container.is(':visible')) {
			$('.' + options.tray).find('span').addClass(options.newMessage);
			$('.' + options.newMessage).show();
			$('.' + options.noNewMessage).hide();
		};
	};

	jQuery.fn.chat.options = {
		container: 'poker-chat-messages-container',
		tray: 'poker-chat-tray',
		traySelected: 'poker-chat-tray-selected',
		messages: 'poker-chat-messages',
		newMessage: 'poker-chat-new',
		noNewMessage: 'poker-chat-nonew'
	};
})(jQuery, jQuery);