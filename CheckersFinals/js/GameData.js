class GameData {
  constructor(checkers, firstPlayer){
    this.checkers = checkers;
    this.turn = firstPlayer;
  }

  getChecker(row, col) {

    for(let checker of this.checkers){
      if(checker.row === row && checker.col === col){
        return checker;
      };
    }
  };

  resetMarks = () => {

    for(let row = 0; row < boardSize; row++){
      for(let col = 0; col < boardSize; col++){
        table.rows[row].cells[col].classList.remove('selected');
        table.rows[row].cells[col].classList.remove('movement'); 
        table.rows[row].cells[col].classList.remove('eat');  
      } 
    }
  };

  showPossibleMoves = (row, col) => {
    let possibleMoves;
    let checker = gameData.getChecker(row, col);
    if(!checker) return;
    
    if(checker.type === 'pawn'){
      possibleMoves = checker.getPossiblePawnMoves(gameData);
    }else if(checker.type === 'berserker'){
      possibleMoves = checker.getPossibleBerserkerMoves(gameData); 
    }else if(checker.type === 'queen'){ 
      possibleMoves = checker.getPossibleQueenMoves(gameData); 
    };
     
    for(let move of possibleMoves){

      if(checker.player === gameData.turn){

        if(gameData.getChecker(move[0], move[1]) === undefined){
          table.rows[move[0]].cells[move[1]].classList.add('movement');
        };
      };
    } 

    selectedCell = table.rows[checker.row].cells[checker.col];
    selectedCell.classList.add('selected');
    selectedChecker = checker; 
  };
  
  removeChecker(row, col) {

    for(let i = 0; i < this.checkers.length; i++){

      let checker = this.checkers[i];
      if(checker.row === row && checker.col === col){

        this.checkers.splice(i, 1);
      };
    }
  };
  
  tryMove(row, col) { 

    if(table.rows[row].cells[col].classList.contains('movement')){
  
      selectedChecker.row = row;
      selectedChecker.col = col; 
      return true;
    };
    return false;
  };

  tryEat(row, col) {

    if(table.rows[row].cells[col].classList.contains('eat')){
      if(selectedChecker !== undefined){
        let lastRowPosition = selectedChecker.row;
        let lastColPosition = selectedChecker.col;
        selectedChecker.row = row;
        selectedChecker.col = col;
        if(selectedChecker.type === 'queen'){

          if(selectedChecker.row > lastRowPosition && selectedChecker.col > lastColPosition){
            gameData.removeChecker(selectedChecker.row - 1, selectedChecker.col - 1);
            return true;
          }
          if(selectedChecker.row > lastRowPosition && selectedChecker.col < lastColPosition){
            gameData.removeChecker(selectedChecker.row - 1, selectedChecker.col + 1);
            return true;
          }
          if(selectedChecker.row < lastRowPosition && selectedChecker.col > lastColPosition){
            gameData.removeChecker(selectedChecker.row + 1, selectedChecker.col - 1);
            return true;
          }
          if(selectedChecker.row < lastRowPosition && selectedChecker.col < lastColPosition){
            gameData.removeChecker(selectedChecker.row + 1, selectedChecker.col + 1);
            return true;
          }

        }else{
          gameData.removeChecker((lastRowPosition + selectedChecker.row) / 2, (lastColPosition + selectedChecker.col) / 2);
          return true;
        } 
      };
    };
   return false;
  };

  switchTurn() {

    if(gameData.turn === WHITE_PLAYER){
        
      gameData.turn = BLACK_PLAYER;
    }else if(gameData.turn === BLACK_PLAYER){
      
      gameData.turn = WHITE_PLAYER;
    };
  };

  checkForMovesEnd = (whiteMoves, blackMoves) => { 

    const movesEndGame = (MovesArray, player) => {

      if(MovesArray.length === 0){
        this.resetMarks();
        this.turn = GAME_OVER;
        winner = player;
        document.body.appendChild(div);
        div.classList.add('winner');
        div.innerHTML = `${winner} player won! <br> Refresh to start new game`; 
      };
    };

    movesEndGame(whiteMoves, BLACK_PLAYER);
    movesEndGame(blackMoves, WHITE_PLAYER);
  };

  checkForCheckersEnd = () => {

    let blackCheckers = [];
    let whiteCheckers = [];
  
    for(let checker of this.checkers){
      if(checker.player === BLACK_PLAYER){
        blackCheckers.push(checker); 
      }else{
        whiteCheckers.push(checker);
      };
    }

    const checkersEndGame = (checkersArray, player) => {

      if(checkersArray.length === 0){
        gameData.resetMarks();
        gameData.turn = GAME_OVER;
        winner = player; 
        document.body.appendChild(div);
        div.classList.add('winner');
        div.innerHTML = `${winner} player won! <br> Refresh to start new game`; 
      };
    };

    checkersEndGame(blackCheckers, WHITE_PLAYER);
    checkersEndGame(whiteCheckers, BLACK_PLAYER);
  };

  tryBerserker = () => {

    if(!selectedChecker) return
    
    // remember if checker is pawn or queen.
    if(selectedChecker.type !== 'berserker'){
    lastCheckerType = selectedChecker.type; 
    };
    
    if(selectedChecker.type === 'berserker'){

      selectedChecker.getPossibleBerserkerMoves(gameData);
    };

    if(selectedChecker.canEat = true){

      selectedChecker.type = 'berserker';
      selectedChecker.getPossibleBerserkerMoves(gameData);
      boardInit(); 
      return  
    };
  };

  tryQueen = () => {

    for(let checker of this.checkers){
      if(checker.player === BLACK_PLAYER && checker.row === 0 || checker.player === WHITE_PLAYER && checker.row === 7){
        checker.type = 'queen';
        checker.canEat = false;
        checker.canMove = false; 
        boardInit();
        gameData.switchTurn(); 
        return true;
      }; 
    }
    return false;
  };

};