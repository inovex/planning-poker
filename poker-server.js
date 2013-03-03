var http = require('http');
var WebSocketServer = require('websocket').server;
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var iniparser = require('iniparser');
var crypto = require('crypto');

console.log('Loading config');
var config = iniparser.parseSync('./config.ini');

var app = express();
var httpServer = http.createServer(app);
app.use(express.static(__dirname + config.filesystem.public_files));
app.set('views', __dirname + config.filesystem.view_files);
app.engine('html', require('ejs').renderFile);

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
var connections = [];

wsServer.on('request', function(request) {
	console.log(request.requestedProtocols);
	var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// App Variables
var currentUsers = {};

var readFile = function(filename) {
	var output = '';
	try {
		output = fs.readFileSync(__dirname + '/' + filename, 'utf-8');
	} catch (e) {
		console.log(e);
	}
	return output;
}

app.get('/', function(req, res) {
	res.render('index.html');
	res.end();
});

app.post('/login', function(req, res) {
    var user,
    	sha1sum;

    user = '';
    //res.set('Content-Type', 'application/json');
    req.on('data', function (data) {
        user += data;
        if (user.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    req.on('end', function () {
    	user = qs.parse(user);
    	// Create random id for user
    	sha1sum = crypto.createHash('sha1');
		crypto.randomBytes(256, function(ex, buf) {
			if (ex) throw ex;
			sha1sum.update(buf);
			user.id = sha1sum.digest('hex');
	        currentUsers[user.id] = user;
	        wsServer.broadcastUTF('New user logged in: ' + user.name);
	        res.json(user);
		});
    });
});

httpServer.listen(config.http.port, config.http.listen, function() {
	console.log('HTTP Server running at http://' + config.http.listen + ':' + config.http.port + '/');
});