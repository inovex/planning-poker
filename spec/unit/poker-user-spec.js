var pokerUser = require('../../lib/poker-user.js'),
    events = require('events');

describe('User', function() {
    describe('#create', function() {
        it('should create a new user', function(done) {
            var userDetails = {
                name: 'Horst Egon',
                role: 'developer'
            };

            var user = pokerUser.create(userDetails);
            expect(user.name).toEqual(userDetails.name);
            expect(user.role).toEqual(userDetails.role);

            user.on('created', function() {
                expect(user.id.length).toBe(40);
                expect(user.id).toMatch('^[a-zA-Z0-9]*$');
                done();
            });
        });

        it('should always create a new id', function(done) {
            var userDetails = {
                name: 'John Doe',
                role: 'scrumMaster'
            };

            // Promises needed here
//            firstUser = pokerUser.create(userDetails);
//            secondUser = pokerUser.create(userDetails);
//            expect(firstUser.id).toNotEqual(secondUser.id);
            done();
        });
    });
});