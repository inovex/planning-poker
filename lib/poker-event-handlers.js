var pokerUsers = require('./poker-users.js'),
    pokerUser = require('./poker-user.js'),
    pokerCards = require('./poker-cards.js'),
    pokerBroadcaster = require('./poker-broadcaster.js'),
    pokerUserstory = require('./poker-userstory.js'),
    crypto = require('crypto');

module.exports = PokerEventHandlers = {};

PokerEventHandlers.registerAllForConnectionHandler = function(connectionHandler) {
    connectionHandler.on('login', PokerEventHandlers.loginListener);
    connectionHandler.on('get-initial-data', PokerEventHandlers.getInitialDataListener);
    connectionHandler.on('play-card', PokerEventHandlers.playCardListener);
    connectionHandler.on('show-cards', PokerEventHandlers.showCardsListener);
    connectionHandler.on('reset-cards', PokerEventHandlers.resetCardsListener);
    connectionHandler.on('post-userstory', PokerEventHandlers.postUserstoryListener);
    connectionHandler.on('post-chat-message', PokerEventHandlers.postChatMessageListener);
    connectionHandler.on('reset-room', PokerEventHandlers.resetRoomListener);
}

PokerEventHandlers.loginListener = function(messageData) {
    var user,
    sha1sum,
    sendData,
    me;

    // For callbacks
    connection = this.connection;
    me = this;

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
        user = pokerUser.create(user);
        pokerUsers.add(user);
        user.on('created', function(newUser) {
            sendData = {
                type: 'login',
                user: newUser
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

PokerEventHandlers.showCardsListener = function(messageData) {
    var pushData = {
            type: 'show-cards'
    };
    pokerCards.show = true;
    pokerBroadcaster.broadcast(pushData);
};

PokerEventHandlers.resetCardsListener = function(messageData) {
    pokerCards.reset();
    broadcastCards();
};

PokerEventHandlers.postUserstoryListener = function(messageData) {
    pokerUserstory.set(messageData.userstory);
    broadcastUserstory();
};

PokerEventHandlers.postChatMessageListener = function(messageData) {
    chatMessage = {
        type: 'new-chat-message',
        text: messageData.text,
        user: this.user
    };
    pokerBroadcaster.broadcast(chatMessage);
};

PokerEventHandlers.resetRoomListener = function(messageData) {
    pokerUserstory.remove();
    pokerCards.reset();
    broadcastCards();
    broadcastUserstory();

    var pushData = {
        type: 'reset-room'
    };
    pokerBroadcaster.broadcast(pushData);
};