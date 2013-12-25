var pokerUser = require('../../lib/poker-user.js');

describe('User', function() {
    it('should create a new user', function(done) {
        var userDetails = {
            name: 'Horst Egon',
            role: 'developer'
        };

        var user = pokerUser.create(userDetails);

        user.on('created', function(newUser) {
            expect(newUser.id.length).toBe(40);
            expect(newUser.name).toEqual(userDetails.name);
            expect(newUser.role).toEqual(userDetails.role);
            done();
        });
    });
});