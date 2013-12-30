var pokerEventHandlers = require('../../lib/poker-event-handlers'),
    pokerBroadcaster = require('../../lib/poker-broadcaster');

describe('postChatMessageListener', function() {
    describe('#setUser/#getUser', function() {
        it('should set and get a user', function() {
            var userMock = {};
            var broadcasterMock = {};
            var eventHandler = new pokerEventHandlers(broadcasterMock);

            eventHandler.setUser(userMock);
            expect(eventHandler.getUser()).toEqual(userMock);
        });
    });

    describe('#hasUser', function() {
        it('should be false when no user is set', function() {
            var broadcasterMock = {};
            var eventHandler = new pokerEventHandlers(broadcasterMock);

            expect(eventHandler.hasUser()).toBe(false);
        });

        it('should be true when a user is set', function() {
            var broadcasterMock = {};
            var userMock = {
                id: 'foobar'
            };
            var eventHandler = new pokerEventHandlers(broadcasterMock);
            eventHandler.setUser(userMock);

            expect(eventHandler.hasUser()).toBe(true);
        });
    });

    describe('#postChatMessageListener', function() {
        it('should broadcast a chat message', function() {
            var broadcasterMock = {
                broadcast: function(message) {}
            };
            spyOn(broadcasterMock, 'broadcast');

            var userMock = {
                id: 'foobar'
            };

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

        it('should throw an exception when trying to send a message without a user', function() {
            var broadcasterMock = {
                broadcast: function() {}
            };
            var eventHandler = new pokerEventHandlers(broadcasterMock);
            var sendMessage = function() {
                eventHandler.postChatMessageListener({})
            };
            expect(sendMessage).toThrow('Cannot post a chat message without a valid user');
        });
    });
});