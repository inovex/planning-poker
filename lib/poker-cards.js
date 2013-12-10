module.exports.show = false;

module.exports.carddisplay = {
    cards: {}
};

module.exports.setCard = function(userId, cardValue) {
	// Allow only if cards are not already shown
	if (!this.show) {
		this.carddisplay.cards[userId] = cardValue
		return true;
	}
	return false;
};

module.exports.removeCard = function(userId) {
	this.carddisplay.cards[userId] = null;
    delete this.carddisplay.cards[userId];
};

module.exports.reset = function() {
	this.carddisplay = {
        cards: {}
    };
    this.show = false;
};

module.exports.getAll = function() {
	return {
		cards: this.carddisplay.cards,
		show: this.show
	};
};