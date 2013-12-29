var pokerUsers = require('../../lib/poker-users');

describe('poker-users', function() {
    it('should add a user', function() {
        var someUser = {
            id: 'heinz',
            name: 'Heinz Georg'
        };
        pokerUsers.add(someUser);

        expect(pokerUsers.currentUsers).toEqual({'heinz': someUser});
        pokerUsers.currentUsers = {};
    });

    it('should add multiple users', function() {
        var user1 = {
            id: 'user1',
            name: 'First user'
        };

        var user2 = {
            id: 'user2',
            name: 'Second user'
        };

        var user3 = {
            id: 'user3',
            name: 'Third user'
        };

        pokerUsers.add(user1);
        pokerUsers.add(user2);
        pokerUsers.add(user3);
        expect(pokerUsers.currentUsers).toEqual({
            'user1': user1,
            'user2': user2,
            'user3': user3
        });
        pokerUsers.currentUsers = {};
    });
});