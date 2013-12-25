var websocketServerMock = require('../mock/websocket-server.js'),
    pokerEventHandlers = require('../../lib/poker-event-handlers'),
    pokerBroadcaster = require('../../lib/poker-broadcaster');

pokerBroadcaster.websocketServer = websocketServerMock;


describe('postChatMessageListener', function() {
    it('should send a message to all clients', function() {
        var messageText = 'Hallo, ich bin Bernd das Brot';

        var messageData = {
            text: messageText
        };

        pokerEventHandlers.postChatMessageListener(messageData);

        var expected = JSON.stringify({
            "type": 'new-chat-message',
            "text": messageText
        });

        expect(websocketServerMock.getBroadcastedJsonMessage()).toEqual(expected);
    });
});