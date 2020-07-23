let gameStatus;
let turn;
let dark;
let result, player;

function pauseClick(){
    let k = 0;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            document.getElementById(k++).style.pointerEvents = 'none';
        }
    }
}

function resumeClick(){
    let k = 0;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            document.getElementById(k++).style.pointerEvents = 'auto';
        }
    }
}

function setupGame(){
    gameStatus = [ ['','','',],
        ['','','',],
        ['','',''] ];
    turn = false;
    dark = false;
    pauseClick();
    updateBoard();
    document.getElementById("gameResult").innerHTML = "";
    document.querySelector(".gameTypeSelect").style = "";
}

function switchTheme(){
    dark = !dark
    if(dark){
        //dark mode
        document.body.style = "background-color: #222831; color: white;";
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px wheat; border: 1px solid wheat;");
        try{
            document.querySelectorAll('.playerSelect').forEach(btn => btn.style = "background-color: #222831; color:white;");   
            document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
        }catch(error){console.log(error)}
    }
    else{
        //day mode
        document.body.style = "background-color: #f4f6ff";
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px #333333; border: 1px solid #333333;");
        try{
            document.querySelectorAll('.playerSelect').forEach(btn => btn.style = "background-color: #f4f6ff; color:black");
            document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    
        }catch(error){console.log(error)}
    }
}

function againstComputer(){
    document.querySelector(".gameTypeSelect").style = "visibility: hidden;";
    player = "ai";
    startNewGame();
}

function againstPlayer(){
    document.querySelector(".gameTypeSelect").style = "visibility: hidden;";
    player = "human";
    startNewGame();
}

function cellClickHandler(id){
    let x = parseInt(id/3), y = id%3;
    gameStatus[x][y] = turn ? 'O': 'X'
    if(player == "human")
        turn = !turn
    updateBoard();
    document.getElementById(id).style.pointerEvents = 'none';
    document.getElementById('gameResult').innerHTML = (turn ? 'O': 'X')+'\'s Turn';
    result = checkWinner();
    if(result == -1){
        showResult("Tie");
        player = '';
    }
    else if(result != 0){
        showResult(result);
        player = '';
    }
    if(player=="ai"){
        setTimeout( () => {computerSelectMove();}, 500);
    }
        
}

function computerSelectMove(){
    availableSpots = getAvailableSpots();
    const [x,y] = availableSpots[Math.floor( Math.random() * availableSpots.length) ]
    gameStatus[x][y] = 'O'
    updateBoard();
    result = checkWinner();
    if(result == -1){
        showResult("Tie");
    }
    else if(result != 0){
        showResult(result);
    }
}

function getAvailableSpots(){
    let availableSpots = []
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            if(gameStatus[x][y] == '')
                availableSpots.push([x,y])
        }
    }
    return availableSpots;
}

function startNewGame(){
    gameStatus = [ ['','','',],
        ['','','',],
        ['','',''] ]
    turn = false
    updateBoard();
    resumeClick();
    document.getElementById("gameResult").innerHTML = "";
}

function updateBoard(){
    let k = 0;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            document.getElementById(k++).innerHTML = gameStatus[x][y];
        }
    }
}

function checkWinner(){
    //horizontal check
    for(let x=0; x<3; x++){
        if(gameStatus[x][0] == gameStatus[x][1] && gameStatus[x][1] == gameStatus[x][2] && gameStatus[x][0] != '')
            return gameStatus[x][0];
    }
    //vertical check
    for(let y=0; y<3; y++){
        if(gameStatus[0][y] == gameStatus[1][y] && gameStatus[1][y] == gameStatus[2][y] && gameStatus[0][y] != '')
            return gameStatus[y][0];
    }
    //diagonal check
    if(gameStatus[0][0] == gameStatus[1][1] && gameStatus[1][1] == gameStatus[2][2] && gameStatus[1][1] != '')
        return gameStatus[1][1];
    if(gameStatus[0][2] == gameStatus[1][1] && gameStatus[1][1] == gameStatus[2][0] && gameStatus[1][1] != '')
        return gameStatus[1][1];

    //if game has not finished
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            if(gameStatus[x][y] == '')
                return 0;
        }
    } 
    //game is tie
    return -1;
}

function showResult(str){
    document.getElementById('gameResult').innerHTML=""
    
    let msg = document.createElement("p");
    msg.innerHTML = (str == "Tie") ? "Game Tied 😕" : str+" Won 👏";
    document.getElementById('gameResult').appendChild(msg);   

    let btnRestart = document.createElement("button");
    btnRestart.innerHTML = "Restart";
    btnRestart.className = "btnRestart";
    btnRestart.addEventListener('click', setupGame);
    document.getElementById('gameResult').appendChild(btnRestart);   
    
    if(dark)
        document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
    else
        document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    
    let k = 0;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            document.getElementById(k++).style.pointerEvents = 'none';
        }
    }
}