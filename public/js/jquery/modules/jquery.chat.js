(function($, jQuery) {
	jQuery.fn.chat = function(options) {
		var me;

		options = jQuery.extend({}, jQuery.fn.chat.options, options);
		me = $(this);

		jQuery.fn.chat.registerTrayActions(me, options);
		jQuery.fn.chat.registerChat(me, options);

		return {
			onmessage: function(data) {
				jQuery.fn.chat.receiveChatMessage(me, options, data);
			}
		}
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
			newMessageText;
		container = me.find('.' + options.container);
		newMessageForm = container.find('form');
		newMessageText = newMessageForm.find('input');

		newMessageForm.on('submit', function(event) {
			var newMessage;
			event.preventDefault();

			newMessage = {
				type: 'post-chat-message',
				text: newMessageText.val()
			};
			window.managedSocket.send(JSON.stringify(newMessage));
		});
	};

	jQuery.fn.chat.receiveChatMessage = function(me, options, message) {
		var newMessage;

		newMessage = $(
			'<p>' + 
				'<span class="poker-role-' + message.user.role + '">' + message.user.name + ':</span> ' +
				'<span>' + message.text + '</span>' +
			'</p>'
		);
		me.find('.' + options.messages).append(newMessage);
		me.find('.' + options.container).find('input').val("");
	};

	jQuery.fn.chat.options = {
		container: 'poker-chat-messages-container',
		tray: 'poker-chat-tray',
		traySelected: 'poker-chat-tray-selected',
		messages: 'poker-chat-messages'
	};
})(jQuery, jQuery);