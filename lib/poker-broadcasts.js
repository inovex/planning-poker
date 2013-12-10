var pokerUsers = require('./poker-users.js'),
    pokerBroadcaster = require('./poker-broadcaster.js'),
    pokerCards = require('./poker-cards.js'),
    pokerUserstory = require('./poker-userstory.js');

getUserUpdateList = function () {
    return {
        type: 'userlist',
        data: pokerUsers.getAll()
    };
};

broadcastUsers = function() {
    var pushData = getUserUpdateList();
    pokerBroadcaster.broadcast(pushData);
};

getCardUpdateList = function () {
    return {
        type: 'carddisplay',
        data: pokerCards.getAll()
    };
};

broadcastCards = function() {
    var pushData = getCardUpdateList();
    pokerBroadcaster.broadcast(pushData);   
};

getUserstoryUpdate = function() {
    return {
        type: 'userstory',
        userstory: pokerUserstory.get()
    };
};

broadcastUserstory = function() {
    var pushData = getUserstoryUpdate();
    pokerBroadcaster.broadcast(pushData);
};