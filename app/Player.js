var util         = require("util")
, EventEmitter = require("events").EventEmitter;

var Player = function(socket, playerId, enemyId) {
	var self = this;
	EventEmitter.call(this);

	this.playerId = playerId;
	this.enemyId = enemyId;
	this.game;

	this._socket = socket;

	this._socket.on('disconnect', function() {
		if(self.game) {
  			self.game.over(self, false);
  		} else {
  			self.emit('disconnect');
  		}
	});

	this._socket.on('turn', function(data) {
		self.game.move(data);
	});

	this._socket.on('won', function() {
		self.game.over(self, true);
	})
}

util.inherits(Player, EventEmitter);


Player.prototype.send = function(event, data) {
	this._socket.emit(event, data);
};

Player.prototype.id = function() {
	return this._socket.id;
}

module.exports = Player;