var pokerEventHandlers = require('../../lib/poker-event-handlers'),
    pokerBroadcaster = require('../../lib/poker-broadcaster');

describe('postChatMessageListener', function() {
    it('should set and get a user', function() {
        var userMock = {};
        var broadcasterMock = {};
        var eventHandler = new pokerEventHandlers(broadcasterMock);

        eventHandler.setUser(userMock);
        expect(eventHandler.getUser()).toEqual(userMock);
    });

    it('should broadcast a chat message', function() {
        var broadcasterMock = {
            broadcast: function(message) {}
        };
        spyOn(broadcasterMock, 'broadcast');

        var userMock = {};

        var eventHandler = new pokerEventHandlers(broadcasterMock);
        eventHandler.setUser(userMock);

        var messageData = {
            text: 'Hallo, ich bin Bernd das Brot'
        };
        eventHandler.postChatMessageListener(messageData);

        var expected = {
            "type": 'new-chat-message',
            "text": messageData.text,
            "user": userMock
        };
        expect(broadcasterMock.broadcast).toHaveBeenCalledWith(expected);
    });
});