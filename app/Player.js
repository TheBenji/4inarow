var util         = require("util")
, EventEmitter = require("events").EventEmitter;

var Player = function(socket, playerId, enemyId) {
	var self = this;
	EventEmitter.call(this);

	this.playerId = playerId;
	this.enemyId = enemyId;
	this.game;
	this.plaer;

	this._socket = socket;

	this._socket.on('disconnect', function() {
		if(self.game) {
  			self.game.over((self.player+1)%2);
  		} else {
  			self.emit('disconnect');
  		}
	});

	this._socket.on('turn', function(data) {
		self.game.move(data, self.player);
	});
}

util.inherits(Player, EventEmitter);


Player.prototype.send = function(event, data) {
	this._socket.emit(event, data);
};

Player.prototype.id = function() {
	return this._socket.id;
}

module.exports = Player;