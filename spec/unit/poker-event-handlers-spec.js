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

    it('should broadcast a chat message with a user set', function() {
        var broadcasterMock = {
            broadcast: function(message) {}
        };
        spyOn(broadcasterMock, 'broadcast');

        var eventHandler = new pokerEventHandlers(broadcasterMock);

        var messageData = {
            text: 'Hallo, ich bin Bernd das Brot'
        };
        eventHandler.postChatMessageListener(messageData);

        var expected = {
            "type": 'new-chat-message',
            "text": messageData.text
        };
        expect(broadcasterMock.broadcast).toHaveBeenCalledWith(expected);
    });
});