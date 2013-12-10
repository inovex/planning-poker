var WebSocketServer = require('websocket').server,
    express = require('express'),
    i18n = require('i18n');
    
BootstrapWebsocketServer = function() {};

BootstrapWebsocketServer.getInstance = function() {
    if (BootstrapWebsocketServer.__instance == null) {
        BootstrapWebsocketServer.__instance = new BootstrapWebsocketServer();
    }
    
    return BootstrapWebsocketServer.__instance;
};

BootstrapWebsocketServer.__instance = null;

BootstrapWebsocketServer.prototype.httpServer = null;
BootstrapWebsocketServer.prototype.config = {};

BootstrapWebsocketServer.prototype.bootstrap = function(http, config) {
    this.config = config;
    
    this.configureI18n();
    var app = this.createAndGetExpressApp();
    this.httpServer = http.createServer(app);
    
    wsServer = new WebSocketServer({
        httpServer: this.httpServer,
        autoAcceptConnections: false
    });
    
    this.httpServer.listen(config.http.port, function() {
        console.log('HTTP Server running with config:');
        console.log(config.http);
    });
    
    return wsServer;
};

BootstrapWebsocketServer.prototype.createAndGetExpressApp = function() {
    var app = express();
    app.use(express.static(__dirname + this.config.filesystem.public_files));
    app.set('views', __dirname + this.config.filesystem.view_files);
    app.engine('html', require('ejs').renderFile);
    
    app.configure(function() {
        app.use(i18n.init);
    });
    
    var server = this;
    app.get('/', function(req, res) {
        res.render(
            'index.html',
            {
                web: server.config.http,
                cards: server.config.cards
            }
        );
        res.end();
    });
    
    return app;
};

BootstrapWebsocketServer.prototype.configureI18n = function() {
    i18n.configure({
        locales: ['en', 'de'],
        defaultLocale: this.config.locale.default,
        directory: this.config.filesystem.i18n,
        updateFiles: false
    });
};

BootstrapWebsocketServer.prototype.run = function() {
    
};

module.exports = BootstrapWebsocketServer.getInstance();