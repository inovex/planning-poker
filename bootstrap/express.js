var express = require('express'),
    i18n = require('i18n');

BootstrapExpress = function() {};

BootstrapExpress.prototype.config = {};
BootstrapExpress.prototype.app = null;

BootstrapExpress.prototype.bootstrap = function(config) {
    this.config = config;
    
    this.configureI18n();
    this.createApp();
    this.configureRoutes();
    
    return this.app;
};

BootstrapExpress.prototype.configureI18n = function() {
    i18n.configure({
        locales: ['en', 'de'],
        defaultLocale: this.config.locale.default,
        directory: this.config.filesystem.i18n,
        updateFiles: false
    });
};

BootstrapExpress.prototype.createApp = function() {
    var app = this.app = express();
    this.app.use(express.static(__dirname + this.config.filesystem.public_files));
    this.app.set('views', __dirname + this.config.filesystem.view_files);
    this.app.engine('html', require('ejs').renderFile);
    this.app.configure(function() {
        app.use(i18n.init);
    });
};

BootstrapExpress.prototype.configureRoutes = function() {
    var server = this;
    this.app.get('/', function(req, res) {
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

module.exports = new BootstrapExpress();