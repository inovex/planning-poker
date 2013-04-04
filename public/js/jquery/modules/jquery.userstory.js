(function(jQuery, $) {
	jQuery.fn.userstory = function(options) {
		options = jQuery.extend({}, jQuery.fn.userstory.options, options);

		var me,
			listeners;

		me = this;

		listeners = $({});
		listeners.on('userstory', function(event, message) {
			jQuery.fn.userstory.showstory.call(me, message.userstory, options);
		})
		return listeners;
	};

	jQuery.fn.userstory.showstory = function(userstory, options) {
		userstory = userstory.escape();
		userstory = userstory.parselinks();
		userstory = userstory.nl2br();
		$(options.userstoryText).html(userstory);
		$(options.editUserStoryButton).removeAttr('disabled');
		if (userstory.length > 0) {
			$(this).show(400);
		}
	}

	jQuery.fn.userstory.options = {
		userstoryText: null,
		editUserStoryButton: null
	};
})(jQuery, jQuery);