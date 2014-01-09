var Game = function(player1, player2) {
	this.turn = 0;
	this.player1 = player1;
	this.player2 = player2;

	this.player1.game = this;
	this.player1.player = 0;
	this.player2.game = this;
	this.player2.player = 1;

	this.game = [];

	for(var i=0; i < 7; i++) {
		var row = [];
		for(var j=0; j < 6; j++) {
			row.push(false);
		}
		this.game.push(row);
	}

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

Game.prototype.over = function(winner) {
	this.sendBoth('winner', winner);
};

Game.prototype.move = function(data, player) {
	//Check if turn is possible and it's this players turn
	if(this.turn % 2 === player) {
		for (var t = 6;t>0;t--){
			if(!this.game[t][data.y]) {
				this.game[t][data.y] = player + 2;
				this.sendBoth('turn', data);
				
				if(this.horizontalWon(t,data.y) || this.verticalWon(t,data.y) || this.diagonalLtrWon(t,data.y) || this.diagonalRtlWon(t,data.y)){
					this.over(this.turn % 2);
				} else {
					this.newTurn();
				}
				break;
			}
		}
	}
};



Game.prototype.horizontalWon = function(i,j){
    for(var min=j-1;min>0;min--)if(!this.sameColor(i,min))break;					
    for(var max=j+1;max<8;max++)if(!this.sameColor(i,max))break;
    return max-min>4;
};
                            
Game.prototype.verticalWon = function(i,j){
    for(var max=i+1;max<7;max++)if(!this.sameColor(max,j))break;
    return max-i>3;
};                        
Game.prototype.diagonalLtrWon = function(i,j){
    for(var min=i-1,t=j-1;min>0;min--,t--)if(t<1||!this.sameColor(min,t))break;
    for(var max=i+1,t=j+1;max<7;max++,t++)if(t>7||!this.sameColor(max,t))break;
    return max-min>4;
};                   
Game.prototype.diagonalRtlWon = function(i,j){
    for(var min=i-1,t=j+1;min>0;min--,t++)if(t>7||!this.sameColor(min,t))break;
    for(var max=i+1,t=j-1;max<7;max++,t--)if(t<1||!this.sameColor(max,t))break;
    return max-min>4;
};

Game.prototype.sameColor = function(i,j){
    return (this.turn % 2) + 2 === this.game[i][j];
}, 

module.exports = Game;