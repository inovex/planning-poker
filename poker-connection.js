var EventEmitter = require('events').EventEmitter;

var PokerConnectionHandler = function() {};
PokerConnectionHandler.prototype = new EventEmitter();

PokerConnectionHandler.prototype.connection = null;

PokerConnectionHandler.prototype.pokerData = {};

PokerConnectionHandler.prototype.init = function(pokerData) {
    this.pokerData = pokerData;
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
        console.log(this.pokerData.users);

        this.pokerData.carddisplay[this.user.id] = null;
        delete this.pokerData.carddisplay.cards[this.user.id];

        broadcastUsers();
        broadcastCards();
    }
};

PokerConnectionHandler.prototype.onmessage = function(message) {
    console.log(this.pokerData);
    if (message.type === 'utf8') {
        //console.log('Received Message: ' + message.utf8Data);
        var messageData = JSON.parse(message.utf8Data);
        // Emit message type as event
        this.emit(messageData.type, messageData, this);
    }
};

module.exports.getNewHandler = function() {
    return new PokerConnectionHandler();
};