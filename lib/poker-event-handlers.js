var pokerUsers = require('./poker-users.js'),
    pokerCards = require('./poker-cards.js'),
    crypto = require('crypto');

module.exports = PokerEventHandlers = {};

PokerEventHandlers.loginListener = function(messageData) {
    var user,
    sha1sum,
    sendData;
    
    // For callbacks
    connection = this.connection;
    
    user = messageData.user;
    if (typeof user.id !== 'undefined') {
        pokerUsers.add(user);
        sendData = {
            type: 'login',
            user: user
        };
        connection.sendUTF(JSON.stringify(sendData));
        broadcastUsers();
    } else {
        // Create random id for user
        sha1sum = crypto.createHash('sha1');
        crypto.randomBytes(256, function(ex, buf) {
            if (ex) throw ex;
            sha1sum.update(buf);
            user.id = sha1sum.digest('hex');
            pokerUsers.add(user);
            sendData = {
                type: 'login',
                user: user
            };
            connection.sendUTF(JSON.stringify(sendData));
            broadcastUsers();
        });
    }
    this.user = user;
};

PokerEventHandlers.getInitialDataListener = function(messageData) {
    this.connection.sendUTF(JSON.stringify(getUserUpdateList()));
    this.connection.sendUTF(JSON.stringify(getCardUpdateList()));
    this.connection.sendUTF(JSON.stringify(getUserstoryUpdate()));
};

PokerEventHandlers.playCardListener = function(messageData) {
    var cardSet = pokerCards.setCard(messageData.userId, messageData.cardValue);
    // If a new card could be set, broadcast
    if (cardSet) {
        broadcastCards();
    }
};