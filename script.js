let gameStatus;
let turn;
let dark;
let result, player;

if(new Date().getHours() > 6 && new Date().getHours() < 18){
    dark = false;
}
else{
    dark = true;
}

function switchTheme(){
    if(dark){
        //dark mode
        document.body.style = "background-color: #222831; color: white;";
        document.getElementById('labelSwitch').style.background = '#f9d71c';
        document.getElementById("linkedin").setAttribute('src', './imgs/linkedin-light.png');
        document.getElementById("github").setAttribute('src', './imgs/github-light.png'); 
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px wheat; border: 1px solid wheat;");
        try{
            document.querySelectorAll('.playerSelect').forEach(btn => btn.style = "background-color: #222831; color:white;");   
            document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
        }catch(error){console.log(error)}
    }
    else{
        //day mode
        document.body.style = "background-color: #f4f6ff";
        document.getElementById('labelSwitch').style.background = '#222831';
        document.getElementById("linkedin").setAttribute('src', './imgs/linkedin-dark.png');
        document.getElementById("github").setAttribute('src', './imgs/github-dark.png'); 
        document.querySelectorAll('.cell').forEach(cell => cell.style = "box-shadow: 0 0 0 1px #333333; border: 1px solid #333333;");
        try{
            document.querySelectorAll('.playerSelect').forEach(btn => btn.style = "background-color: #f4f6ff; color:black");
            document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    
        }catch(error){console.log(error)}
    }
    dark = !dark
}

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

function showIntro(){
    pauseClick();
    let intro = [ 
        ['T','I','C',],
        ['T','A','C',],
        ['T','O','E'] ];
    let id = 0, speed = 300;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            let char = intro[x][y];
            let el = document.getElementById(id);
            setTimeout(function(char) {
                el.innerHTML = char;
            }, speed * id, char);
            id++;
        }
    }
}

function flip(){
    document.getElementById("board").style.transform = 'rotateY(360deg)';
    document.getElementById("board").style.webkitTransform = 'rotateY(360deg)';
}

function setupGame(){
    gameStatus = [ ['','','',],
        ['','','',],
        ['','',''] ];
    turn = false;
    dark = false;
    updategameStatus();
    document.getElementById("gameResult").innerHTML = "";
    document.querySelector(".gameTypeSelect").style = "";
}

function againstComputer(){
    flip();
    document.querySelector(".gameTypeSelect").style = "display: none";
    player = "ai";
    startNewGame();
}

function againstPlayer(){
    flip();
    document.querySelector(".gameTypeSelect").style = "display: none";
    player = "human";
    startNewGame();
}

function cellClickHandler(id){
    let x = parseInt(id/3), y = id%3;
    gameStatus[x][y] = turn ? 'O': 'X'
    if(player == "human")
        turn = !turn
    updategameStatus();
    document.getElementById(id).style.pointerEvents = 'none';
    document.getElementById('gameResult').innerHTML = (turn ? 'O': 'X')+'\'s Turn';
    result = checkWinner();
    if(result == 0 && !isMovesLeft()){
        showResult("Tie");
        player = '';
    }
    else if(result == 10 || result == -10){
        console.log(result)
        winner = (result == 10) ? 'O' : 'X';
        showResult(winner);
        player = '';
    }
    if(player=="ai"){
        document.getElementById('gameResult').innerHTML ='O\'s Turn';
        setTimeout( () => {computerSelectMove();}, 500);
    }
}

function computerSelectMove(){
    const [x,y] = findBestMove()
    gameStatus[x][y] = 'O';
    updategameStatus();
    id = (x*3+y)
    document.getElementById(id).style.pointerEvents = 'none';
    document.getElementById('gameResult').innerHTML ='X\'s Turn';
    result = checkWinner();
    if(result == 0 && !isMovesLeft()){
        showResult("Tie");
        player = '';
    }
    else if(result == 10 || result == -10){
        symbol = (result == 10) ? 'O' : 'X';
        winner = symbol == 'O' ? "Computer" : "You";
        showResult(winner);
        player = '';
    }
}

function isMovesLeft(){
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            if(gameStatus[x][y] == '')
                return true;
        }
    }
    return false;
}

