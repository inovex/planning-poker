var WebSocketServer = require('websocket').server,
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    express = require('express'),
    iniparser = require('iniparser'),
    crypto = require('crypto'),
    i18n = require('i18n');

var EventEmitter = require('events').EventEmitter;

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
    locales: ['en', 'de']
});
console.log('Setting locale to "' + config.general.locale + '"');
i18n.setLocale(config.general.locale);

// App Variables
var currentUsers = {};
var carddisplay = {
    cards: {},
    show: false
};
var currentUserstory = '';

// WebSocket Server
console.log('Creating WebSocket Server');
wsServer = new WebSocketServer({
    httpServer: httpServer,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

var pokerLoginListener = function(messageData) {
    var user,
        sha1sum,
        sendData;

    // For callbacks
    connection = this.connection;

    user = messageData.user;
    if (typeof user.id !== 'undefined') {
        currentUsers[user.id] = user;
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
            currentUsers[user.id] = user;
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
    // Allow only if cards are not already shown
    if (!carddisplay.show) {
        carddisplay.cards[messageData.userId] = messageData.cardValue
        broadcastCards();
    }
};

var showCardsListener = function(messageData) {
    var pushData = {
        type: 'show-cards'
    };
    carddisplay.show = true;
    wsServer.broadcastUTF(JSON.stringify(pushData));
};

var resetCardsListener = function(messageData) {
    carddisplay = {
        cards: {},
        show: false
    };
    broadcastCards();
};

var postUserstoryListener = function(messageData) {
    currentUserstory  = messageData.userstory;
    broadcastUserstory();
};

var postChatMessageListener = function(messageData) {
    chatMessage = {
        type: 'new-chat-message',
        text: messageData.text,
        user: this.user
    };
    wsServer.broadcastUTF(JSON.stringify(chatMessage));
};

var resetRoomListener = function(messageData) {
    currentUserstory = '';
    carddisplay = {
        cards: {},
        show: false
    };
    broadcastCards();
    broadcastUserstory();

    var pushData = {
        type: 'reset-room'
    };
    wsServer.broadcastUTF(JSON.stringify(pushData));
}

var PokerConnectionHandler = function() {};
PokerConnectionHandler.prototype = new EventEmitter();

PokerConnectionHandler.prototype.connection = null;

PokerConnectionHandler.prototype.setConnection = function(connection) {
    var me;
    me = this;
    this.connection = connection;
    this.connection.on('message', function(message) {
        me.onmessage.call(me, message);
    });

    connection.on('close', function(reasonCode, description) {
        me.onclose.call(me, reasonCode, description);
    });
};

PokerConnectionHandler.prototype.onclose = function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    if (typeof this.user != 'undefined') {
        currentUsers[this.user.id] = null;
        delete currentUsers[this.user.id];

        carddisplay[this.user.id] = null;
        delete carddisplay.cards[this.user.id];

        broadcastUsers();
        broadcastCards();
    }
};

PokerConnectionHandler.prototype.onmessage = function(message) {
    if (message.type === 'utf8') {
        //console.log('Received Message: ' + message.utf8Data);
        var messageData = JSON.parse(message.utf8Data);
        // Emit message type as event
        this.emit(messageData.type, messageData, this);
    }
    else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    }
};

wsServer.on('request', function(request) {
    var connectionHandler = new PokerConnectionHandler();
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
    console.log(config.http);
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
    	data: currentUsers
    };
};

broadcastUsers = function() {
	var pushData = getUserUpdateList();
    wsServer.broadcastUTF(JSON.stringify(pushData));
}

getCardUpdateList = function () {
	return {
    	type: 'carddisplay',
    	data: carddisplay
    };
};

broadcastCards = function() {
	var pushData = getCardUpdateList();
    wsServer.broadcastUTF(JSON.stringify(pushData));	
};

getUserstoryUpdate = function() {
	return {
		type: 'userstory',
		userstory: currentUserstory
	};
}

broadcastUserstory = function() {
	var pushData = getUserstoryUpdate();
	wsServer.broadcastUTF(JSON.stringify(pushData));
};

httpServer.listen(config.http.port, function() {
	console.log('HTTP Server running with config:');
    console.log(config.http);
});