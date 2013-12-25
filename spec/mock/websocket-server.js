module.exports = {
    _broadcastedMessage: {},

    getBroadcastedJsonMessage: function() {
        return this._broadcastedMessage;
    },

    broadcastUTF: function(message) {
        this._broadcastedMessage = message;
    }
};