var WebSocketServer = require('websocket').server,
    express = require('express'),
    i18n = require('i18n');
    
BootstrapServer = function() {};

BootstrapServer.getInstance = function() {
    if (BootstrapServer.__instance == null) {
        BootstrapServer.__instance = new BootstrapServer();
    }
    
    return BootstrapServer.__instance;
};

BootstrapServer.__instance = null;

BootstrapServer.prototype.httpServer = null;
BootstrapServer.prototype.config = {};

BootstrapServer.prototype.bootstrap = function(http, config) {
    var expressApp,
        websocketServer;
    
    this.config = config;
    
    this.configureI18n();
    expressApp = this.createExpressApp();
    this.httpServer = http.createServer(expressApp);
    websocketServer = this.createWebsocketServer();
    
    return websocketServer;
};

BootstrapServer.prototype.configureI18n = function() {
    i18n.configure({
        locales: ['en', 'de'],
        defaultLocale: this.config.locale.default,
        directory: this.config.filesystem.i18n,
        updateFiles: false
    });
};

BootstrapServer.prototype.createExpressApp = function() {
    var app = express();
    app.use(express.static(__dirname + this.config.filesystem.public_files));
    app.set('views', __dirname + this.config.filesystem.view_files);
    app.engine('html', require('ejs').renderFile);    
    app.configure(function() {
        app.use(i18n.init);
    });
    this.configureExpressAppRoutes(app);
    return app;
};

BootstrapServer.prototype.configureExpressAppRoutes = function(app) {
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
};

BootstrapServer.prototype.createWebsocketServer = function() {
    return new WebSocketServer({
        httpServer: this.httpServer,
        autoAcceptConnections: false
    });
};

BootstrapServer.prototype.run = function() {
    var server = this;
    this.httpServer.listen(this.config.http.port, function() {
        console.log('HTTP Server running with config:');
        console.log(server.config.http);
    });
};

module.exports = BootstrapServer.getInstance();