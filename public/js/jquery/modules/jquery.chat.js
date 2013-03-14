(function($, jQuery) {
	jQuery.fn.chat = function(options) {
		options = jQuery.extend({}, jQuery.fn.chat.options, options);

		var me;

		me = $(this);
		//console.log($(this).find('.poker-chat-tray')).html();
		$(this).find('.poker-chat-tray').on('click', function(event) {
			me.find('.poker-chat-messages').toggle();
			me.find('.poker-chat-tray').toggleClass('poker-chat-tray-selected');
		});
	};

	jQuery.fn.chat.options = {};
})(jQuery, jQuery);