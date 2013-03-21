(function(jQuery, $) {
	$.extend({
		escape: function(html) {
			console.log(html);
			return String(html)
				.replace(/&(?!\w+;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');
		}
	});
})(jQuery, jQuery)