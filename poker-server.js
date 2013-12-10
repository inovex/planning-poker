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

require('./lib/poker-broadcasts.js');

// WebSocket Server
console.log('Creating WebSocket Server');
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

pokerBroadcaster.init(wsServer);

wsServer.on('request', function(request) {
    var connectionHandler = pokerConnection.getNewHandler();
    connectionHandler.init(pokerUsers, pokerCards);
    pokerEventHandlers.registerAllForConnectionHandler(connectionHandler);
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

httpServer.listen(config.http.port, function() {
	console.log('HTTP Server running with config:');
    console.log(config.http);
});