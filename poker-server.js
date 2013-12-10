var WebSocketServer = require('websocket').server,
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    express = require('express'),
    iniparser = require('iniparser'),
    crypto = require('crypto'),
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
    pokerBroadcaster = require('./poker-broadcaster.js'),
    pokerUsers = require('./poker-users.js'),
    pokerUserstory = require('./poker-userstory.js'),
    pokerCards = require('./poker-cards.js');

// WebSocket Server
console.log('Creating WebSocket Server');
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

pokerBroadcaster.init(wsServer);

var pokerLoginListener = function(messageData) {
    var user,
        sha1sum,
        sendData;

    // For callbacks
    connection = this.connection;

    user = messageData.user;
    if (typeof user.id !== 'undefined') {
        pokerUsers.add(user);
        sendData = {
            type: 'login',
            user: user
        };
        connection.sendUTF(JSON.stringify(sendData));
        broadcastUsers();
    } else {
        // Create random id for user
        sha1sum = crypto.createHash('sha1');
        crypto.randomBytes(256, function(ex, buf) {
            if (ex) throw ex;
            sha1sum.update(buf);
            user.id = sha1sum.digest('hex');
            pokerUsers.add(user);
            sendData = {
                type: 'login',
                user: user
            };
            connection.sendUTF(JSON.stringify(sendData));
            broadcastUsers();
        });
    }
    this.user = user;
};

var getInitialDataListener = function(messageData) {
    this.connection.sendUTF(JSON.stringify(getUserUpdateList()));
    this.connection.sendUTF(JSON.stringify(getCardUpdateList()));
    this.connection.sendUTF(JSON.stringify(getUserstoryUpdate()));
};

var playCardListener = function(messageData) {
    var cardSet = pokerCards.setCard(messageData.userId, messageData.cardValue);
    // If a new card could be set, broadcast
    if (cardSet) {
        broadcastCards();
    }
};

var showCardsListener = function(messageData) {
    var pushData = {
        type: 'show-cards'
    };
    pokerCards.show = true;
    pokerBroadcaster.broadcast(pushData);
};

var resetCardsListener = function(messageData) {
    pokerCards.reset();
    broadcastCards();
};

var postUserstoryListener = function(messageData) {
    pokerUserstory.set(messageData.userstory);
    broadcastUserstory();
};

var postChatMessageListener = function(messageData) {
    chatMessage = {
        type: 'new-chat-message',
        text: messageData.text,
        user: this.user
    };
    pokerBroadcaster.broadcast(chatMessage);
};

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
    connectionHandler.on('login', pokerLoginListener);
    connectionHandler.on('get-initial-data', getInitialDataListener);
    connectionHandler.on('play-card', playCardListener);
    connectionHandler.on('show-cards', showCardsListener);
    connectionHandler.on('reset-cards', resetCardsListener);
    connectionHandler.on('post-userstory', postUserstoryListener);
    connectionHandler.on('post-chat-message', postChatMessageListener);
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