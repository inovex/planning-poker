var pokerConnection = require('../../lib/poker-connection');

describe('poker-connection', function() {
    it('should be initialized', function() {
        var currentUsers = [1,2,3];
        var carddisplay = [8,13,20];
        var connectionHandler = pokerConnection.getNewHandler();

        connectionHandler.init(currentUsers, carddisplay);

        expect(connectionHandler.pokerData).toEqual({
            "users": currentUsers,
            "carddisplay": carddisplay
        });
    });
});