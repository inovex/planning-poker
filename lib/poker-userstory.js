module.exports.currentUserstory = '';

module.exports.set = function(userstory) {
	this.currentUserstory = userstory;
};

module.exports.get = function() {
	return this.currentUserstory;
};

module.exports.remove = function() {
	this.set('');
};