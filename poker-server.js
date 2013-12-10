var WebSocketServer = require('websocket').server,
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    express = require('express'),
    iniparser = require('iniparser'),
    i18n = require('i18n'),
    path = require('path');

console.log('Loading config');
var config = iniparser.parseSync('./config.ini');

// HTTP Server
var http = require(config.http.protocol);
var app = express();
var httpServer = http.createServer(app);
app.use(express.static(__dirname + config.filesystem.public_files));
app.set('views', __dirname + config.filesystem.view_files);
app.engine('html', require('ejs').renderFile);

// i18n config
i18n.configure({
    locales: ['en', 'de'],
    defaultLocale: config.locale.default,
    // See https://github.com/mashpie/i18n-node/issues/61
    directory: __dirname + '/locales',
    updateFiles: false
});
app.configure(function() {
    app.use(i18n.init);
});

// Poker App specific Variables
var pokerConnection = require('./lib/poker-connection.js'),
    pokerBroadcaster = require('./lib/poker-broadcaster.js'),
    pokerUsers = require('./lib/poker-users.js'),
    pokerUserstory = require('./lib/poker-userstory.js'),
    pokerCards = require('./lib/poker-cards.js')
    pokerEventHandlers = require('./lib/poker-event-handlers.js');

// WebSocket Server
console.log('Creating WebSocket Server');
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

pokerBroadcaster.init(wsServer);

var resetRoomListener = function(messageData) {
    pokerUserstory.remove();
    pokerCards.reset();
    broadcastCards();
    broadcastUserstory();

    var pushData = {
        type: 'reset-room'
    };
    pokerBroadcaster.broadcast(pushData);
}



wsServer.on('request', function(request) {
    var connectionHandler = pokerConnection.getNewHandler();
    connectionHandler.init(pokerUsers, pokerCards);
    connectionHandler.on('login', pokerEventHandlers.loginListener);
    connectionHandler.on('get-initial-data', pokerEventHandlers.getInitialDataListener);
    connectionHandler.on('play-card', pokerEventHandlers.playCardListener);
    connectionHandler.on('show-cards', pokerEventHandlers.showCardsListener);
    connectionHandler.on('reset-cards', pokerEventHandlers.resetCardsListener);
    connectionHandler.on('post-userstory', pokerEventHandlers.postUserstoryListener);
    connectionHandler.on('post-chat-message', pokerEventHandlers.postChatMessageListener);
    connectionHandler.on('reset-room', resetRoomListener);
    connectionHandler.setConnection(request.accept());

    console.log((new Date()) + ' Connection accepted.');

});

app.get('/', function(req, res) {
	res.render(
        'index.html',
        {
            web: config.http,
            cards: config.cards
        }
    );
	res.end();
});

getUserUpdateList = function () {
	return {
    	type: 'userlist',
    	data: pokerUsers.getAll()
    };
};

broadcastUsers = function() {
	var pushData = getUserUpdateList();
    pokerBroadcaster.broadcast(pushData);
}

getCardUpdateList = function () {
	return {
    	type: 'carddisplay',
    	data: pokerCards.getAll()
    };
};

broadcastCards = function() {
	var pushData = getCardUpdateList();
    pokerBroadcaster.broadcast(pushData);	
};

getUserstoryUpdate = function() {
	return {
		type: 'userstory',
		userstory: pokerUserstory.get()
	};
}

broadcastUserstory = function() {
	var pushData = getUserstoryUpdate();
	pokerBroadcaster.broadcast(pushData);
};

httpServer.listen(config.http.port, function() {
	console.log('HTTP Server running with config:');
    console.log(config.http);
});