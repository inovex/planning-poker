var pokerEventHandlers = require('../../lib/poker-event-handlers'),
    pokerBroadcaster = require('../../lib/poker-broadcaster');

describe('postChatMessageListener', function() {
//    it('should send a message to all clients', function() {
//        // Set Up WebsocketServer Mock
//        var websocketServerMock = {
//            broadcastUTF: function(message) {}
//        }
//        spyOn(websocketServerMock, 'broadcastUTF');
//        pokerBroadcaster.websocketServer = websocketServerMock;
//
//        var messageData = {
//            text: 'Hallo, ich bin Bernd das Brot'
//        };
//        pokerEventHandlers.postChatMessageListener(messageData);
//
//        var expected = JSON.stringify({
//            "type": 'new-chat-message',
//            "text": messageData.text
//        });
//        expect(websocketServerMock.broadcastUTF).toHaveBeenCalledWith(expected);
//
//        // Remove WebsocketServer mock
//        pokerBroadcaster.websocketServer = null;
//    });

    it('should broadcast a chat message without a user set', function() {
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