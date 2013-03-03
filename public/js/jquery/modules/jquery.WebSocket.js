(function($, jQuery) {
	jQuery.fn.WebSocket = function(options) {
		var socket;

		window.managedSocket = new WebSocket('ws://' + options.adress + ':' + options.port);
		socket = window.managedSocket;

		socket.onmessage = function(event) {
			console.log(event.data);
		}
	};
})(jQuery, jQuery);