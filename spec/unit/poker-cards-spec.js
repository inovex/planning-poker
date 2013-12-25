var pokerCards = require('../../lib/poker-cards');

describe('poker-cards', function() {
    it('should set a card for a user if cards are not already shown', function() {
        expect(pokerCards.getAll()).toEqual({
            cards: {},
            show: false
        });

        pokerCards.setCard('foobar', 13);
        expect(pokerCards.getAll()).toEqual({
            cards: {
                'foobar': 13
            },
            show: false
        });
        pokerCards.reset();
    });

    it('should update the users card value', function() {
        pokerCards.setCard('heinz', 13);
        pokerCards.setCard('heinz', 8);
        expect(pokerCards.getAll()).toEqual({
            cards: {
                'heinz': 8
            },
            show: false
        })
    });
});