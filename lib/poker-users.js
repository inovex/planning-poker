module.exports.currentUsers = {};

module.exports.remove = function(userId) {
	this.currentUsers[userId] = null;
    delete this.currentUsers[userId];
};

module.exports.removeAll = function() {
    this.currentUsers = {};
};

module.exports.add = function(user) {
	this.currentUsers[user.id] = user;
};

module.exports.getAll = function() {
	return this.currentUsers;
};