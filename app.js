var connect = require('connect')
  , http = require('http')
  , io = require('socket.io')
  , Game = require('./app/Game.js')
  , Player = require('./app/Player.js')
  , allPlayer = [];

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'));

var server = http.createServer(app);

io = io.listen(server);
io.set('log level', 2);
server.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.emit('connected', 'success');
  socket.on('player', function (data) {
    var p = new Player(socket, data.myId, data.enemyId);
    var en = findEnemey(data.enemyId, data.myId);

    if(en >= 0) {
      //Found someone wuhhh
      var game = new Game(p, allPlayer[en]);
      allPlayer.splice(en, 1);
      game.start();
    } else {
      allPlayer.push(p);
      
      //In case a Player disconnects while waiting
      p.on('disconnect', function() {
        var m = allPlayer.indexOf(this);
        if(m >= 0) {
          allPlayer.splice(m, 1);
        }
      });

    }
  });
});

function findEnemey(enId, myId) {
  var found = false;
  for(var i = 0; i < allPlayer.length; i++) {
    if (allPlayer[i].playerId === myId && allPlayer[i].enemyId === enId) {
      found = true;
      break;
    }
  }
  if(found)
    return i;
  return -1;
}