module.exports.websocketServer = null;

module.exports.init = function(websocketServer) {
	this.websocketServer = websocketServer;
};

module.exports.broadcast = function(message) {
	this.websocketServer.broadcastUTF(JSON.stringify(message));
};