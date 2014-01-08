(function(doc){
    var                      
    start = function(){
        finished = false;
        changePlayer();
    },			
    newGame = function(message){
        if (confirm(message)){
            start();
            forAllCells(emptyField);
        }
    },        
    element = function(id){
        return doc.getElementById(id);
    },
    value = function(el){
        return element(el).innerHTML;
    },                        
    cell = function(i,j){
        return element("c-"+i+"-"+j);
    },       
    forAllCells = function(action){
        for (var t = 1;t<7;t++){
            for (var counter2 = 1;counter2<8;counter2++){
                action(t,counter2);
            }
        }
    },                     
    sameColor = function(i,j){
        return testClass(i,j,players[current]);
    },                        
    changePlayer = function(){
        element("c").innerHTML = players[current];
    },                           
    horizontalWon = function(i,j){
        for(var min=j-1;min>0;min--)if(!sameColor(i,min))break;					
        for(var max=j+1;max<8;max++)if(!sameColor(i,max))break;
        return max-min>4;
    },
                                
    verticalWon = function(i,j){
        for(var max=i+1;max<7;max++)if(!sameColor(max,j))break;
        return max-i>3;
    },                        
    diagonalLtrWon = function(i,j){
        for(var min=i-1,t=j-1;min>0;min--,t--)if(t<1||!sameColor(min,t))break;
        for(var max=i+1,t=j+1;max<7;max++,t++)if(t>7||!sameColor(max,t))break;
        return max-min>4;
    },                      
    diagonalRtlWon = function(i,j){
        for(var min=i-1,t=j+1;min>0;min--,t++)if(t>7||!sameColor(min,t))break;
        for(var max=i+1,t=j-1;max<7;max++,t--)if(t<1||!sameColor(max,t))break;
        return max-min>4;
    },         
    colorField = function(i,j,color){
        cell(i,j).className = color;
    },                      
    emptyField = function(i,j){
        colorField(i,j,'');
    },
    testClass = function(i,j,value){
        return cell(i,j).className == value;
    },
    addCellBehavior = function(i,j){
        cell(i,j).onclick = function(j){
            return function(){
                if(!finished && current === me){
                    for (var t = 6;t>0;t--){
                        if(testClass(t,j,'')){
                            socket.emit('turn', {x: t, y: j});
                            if(horizontalWon(t,j) || verticalWon(t,j) || diagonalLtrWon(t,j) || diagonalRtlWon(t,j)){
                                socket.emit('won');
                            }
                            break;
                        }
                    }
                }
            }
        }(j);
    },
    players = [value("a"),value("b")],         
    current = 0,
    me = 0,
    newGameMessage = value("n"),
    wonMessage = value("w"),
    finished = true,
    socket = io.connect("http://"+window.location.hostname);
        
    socket.on('connected', function (data) {
        //use -1 for random
        socket.emit('player', {myId: -1, enemyId: -1});
    });

    socket.on('started', function (data) {
        finished = false;
        me = data;
        element("msg").innerHTML = 'You are the ' + players[me]  +' player';
        element("turn").style.display = 'block';
    });

    socket.on('winner', function (data) {
        finished = true;
        alert(players[data]  +' player won!');
    });

    socket.on('newTurn', function (data) {
        current = data;
        changePlayer();
    });

    socket.on('turn', function(data) {
        colorField(data.x,data.y,players[current]);
    });

    start();
    forAllCells(addCellBehavior);
    element("r").onclick = function(){
        newGame(newGameMessage)
    };
})(document);

