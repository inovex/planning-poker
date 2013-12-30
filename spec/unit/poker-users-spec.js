var pokerUsers = require('../../lib/poker-users');

describe('poker-users', function() {
    describe('#add', function() {
        it('should add a user', function() {
            var someUser = {
                id: 'heinz',
                name: 'Heinz Georg'
            };
            pokerUsers.add(someUser);

            expect(pokerUsers.currentUsers).toEqual({'heinz': someUser});
            pokerUsers.removeAll();
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
            pokerUsers.removeAll();
        });
    });

    describe('#remove', function() {
        it('should remove a user by his id', function() {
            var user1 = {
                id: 'foobar',
                name: 'First user'
            };
            pokerUsers.add(user1);
            pokerUsers.remove('foobar');
            expect(pokerUsers.currentUsers).toEqual({});
            pokerUsers.removeAll();
        });
    });

    describe('#removeAll', function() {
        it('should remove all users', function() {
            var user1 = {
                id: 'user1',
                name: 'First user',
                role: 'developer'
            };

            var user2 = {
                id: 'user2',
                name: 'Second user',
                role: 'developer'
            };
            pokerUsers.add(user1);
            pokerUsers.add(user2);
            pokerUsers.removeAll();
            expect(pokerUsers.currentUsers).toEqual({});
        });
    });

    describe('#getAll', function() {
        it('should return all users', function() {
            var user1 = {
                id: 'foobar',
                name: 'First user'
            };
            pokerUsers.add(user1);
            expect(pokerUsers.getAll()).toEqual({'foobar': user1});
            pokerUsers.removeAll();
        });
    });
});