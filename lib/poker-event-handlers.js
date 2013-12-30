var pokerUsers = require('./poker-users.js'),
    pokerUser = require('./poker-user.js'),
    pokerCards = require('./poker-cards.js'),
    pokerBroadcaster = require('./poker-broadcaster.js'),
    pokerUserstory = require('./poker-userstory.js');

var PokerEventHandlers = function(pokerBroadcaster) {
    this._broadcaster = pokerBroadcaster;
};

PokerEventHandlers.prototype._broadcaster = null;
PokerEventHandlers.prototype._user = null;

PokerEventHandlers.prototype.registerAllForConnectionHandler = function(connectionHandler) {
    connectionHandler.on('login', this.createCallback(this.loginListener));
    connectionHandler.on('get-initial-data', this.createCallback(this.getInitialDataListener));
    connectionHandler.on('play-card', this.playCardListener);
    connectionHandler.on('show-cards', this.showCardsListener);
    connectionHandler.on('reset-cards', this.resetCardsListener);
    connectionHandler.on('post-userstory', this.postUserstoryListener);
    connectionHandler.on('post-chat-message', this.postChatMessageListener);
    connectionHandler.on('reset-room', this.resetRoomListener);
};

PokerEventHandlers.prototype.createCallback = function(callback) {
    var me = this;
    return function() {
        return callback.apply(me, arguments);
    };
};

PokerEventHandlers.prototype.setUser = function(user) {
    this._user = user;
};

PokerEventHandlers.prototype.getUser = function() {
    return this._user;
}

PokerEventHandlers.prototype.hasUser = function() {
    return (this._user != null && this._user.id != undefined);
};

PokerEventHandlers.prototype.loginListener = function(messageData) {
    var user,
        sendData;

    // For callbacks
    var connection = this.connection;

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
        user.on('created', function(newUser) {
            pokerUsers.add(newUser);
            sendData = {
                type: 'login',
                user: newUser
            };
            connection.sendUTF(JSON.stringify(sendData));
            broadcastUsers();
        });
    }
    this.setUser(user);
};

PokerEventHandlers.prototype.getInitialDataListener = function(messageData) {
    this.connection.sendUTF(JSON.stringify(getUserUpdateList()));
    this.connection.sendUTF(JSON.stringify(getCardUpdateList()));
    this.connection.sendUTF(JSON.stringify(getUserstoryUpdate()));
};

PokerEventHandlers.prototype.playCardListener = function(messageData) {
    var cardSet = pokerCards.setCard(messageData.userId, messageData.cardValue);
    // If a new card could be set, broadcast
    if (cardSet) {
        broadcastCards();
    }
};

PokerEventHandlers.prototype.showCardsListener = function(messageData) {
    var pushData = {
            type: 'show-cards'
    };
    pokerCards.show = true;
    pokerBroadcaster.broadcast(pushData);
};

PokerEventHandlers.prototype.resetCardsListener = function(messageData) {
    pokerCards.reset();
    broadcastCards();
};

PokerEventHandlers.prototype.postUserstoryListener = function(messageData) {
    pokerUserstory.set(messageData.userstory);
    broadcastUserstory();
};

PokerEventHandlers.prototype.postChatMessageListener = function(messageData) {
    if(!this.hasUser()) {
        throw('Cannot post a chat message without a valid user');
    }
    chatMessage = {
        type: 'new-chat-message',
        text: messageData.text,
        user: this._user
    };
    this._broadcaster.broadcast(chatMessage);
};

PokerEventHandlers.prototype.resetRoomListener = function(messageData) {
    pokerUserstory.remove();
    pokerCards.reset();
    broadcastCards();
    broadcastUserstory();

    var pushData = {
        type: 'reset-room'
    };
    pokerBroadcaster.broadcast(pushData);
};

module.exports = PokerEventHandlers;