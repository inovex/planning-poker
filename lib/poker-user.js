var EventEmitter = require('events').EventEmitter,
    crypto = require('crypto'),
    util = require('util');;

var PokerUser = function() {};
util.inherits(PokerUser, EventEmitter);

PokerUser.prototype.create = function() {
    var user = {};
    this._createId();

    this.on('id-created', function(userId) {
        user.id = userId;
        this.emit('user-created', user, this);
    });
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

module.exports = new PokerUser();