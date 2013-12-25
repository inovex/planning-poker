var EventEmitter = require('events').EventEmitter,
    crypto = require('crypto'),
    util = require('util');

var PokerUser = function(name, role) {
    this.name = name;
    this.role = role;

    this._createId();
    this.on('id-created', function(userId) {
        this.id = userId;
        this.emit('created', this, this);
    }, this);
};
util.inherits(PokerUser, EventEmitter);

PokerUser.prototype.name = null;
PokerUser.prototype.role = null;

PokerUser.create = function(userDetails) {
    return new PokerUser(userDetails.name, userDetails.role);
};

PokerUser.prototype._createId = function() {
    var me = this;

    // Create random id for user
    sha1sum = crypto.createHash('sha1');
    crypto.randomBytes(256, function(exception, buffer) {
        if (exception) throw exception;
        sha1sum.update(buffer);
        me.emit('id-created', sha1sum.digest('hex'), me);
    });
};

module.exports = PokerUser;