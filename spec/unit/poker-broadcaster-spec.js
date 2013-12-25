var pokerBroadcaster = require('../../lib/poker-broadcaster');

describe('poker-broadcaster', function() {
    it('should broadcast a JSON message as string', function() {
        var websocketServerMock = {
            broadcastUTF: function() {}
        };
        spyOn(websocketServerMock, 'broadcastUTF');
        pokerBroadcaster.init(websocketServerMock);

        var someRandomMessage = {
            name: 'Bernd',
            active: true,
            foo: 'bar'
        };
        pokerBroadcaster.broadcast(someRandomMessage)

        expect(websocketServerMock.broadcastUTF).toHaveBeenCalledWith(JSON.stringify(someRandomMessage));
    });
});