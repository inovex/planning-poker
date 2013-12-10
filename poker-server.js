var config = require('iniparser').parseSync('./config.ini'),
    // Poker App specific Variables and requires
    pokerConnection = require('./lib/poker-connection.js'),
    pokerBroadcaster = require('./lib/poker-broadcaster.js'),
    pokerUsers = require('./lib/poker-users.js'),
    pokerUserstory = require('./lib/poker-userstory.js'),
    pokerCards = require('./lib/poker-cards.js')
    pokerEventHandlers = require('./lib/poker-event-handlers.js'),
    pokerBroadCasts = require('./lib/poker-broadcasts.js'),
    // HTTP Server
    http = require(config.http.protocol),
    server = require('./bootstrap/websocket-server.js');

// This path cannot be completely set in the config
// Also see https://github.com/mashpie/i18n-node/issues/61
config.filesystem.i18n = __dirname + config.filesystem.i18n;

// Create HTTP Server
server.bootstrap(http, config);

// WebSocket Server
console.log('Creating WebSocket Server');

pokerBroadcaster.init(wsServer);

wsServer.on('request', function(request) {
    var connectionHandler = pokerConnection.getNewHandler();
    connectionHandler.init(pokerUsers, pokerCards);
    pokerEventHandlers.registerAllForConnectionHandler(connectionHandler);
    connectionHandler.setConnection(request.accept());

    console.log((new Date()) + ' Connection accepted.');

});