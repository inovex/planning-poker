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
					socket.send('get-initial-data');
				}

				socket.onmessage = function(event) {
					var data;
					data = JSON.parse(event.data);

					switch(data.type) {
						case 'userlist':
							me.handleUserList(data.data)
							break;
					}
				}
			};

			this.handleUserList = function(users)  {
				var userArray;

				userArray = [];
				for (userId in users) {
					var span,
						user;

					user = users[userId];
					userArray.push('<span class="poker-role-' + user.role + '">' + user.name + '</span>');
				}
				$(this.elements.userlist).html(userArray.join(', '));
			};

			return this;
		}
	});
})(jQuery);