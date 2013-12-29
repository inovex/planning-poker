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
        });
        pokerCards.reset();
    });

    it('should not set the users card if cards are already shown', function() {
        pokerCards.show = true;
        pokerCards.setCard('egon', 5);
        expect(pokerCards.getAll()).toEqual({
            cards: {},
            show: true
        });
        pokerCards.reset();
    });

    it('should remove a users card', function() {
        pokerCards.setCard('bernd', 40);
        pokerCards.removeCard('bernd');
        expect(pokerCards.getAll()).toEqual({
            cards: {},
            show: false
        });
        pokerCards.reset();
    });

    it('should reset the card status', function() {
        pokerCards.setCard('horst', 5);
        pokerCards.setCard('heinz', 13);
        pokerCards.setCard('egon', 8);
        pokerCards.show = true;
        pokerCards.reset();
        expect(pokerCards.getAll()).toEqual({
            cards: {},
            show: false
        });
    });

    it('should get all the cards', function() {
        pokerCards.setCard('dan', 13);
        pokerCards.setCard('jon', 8);
        pokerCards.setCard('daphne', 20);
        expect(pokerCards.getAll()).toEqual({
            cards: {
                'dan': 13,
                'jon': 8,
                'daphne': 20
            },
            show: false
        })
    });
});