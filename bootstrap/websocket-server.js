var WebSocketServer = require('websocket').server,
    express = require('express'),
    i18n = require('i18n');

module.exports = BootstrapWebsocketServer = function() {};

BootstrapWebsocketServer.bootstrap = function(http, config) {
    var app = express();
    var httpServer = http.createServer(app);
    app.use(express.static(__dirname + config.filesystem.public_files));
    app.set('views', __dirname + config.filesystem.view_files);
    app.engine('html', require('ejs').renderFile);

    // i18n config
    i18n.configure({
        locales: ['en', 'de'],
        defaultLocale: config.locale.default,
        directory: config.filesystem.i18n,
        updateFiles: false
    });

    app.configure(function() {
        app.use(i18n.init);
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
    
    wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });
    
    httpServer.listen(config.http.port, function() {
        console.log('HTTP Server running with config:');
        console.log(config.http);
    });
    
    return wsServer;
};