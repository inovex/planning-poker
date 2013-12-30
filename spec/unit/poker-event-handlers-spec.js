var PokerEventHandlers = require('../../lib/poker-event-handlers'),
    pokerUsers = require('../../lib/poker-users');

describe('postChatMessageListener', function() {
    describe('#setUser/#getUser', function() {
        it('should set and get a user', function() {
            var userMock = {};
            var broadcasterMock = {};
            var eventHandler = new PokerEventHandlers(broadcasterMock);

            eventHandler.setUser(userMock);
            expect(eventHandler.getUser()).toEqual(userMock);
        });
    });

    describe('#hasUser', function() {
        it('should be false when no user is set', function() {
            var broadcasterMock = {};
            var eventHandler = new PokerEventHandlers(broadcasterMock);

            expect(eventHandler.hasUser()).toBe(false);
        });

        it('should be true when a user is set', function() {
            var broadcasterMock = {};
            var userMock = {
                id: 'foobar'
            };
            var eventHandler = new PokerEventHandlers(broadcasterMock);
            eventHandler.setUser(userMock);

            expect(eventHandler.hasUser()).toBe(true);
        });
    });

    describe('#createCallback', function() {
        var broadcasterMock = {};
        var eventHandler = new PokerEventHandlers(broadcasterMock);

        it('should create a callback with accessible "this" variable for the callbacks', function() {
            var originalCallback = function() {
                return this;
            };
            var modifiedCallback = eventHandler.createCallback(originalCallback);
            expect(modifiedCallback()).toBe(eventHandler);
        });

        it('should pass arguments to the original function', function() {
            var originalCallback = function(id, name) {
                return arguments;
            };
            var modifiedCallback = eventHandler.createCallback(originalCallback);

            var expectedArguments = {
                0: 'foobar',
                1: 'bernd-das-brot'
            };
            expect(modifiedCallback(expectedArguments[0], expectedArguments[1])).toEqual(expectedArguments);
        });
    });

    describe('#registerAllForConnectionHandler', function() {
        it('should register all listeners', function() {
            var broadcasterMock = {};
            var connectionHandlerMock = {
                on: function() {}
            };
            spyOn(connectionHandlerMock, 'on');

            var eventHandler = new PokerEventHandlers(broadcasterMock);
            eventHandler.registerAllForConnectionHandler(connectionHandlerMock);

            expect(connectionHandlerMock.on).toHaveBeenCalledWith('login', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('get-initial-data', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('play-card', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('show-cards', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('reset-cards', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('post-userstory', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('post-chat-message', jasmine.any(Function));
            expect(connectionHandlerMock.on).toHaveBeenCalledWith('reset-room', jasmine.any(Function));
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

            var eventHandler = new PokerEventHandlers(broadcasterMock);
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
            var eventHandler = new PokerEventHandlers(broadcasterMock);
            var sendMessage = function() {
                eventHandler.postChatMessageListener({})
            };
            expect(sendMessage).toThrow('Cannot post a chat message without a valid user');
        });
    });

    describe('#loginListener', function() {
        var broadcasterMock = {};
        var eventHandler = new PokerEventHandlers(broadcasterMock);

        it('logs in a new user', function(done) {
            var connectionMock = {
                sendUTF: function() {}
            };
            spyOn(connectionMock, 'sendUTF');

            var connectionHandlerMock = {
                getConnection: function() {}
            };
            spyOn(connectionHandlerMock, 'getConnection').andReturn(connectionMock);

            var userName = 'Bernd das Brot';
            var userRole = 'scrumMaster';

            var messageData = {
                user: {
                    name: userName,
                    role: userRole
                }
            };
            eventHandler.loginListener(messageData, connectionHandlerMock);
            expect(connectionHandlerMock.getConnection).toHaveBeenCalled();

            eventHandler.on('login', function(newUser) {
                var expectedJsonMessage = {
                    type: 'login',
                    user: newUser
                };
                expect(connectionMock.sendUTF).toHaveBeenCalledWith(JSON.stringify(expectedJsonMessage));
                expect(eventHandler.getUser()).toBe(newUser);

                var expectedUsers = {};
                expectedUsers[newUser.id] = newUser;
                expect(pokerUsers.getAll()).toEqual(expectedUsers);

                // Cleanup
                pokerUsers.removeAll();
                done();
            });
        });
    });
});