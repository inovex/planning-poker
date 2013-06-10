var EventEmitter = require('events').EventEmitter;

var PokerConnectionHandler = function() {};
PokerConnectionHandler.prototype = new EventEmitter();

PokerConnectionHandler.prototype.connection = null;

PokerConnectionHandler.prototype.pokerData = {};

PokerConnectionHandler.prototype.init = function(currentUsers, carddisplay, currentUserstory) {
    this.pokerData = {
        "users": currentUsers,
        "carddisplay": carddisplay,
        "userstory": currentUserstory
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
        this.pokerData.users[this.user.id] = null;
        delete this.pokerData.users[this.user.id];

        this.pokerData.carddisplay[this.user.id] = null;
        delete this.pokerData.carddisplay.cards[this.user.id];

        broadcastUsers();
        broadcastCards();
    }
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