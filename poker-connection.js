var EventEmitter = require('events').EventEmitter;

//var PokerConnectionHandler = function() {};
module.exports = new EventEmitter();

module.exports.connection = null;

module.exports.init = function() {

};

module.exports.setConnection = function(connection) {
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

module.exports.onclose = function(reasonCode, description) {
    if (typeof this.user != 'undefined') {
        currentUsers[this.user.id] = null;
        delete currentUsers[this.user.id];

        carddisplay[this.user.id] = null;
        delete carddisplay.cards[this.user.id];

        broadcastUsers();
        broadcastCards();
    }
};

module.exports.onmessage = function(message) {
    if (message.type === 'utf8') {
        //console.log('Received Message: ' + message.utf8Data);
        var messageData = JSON.parse(message.utf8Data);
        // Emit message type as event
        this.emit(messageData.type, messageData, this);
    }
    else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    }
};