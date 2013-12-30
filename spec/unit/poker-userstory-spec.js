var pokerUserstory = require('../../lib/poker-userstory');

describe('poker-userstory', function() {
    describe('#set/#get', function() {
        it('should set and get a userstory', function() {
            var someUserstory = 'This is an example userstory which has no useful information at all';
            pokerUserstory.set(someUserstory);
            expect(pokerUserstory.get()).toEqual(someUserstory);
            pokerUserstory.remove();
        });
    });

    describe('#remove', function() {
        it('should remove a userstory', function() {
            var someUserstory = 'lorem ipsum';
            pokerUserstory.set(someUserstory);
            pokerUserstory.remove();
            expect(pokerUserstory.get()).toEqual('');
        });
    });
});