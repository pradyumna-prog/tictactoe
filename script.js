let gameStatus = ['','','','','','','','','']
let turn = false
let result = false
let dark = false;

function switchTheme(){
    dark = !dark
    if(dark){
        //dark mode
        document.body.style = "background-color: #222831; color: white;";
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px wheat; border: 1px solid wheat;");
        try{
            document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
        }catch(error){}
    }
    else{
        //day mode
        document.body.style = "background-color: #f4f6ff";
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px #333333; border: 1px solid #333333;");
        try{
            document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    
        }catch(error){}
    }
    
}


function cellClickHandler(id){
    gameStatus[id] = turn ? 'X': 'O'
    turn = !turn
    updateBoard();
    document.getElementById(id).style.pointerEvents = 'none';
    document.getElementById('gameResult').innerHTML = (turn ? 'X': 'O')+'\'s Turn';
    result = checkWinner();
    if(result == true){
        showResult(gameStatus[id]);
    }
    else if(result == -1){
        showResult("Tie");
    }    
}

function showResult(str){
    document.getElementById('gameResult').innerHTML=""
    
    let msg = document.createElement("p");
    msg.innerHTML = (str == "Tie") ? "Game Tied 😕" : str+" Won 👏";
    document.getElementById('gameResult').appendChild(msg);   

    let btnRestart = document.createElement("button");
    btnRestart.innerHTML = "Restart";
    btnRestart.className = "btnRestart";
    btnRestart.addEventListener('click', startNewGame);
    document.getElementById('gameResult').appendChild(btnRestart);   
    
    if(dark)
        document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
    else
        document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    

    gameStatus.forEach( (element,index) => {
        document.getElementById(index).style.pointerEvents = 'none';
    });
}

function startNewGame(){
    gameStatus = ['','','','','','','','','']
    turn = false
    updateBoard();
    document.getElementById("gameResult").innerHTML = "";
    gameStatus.forEach( (element,index) => {
        document.getElementById(index).style.pointerEvents = 'auto';
    });
}

function updateBoard(){
    gameStatus.forEach( (element,index) => {
        document.getElementById(index).innerHTML = element;
    });
}

function checkWinner(){
    //horizontal check
    if(gameStatus[0] == gameStatus[1] && gameStatus[1] == gameStatus[2] && gameStatus[0] != '')
        return true
    if(gameStatus[3] == gameStatus[4] && gameStatus[4] == gameStatus[5] && gameStatus[3] != '')
        return true
    if(gameStatus[6] == gameStatus[7] && gameStatus[7] == gameStatus[8] && gameStatus[6] != '')
        return true

    //vertical check
    if(gameStatus[0] == gameStatus[3] && gameStatus[3] == gameStatus[6] && gameStatus[0] != '')
        return true
    if(gameStatus[1] == gameStatus[4] && gameStatus[4] == gameStatus[7] && gameStatus[1] != '')
        return true
    if(gameStatus[2] == gameStatus[5] && gameStatus[5] == gameStatus[8] && gameStatus[2] != '')
        return true

    //diagonal check
    if(gameStatus[0] == gameStatus[4] && gameStatus[4] == gameStatus[8] && gameStatus[4] != '')
        return true
    if(gameStatus[2] == gameStatus[4] && gameStatus[4] == gameStatus[6]  && gameStatus[4] != '')
        return true
    if(gameStatus.indexOf('')==-1)
        return -1
    return false
}