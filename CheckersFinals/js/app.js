let table;
let boardSize = 8;
let gameData; 
let selectedChecker;
let selectedCell; 
let winner;
let div = document.createElement('div');
let turn = document.createElement('div');
let lastCheckerType;
const BLACK_PLAYER = 'Black';
const WHITE_PLAYER = 'White';
const GAME_CHECKERS = [];  
const TABLE_ID = 'table';
const GAME_OVER = 'game over';
let checkerCanEat = [];

const checkForEats = () => {

  // As a defalut all checkers are disabled.
  // if no eat can be made all checker can move.
  //if an eat is available only the one checker who can eat can move.

  checkerCanEat = [];
  const whiteMoves = [];
  const blackMoves = []; 
  
  for(let checker of gameData.checkers){

    let possibleMoves;

    if(checker.type === 'pawn'){
     possibleMoves = checker.getPossiblePawnMoves(gameData) 
    }else if(checker.type === 'berserker'){
     possibleMoves = checker.getPossibleBerserkerMoves(gameData)
    }else if(checker.type === 'queen'){
     possibleMoves = checker.getPossibleQueenMoves(gameData)   
    }
    
    if(!possibleMoves) return; 

    if(checker.player === WHITE_PLAYER && possibleMoves.length !== 0){ 
      whiteMoves.push(possibleMoves);
    };
    if(checker.player === BLACK_PLAYER && possibleMoves.length !== 0){ 
      blackMoves.push(possibleMoves);
    };
    if(checker.canEat === true && checker.player === gameData.turn){
     checkerCanEat.push(checker);
    };
  }
  
  // check if game over.
  gameData.checkForMovesEnd(whiteMoves, blackMoves);
 
  if(checkerCanEat.length === 0){
    for(let checker of gameData.checkers){
      checker.canMove = true;
    }
  }else{
    for(let checker of gameData.checkers){
      checker.canMove = false; 
    }
  };

  checkerCanEat.forEach(checker => {
    checker.canMove = true;
  }); 
  
};

const removeMovmentWhenCanEat = () => {

  for(let i = 0; i < boardSize; i++){
    for(let j = 0; j < boardSize; j++){
      if(table.rows[i].cells[j].classList.contains('eat')){
        for(let i = 0; i < boardSize; i++){
          for(let j = 0; j < boardSize; j++){
            table.rows[i].cells[j].classList.remove('movement');
          }
        }
      };
    }
  }
};

const clickOnCell = (row, col) => {
   
  // shows current players turn. 
  document.body.appendChild(turn); 
  turn.classList.add('turn');
  turn.innerHTML = `${gameData.turn} player turn`
  
  // determine wich checker can move.
  checkForEats(); 
  
  if(selectedChecker === undefined){
    
    gameData.resetMarks();
    gameData.showPossibleMoves(row, col);
    removeMovmentWhenCanEat();

  } else {
    
    if(selectedChecker.player === gameData.turn && selectedChecker.canMove === true){  

      if(selectedChecker.type === 'berserker'){
        
        if(selectedChecker.getPossibleBerserkerMoves(gameData).length === 0){
          selectedChecker.type = lastCheckerType;
          selectedChecker.canEat = false;  
          gameData.turn = selectedChecker.getOpponent()
          selectedChecker = undefined; 
        };
      };
      
      if(gameData.tryMove(row, col)){
        selectedChecker = undefined;
        
        if(gameData.tryQueen()) return;

        gameData.switchTurn();
        boardInit();
        return
      };
      
      if(gameData.tryEat(row, col)){
        gameData.checkForCheckersEnd();

        // reset all checker incase multiple checkers could eat the same enemy.
        for(let checker of gameData.checkers){

          checker.canEat = false; 
        }
        gameData.tryBerserker();
        boardInit();
        return
      };

      gameData.checkForCheckersEnd(); 
      gameData.resetMarks(); 
      removeMovmentWhenCanEat();
      boardInit();  
      selectedChecker = undefined; 
    
    }else{
      
      selectedChecker = undefined;  
      gameData.resetMarks(); 
      gameData.showPossibleMoves(row, col);
      removeMovmentWhenCanEat();
    }; 
  };
};

const addImages = () => {

  for(let checker of gameData.checkers){
    let image = document.createElement('img');
    image.src = `./img/${checker.player}_checker.png`;
    table.rows[checker.row].cells[checker.col].appendChild(image);
  }

};

const getNewCheckers = () => {
  
  for(let row = 0; row < boardSize; row++){

    for(let col = 0; col < boardSize; col++){

      // if( row === 3 && col % 2 === 0 || row === 2 && col % 2 !== 0){
      if(row % 2 === 0 && col % 2 !== 0 && row < 3 || row === 1 && col % 2 === 0 ){ 
        GAME_CHECKERS.push(new Checker(row, col, WHITE_PLAYER, 'pawn'));    
      };
      // if(row === 4 && col % 2 !== 0 || row === 5 && col % 2 === 0){
      if(row % 2 !== 0 && col % 2 === 0 && row > 4 || row === 6 && col % 2 !== 0){

        GAME_CHECKERS.push(new Checker(row, col, BLACK_PLAYER, 'pawn')); 
      };  
    }
  }
  
  let id = 0;
  for(let checker of GAME_CHECKERS){
    checker.id = id;
    checker.canEat = false;
    id++; 
  }
};

const boardInit = () => {
  
  if(table !== undefined){
    table.remove();
  }
  
  table = document.createElement('table');
  table.id = TABLE_ID;
  document.body.appendChild(table); 
  for(let row = 0; row < boardSize; row++){

    const rowElement = table.insertRow();
    rowElement.id = row;

    for(let col = 0; col < boardSize; col++){
  
      const cellElement = rowElement.insertCell();
      cellElement.id = `cell_${row}_${col}`; 
      cellElement.addEventListener('click', () => clickOnCell(row, col));

      if(row % 2 !== 0 && col % 2 === 0 || row % 2 === 0 && col % 2 !== 0){
        cellElement.classList.add('dark-cell'); 
      };

      if(row % 2 !== 0 && col % 2 !== 0 || row % 2 === 0 && col % 2 === 0){
        cellElement.classList.add('white-cell'); 
      }; 
    }
  }
  addImages();
};

const gameInit = () => {
  
  getNewCheckers();
  gameData = new GameData(GAME_CHECKERS, WHITE_PLAYER);
  boardInit();
};

gameInit(); 



