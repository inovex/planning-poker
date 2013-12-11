var WebSocketServer = require('websocket').server,
    express = require('./express.js');
    
BootstrapServer = function() {};

BootstrapServer.getInstance = function() {
    if (BootstrapServer.__instance == null) {
        BootstrapServer.__instance = new BootstrapServer();
    }
    
    return BootstrapServer.__instance;
};

BootstrapServer.__instance = null;

BootstrapServer.prototype.httpServer = null;
BootstrapServer.prototype.websocketServer = null;
BootstrapServer.prototype.expressApp = null;
BootstrapServer.prototype.config = {};

BootstrapServer.prototype.bootstrap = function(http, config) {
    this.config = config;
    
    this.createExpressApp();
    this.createHttpServer();
    this.createWebsocketServer();
    
    return this.websocketServer;
};

BootstrapServer.prototype.createExpressApp = function() {
    this.expressApp = express.bootstrap(this.config);
};

BootstrapServer.prototype.createHttpServer = function() {
    this.httpServer = http.createServer(this.expressApp);
};

BootstrapServer.prototype.createWebsocketServer = function() {
    this.websocketServer = new WebSocketServer({
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