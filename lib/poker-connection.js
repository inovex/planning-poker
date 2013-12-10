var EventEmitter = require('events').EventEmitter;
var util = require('util');

var PokerConnectionHandler = function() {};
util.inherits(PokerConnectionHandler, EventEmitter);

PokerConnectionHandler.prototype.connection = null;

PokerConnectionHandler.prototype.pokerData = {};

PokerConnectionHandler.prototype.init = function(currentUsers, carddisplay) {
    this.pokerData = {
        "users": currentUsers,
        "carddisplay": carddisplay
    };
};

PokerConnectionHandler.prototype.setConnection = function(connection) {
    var me;
    me = this;
    this.connection = connection;
    this.connection.on('message', function(message) {
        me.onmessage.call(me, message);
    });

    connection.on('close', function(reasonCode, description) {
        me.onclose.call(me, reasonCode, description);
    });
};

PokerConnectionHandler.prototype.onclose = function(reasonCode, description) {
    if (typeof this.user != 'undefined') {
        this.pokerData.users.remove(this.user.id);
        this.pokerData.carddisplay.removeCard(this.user.id);

        broadcastUsers();
        broadcastCards();
    }
    
    // When the connection is closed, remove all event listeners
    this.connection.removeAllListeners();
    this.removeAllListeners();
};

PokerConnectionHandler.prototype.onmessage = function(message) {
    if (message.type === 'utf8') {
        var messageData = JSON.parse(message.utf8Data);
        // Emit message type as event
        this.emit(messageData.type, messageData, this);
    }
};

module.exports.getNewHandler = function() {
    return new PokerConnectionHandler();
};