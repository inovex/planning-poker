var WebSocketServer = require('websocket').server;
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var iniparser = require('iniparser');
var crypto = require('crypto');

console.log('Loading config');
var config = iniparser.parseSync('./config.ini');

// HTTP Server
var http = require(config.http.protocol);
var app = express();
var httpServer = http.createServer(app);
app.use(express.static(__dirname + config.filesystem.public_files));
app.set('views', __dirname + config.filesystem.view_files);
app.engine('html', require('ejs').renderFile);

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

wsServer.on('request', function(request) {
	var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message, param2) {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            var messageData = JSON.parse(message.utf8Data);
            switch(messageData.type) {
            	case 'login':
            		var user,
				    	sha1sum,
				    	sendData;

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
            		break;

            	case 'get-initial-data':
            		connection.sendUTF(JSON.stringify(getUserUpdateList()));
            		connection.sendUTF(JSON.stringify(getCardUpdateList()));
            		connection.sendUTF(JSON.stringify(getUserstoryUpdate()));
            		break;

        		case 'play-card':
        			// Allow only if cards are not already shown
        			if (!carddisplay.show) {
	        			carddisplay.cards[messageData.userId] = messageData.cardValue
	        			broadcastCards();
        			}
        			break;

        		case 'show-cards':
        			var pushData = {
        				type: 'show-cards'
        			};
        			carddisplay.show = true;
        			wsServer.broadcastUTF(JSON.stringify(pushData));
        			break;

        		case 'reset-cards':
        			carddisplay = {
        				cards: {},
        				show: false
        			};
        			broadcastCards();
        			break;

        		case 'post-userstory':
        			currentUserstory  = messageData.userstory;
        			broadcastUserstory();
        			break;
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
    	if (typeof this.user != 'undefined') {
	    	currentUsers[this.user.id] = null;
			delete currentUsers[this.user.id];

			carddisplay[this.user.id] = null;
			delete carddisplay.cards[this.user.id];

			broadcastUsers();
			broadcastCards();
		}

        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
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