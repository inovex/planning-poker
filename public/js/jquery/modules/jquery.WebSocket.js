(function($){

    // attach to jQuery
    $.extend({
        // export WebSocket = $.WebSocket
        WebSocket: function(options) {
			var socket,
				me;

			me = this;
			this.options = options;
			// Option keys which will be set as class properties in setOptions
			this.optionsAsProperty = ['elements', 'listeners'];
			// Websocket messages / listeners which are allowed when user is not logged in
			this.allowedListenersWhenLoggedOut = ['open', 'login'];
			// number of reconnects tried
			this.reconnectsTried = 0;

			this.setOptions = function(options) {
				for (var key in options) {
					if (this.optionsAsProperty.indexOf(key) != -1) {
						this[key] = options[key];
					}
				}
			};

			this.reconnectionCallback = function() {
				me.reconnectsTried++;
				notification = $(me.elements.notification);
				if (me.checkMaxReconnects()) {
					if (window.managedSocket.readyState == window.managedSocket.CLOSED || window.managedSocket.readyState == window.managedSocket.CONNECTING) {
						me.connect();
						// Try to reconnect every 3 seconds
						window.setTimeout(me.reconnectionCallback, 3000);
					} else {
						notification.hide(400);
					}
				} else {
					notificationText = notification.find('#poker-notification-text');
					notificationText.html(options["i18n"]["connection-broken"]);
					notificationText.removeClass(me.elements.loaderBackgroundClass);
				}
			};

			this.checkMaxReconnects = function() {
				return (me.options.socket.maxReconnects > me.reconnectsTried);
			};

			this.isUserLoggedIn = function() {
				return localStorage.getItem(me.options.lsUserKey) !== null;
			};

			this.isAllowedListenerWhenLoggedOut = function(listener) {
				return me.allowedListenersWhenLoggedOut.indexOf(listener) != -1
			};

			this.onopen = function(event) {
				for(var i in me.listeners) {
					$(me.listeners[i]).trigger('open', [event]);
				}

				window.managedSocket.onclose = function(event) {
					var notification,
						notificationText,
						reconnectionCallback;

					notification = $(me.elements.notification);
					notification.find('#poker-notification-title').html(options["i18n"]["connection-interrupted"]);
					notificationText = notification.find('#poker-notification-text');
					notificationText.html(options["i18n"]["connection-reconnecting"]);
					notificationText.addClass(me.elements.loaderBackgroundClass);
					notification.show(400);

					me.reconnectionCallback();
				};

				window.managedSocket.onmessage = function(event) {
					var data;
					data = JSON.parse(event.data);

					// If user is logged off and he shall not get the update from the websocket:
					// exit method
					if (!me.isUserLoggedIn() && !me.isAllowedListenerWhenLoggedOut(data.type)) {
						return;
					}

					for(var i in me.listeners) {
						$(me.listeners[i]).trigger(data.type, [data]);
					}
				}
			};

			this.connect = function() {
				socket = new WebSocket('ws://' + this.options.socket.address + ':' + this.options.socket.port);
				window.managedSocket = socket;
				socket.onopen = this.onopen;
			};

			this.connect();

			return this;
		}
	});
})(jQuery);