function minimax(gameStatus, depth, isMax){
    score = checkWinner();
    if(score == 10) return score;
    if(score == -10) return score;
    if(isMovesLeft() == false)  return 0;

    // if this is maximizer's move
    if(isMax){
        best = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < 3; i++) 
        { 
            for (let j = 0; j < 3; j++) 
            { 
                // Check if cell is empty 
                if (gameStatus[i][j] == '') 
                { 
                    // Make the move 
                    gameStatus[i][j] = 'O'; 
  
                    // Call minimax recursively and choose 
                    // the maximum value 
                    best = Math.max(best, minimax(gameStatus,  
                                    depth + 1, !isMax)); 
  
                    // Undo the move 
                    gameStatus[i][j] = ''; 
                } 
            } 
        }
        return best;
    }
    // if this is minimizer's move
    else{
        let best = Number.POSITIVE_INFINITY; 
  
        // Traverse all cells 
        for (let i = 0; i < 3; i++) 
        { 
            for (let j = 0; j < 3; j++) 
            { 
                // Check if cell is empty 
                if (gameStatus[i][j] == '') 
                { 
                    // Make the move 
                    gameStatus[i][j] = 'X'; 
  
                    // Call minimax recursively and choose 
                    // the minimum value 
                    best = Math.min(best, minimax(gameStatus,  
                                    depth + 1, !isMax)); 
  
                    // Undo the move 
                    gameStatus[i][j] = ''; 
                } 
            } 
        } 
        return best; 
    }
}
function findBestMove() 
{ 
    let bestVal = -1000; 
    let x = -1, y = -1;
    // Traverse all cells, evaluate minimax function  
    // for all empty cells. And return the cell  
    // with optimal value. 
    for (let i = 0; i < 3; i++) 
    { 
        for (let j = 0; j < 3; j++) 
        { 
            // Check if cell is empty 
            if (gameStatus[i][j] == '') 
            { 
                // Make the move 
                gameStatus[i][j] = 'O'; 
  
                // compute evaluation function for this 
                // move. 
                let moveVal = minimax(gameStatus, 0, false); 
  
                // Undo the move 
                gameStatus[i][j] = ''; 
  
                // If the value of the current move is 
                // more than the best value, then update 
                // best/ 
                if (moveVal > bestVal) 
                { 
                    x = i; 
                    y = j; 
                    bestVal = moveVal; 
                } 
            } 
        } 
    } 
    
    return [x,y]; 
}

function startNewGame(){
    gameStatus = [ ['','','',],
        ['','','',],
        ['','',''] ]
    turn = false
    updategameStatus();
    resumeClick();
    document.getElementById("gameResult").innerHTML = "";
}

function updategameStatus(){
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
        if(gameStatus[x][0] == gameStatus[x][1] && gameStatus[x][1] == gameStatus[x][2] && gameStatus[x][0] != ''){
            if(gameStatus[x][0] == 'O') return +10;
            else if(gameStatus[x][0] == 'X') return -10;
        }
    }
    //vertical check
    for(let y=0; y<3; y++){
        if(gameStatus[0][y] == gameStatus[1][y] && gameStatus[1][y] == gameStatus[2][y] && gameStatus[0][y] != ''){
            if(gameStatus[0][y] == 'O') return +10;
            else if(gameStatus[0][y] == 'X') return -10;
        }
    }
    //diagonal check
    if(gameStatus[0][0] == gameStatus[1][1] && gameStatus[1][1] == gameStatus[2][2] && gameStatus[1][1] != ''){
        if(gameStatus[1][1] == 'O') return +10;
        else if(gameStatus[1][1] == 'X') return -10;
    }
    if(gameStatus[0][2] == gameStatus[1][1] && gameStatus[1][1] == gameStatus[2][0] && gameStatus[1][1] != ''){
        if(gameStatus[1][1] == 'O') return +10;
        else if(gameStatus[1][1] == 'X') return -10;
    }

    //game is tie
    return 0;
}

function showResult(str){
    document.getElementById('gameResult').innerHTML=(str == "Tie") ? "Game Tied 😕&nbsp;" : str+" Won 👏&nbsp;";
    
    let btnRestart = document.createElement("button");
    btnRestart.innerHTML = "Restart";
    btnRestart.className = "btnRestart";
    btnRestart.addEventListener('click', setupGame);
    document.getElementById('gameResult').appendChild(btnRestart);   
    
    if(!dark){
        document.querySelector('.btnRestart').style = "background-color: #393e46; color: white;";    
    }
    else{
        document.querySelector('.btnRestart').style = "background-color: #e1ffc2; color: black;";    
    }
        
    let k = 0;
    for(let x=0; x<3; x++){
        for(let y=0; y<3; y++){
            document.getElementById(k++).style.pointerEvents = 'none';
        }
    }
}