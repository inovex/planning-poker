var user = require('../../lib/poker-user.js');

describe('User', function() {
    it('should create a new user', function(done) {
        user.create();

        user.on('user-created', function(newUser) {
            expect(newUser.id.length).toBe(40);
            done();
        });
    });
});