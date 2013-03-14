(function($, jQuery) {
	jQuery.fn.chat = function(options) {
		options = jQuery.extend({}, jQuery.fn.chat.options, options);

		var me,
			container,
			tray,
			toggleFunction,
			isChatOpen;

		me = $(this);
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

		//console.log($(this).find('.poker-chat-tray')).html();
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
	};

	jQuery.fn.chat.options = {
		container: 'poker-chat-messages-container',
		tray: 'poker-chat-tray',
		traySelected: 'poker-chat-tray-selected'
	};
})(jQuery, jQuery);