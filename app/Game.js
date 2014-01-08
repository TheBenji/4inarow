//Keep in mind: Really easy to cheat at the moment since the whole logic is still on the client-side

var Game = function(player1, player2) {
	this.turn = 0;
	this.player1 = player1;
	this.player2 = player2;

	this.player1.game = this;
	this.player2.game = this;

}

Game.prototype.start = function() {
  	console.log('Game started');
  	this.player1.send('started', 0);
  	this.player2.send('started', 1);

  	this.newTurn();
};

Game.prototype.sendBoth = function(event, data) {
	this.player1.send(event, data);
	this.player2.send(event, data);
};

Game.prototype.newTurn = function() {
	this.turn++;
	this.sendBoth('newTurn', this.turn % 2);
};

Game.prototype.over = function(player, won) {
	var winner = 0;
	if((player.id() == this.player2.id() && won) || player.id() == this.player1.id() && !won)  {
		winner = 1;
	}

	this.sendBoth('winner', winner);
};

Game.prototype.move = function(data) {
	this.sendBoth('turn', data);
	this.newTurn();
};

module.exports = Game;