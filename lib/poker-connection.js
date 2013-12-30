var EventEmitter = require('events').EventEmitter;
var util = require('util');

var PokerConnectionHandler = function() {};
util.inherits(PokerConnectionHandler, EventEmitter);

PokerConnectionHandler.prototype._connection = null;

PokerConnectionHandler.prototype.pokerData = {};

PokerConnectionHandler.prototype._user = null;

PokerConnectionHandler.prototype.init = function(currentUsers, carddisplay) {
    this.pokerData = {
        "users": currentUsers,
        "carddisplay": carddisplay
    };
};

PokerConnectionHandler.prototype.setConnection = function(connection) {
    var me;
    me = this;
    this._connection = connection;
    this._connection.on('message', function(message) {
        me.onmessage.call(me, message);
    });

    connection.on('close', function(reasonCode, description) {
        me.onclose.call(me, reasonCode, description);
    });
};

PokerConnectionHandler.prototype.getConnection = function() {
    return this._connection;
};

PokerConnectionHandler.prototype.onclose = function(reasonCode, description) {
    if (typeof this.user != 'undefined') {
        this.pokerData.users.remove(this.user.id);
        this.pokerData.carddisplay.removeCard(this.user.id);

        broadcastUsers();
        broadcastCards();
    }
    
    // When the connection is closed, remove all event listeners
    this._connection.removeAllListeners();
    this.removeAllListeners();
};

PokerConnectionHandler.prototype.onmessage = function(message) {
    if (message.type === 'utf8') {
        var messageData = JSON.parse(message.utf8Data);
        // Emit message type as event
        this.emit(messageData.type, messageData, this);
    }
};

PokerConnectionHandler.prototype.setUser = function(user) {
    this._user = user;
};

PokerConnectionHandler.prototype.getUser = function() {
    return this._user;
}

module.exports.getNewHandler = function() {
    return new PokerConnectionHandler();
};