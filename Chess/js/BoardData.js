class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
    
    // Castle conditions.

    this.whiteKingDidntMove = true;
    this.rightWhiteRookDidntMove = true;
    this.leftWhiteRookDidntMove = true; 

    this.blackKingDidntMove = true; 
    this.rightBlackRookDidntMove = true;
    this.leftBlackRookDidntMove = true; 

    this.smallWhiteCastleUsed = false;
    this.smallBlackCastleUsed = false;
    this.bigWhiteCastleUsed = false;
    this.bigBlackCastleUsed = false; 

  };

  getPieceById(id){

    for(let piece of this.pieces){
      if(piece.id === id){
        return piece;
      };
    }
      
  }; 
  
  checkForCastleUpdate(piece) {

   if(piece.type === ROOK){
      
      if(piece.player === BLACK_PLAYER){
        
        if(piece.col !== 7  || piece.row !== 0){
          
          this.rightBlackRookDidntMove = false;
        };
        if(piece.col !== 0  || piece.row !== 0){
           
          this.leftBlackRookDidntMove = false;  
        };
      };

      if(piece.player === WHITE_PLAYER){

        if(piece.col !== 7  || piece.row !== 7){
          this.rightWhiteRookDidntMove = false;
        };
        if(piece.col !== 0  || piece.row !== 7){
          this.leftWhiteRookDidntMove = false;  
        }; 
      };
    }; 

    if(piece.type === KING){

      if(piece.player === BLACK_PLAYER){
       this.blackKingDidntMove = false; 
      };
      if(piece.player === WHITE_PLAYER){
       this.whiteKingDidntMove = false;
      };
    };
  };
  
  trySmallCastle() {
    const whiteKing = this.getPieceById(4);
    const leftWhiteRook = this.getPieceById(0); 
    const blackKing = this.getPieceById(20);
    const leftBlackRook = this.getPieceById(16);  

    console.log(blackKing.player) 
    console.log(turn) 
    
    if(whiteKing.row === 0 && whiteKing.col === 2 && this.smallWhiteCastleUsed === false){
      
      leftWhiteRook.row = 0;
      leftWhiteRook.col = 3;
      this.smallWhiteCastleUsed = true;
    };
    
    if(blackKing.row === 7 && blackKing.col === 2 && this.smallBlackCastleUsed === false){
      
      leftBlackRook.row = 7;
      leftBlackRook.col = 3; 
      this.smallBlackCastleUsed = true; 
    }; 
    
  };    
   
  tryBigCastle() {
    const whiteKing = this.getPieceById(4);
    const rightWhiteRook = this.getPieceById(7); 
    const blackKing = this.getPieceById(20);
    const rightBlackRook = this.getPieceById(23); 
    
    if(whiteKing.row === 0 && whiteKing.col === 6 && this.bigWhiteCastleUsed === false){
      
      rightWhiteRook.row = 0;
      rightWhiteRook.col = 5;
      this.bigWhiteCastleUsed = true;
    }; 
    
    if(blackKing.row === 7 && blackKing.col === 6 && this.bigBlackCastleUsed === false){
      
      rightBlackRook.row = 7;
      rightBlackRook.col = 5;     
      this.bigBlackCastleUsed = true;  
    };
   
  };

  getPiece(row, col) {

    for (const piece of this.pieces) {

      if (piece.row === row && piece.col === col) {

        return piece;
      };
    }
  };
   
  isEmpty(row, col) {

    return this.getPiece(row, col) === undefined;

  }; 

  isPlayer(row, col, player) {

    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;

  };  

  removePiece(row, col) {

    for (let i = 0; i < this.pieces.length; i++) {

      let piece = this.pieces[i]; 

      if (piece.row === row && piece.col === col) {

        if(piece.type === KING){
          console.log('king died'); 
          piece = piece.getOpponent(); 
          turn = GAME_OVER;
          console.log(turn);
          winner = piece;
        }

       this.pieces.splice(i, 1);

      };
    }
  };

  movePiece(piece, row, col) {
    
    const possibleMoves = piece.getPossibleMoves(boardData);  
    for (const possibleMove of possibleMoves) {
      
      if (possibleMove[0] === row && possibleMove[1] === col) { 
        
        
        boardData.removePiece(row, col);
        
        piece.row = row;
        piece.col = col;
        
        this.checkForCastleUpdate(piece);

        if(turn !== GAME_OVER){
         console.log(1)
         this.trySmallCastle();
        
         this.tryBigCastle();
         
         this.switchTurn();  
        }; 
  
       return true;
      };
    }
  
    return false;  
  };

  switchTurn() {
    if(turn === GAME_OVER){
      return true; 
    }
    if(turn === WHITE_PLAYER){ 
      turn = BLACK_PLAYER;
    }else {
      turn = WHITE_PLAYER; 
    }; 
  }

  endGame() {

    if(turn === GAME_OVER){  
      
  
      body.appendChild(winnerPopUp);
      winnerPopUp.innerHTML = `${winner} wins, Congratulations! <br> Refresh to start again`;    
      winnerPopUp.classList.add('popup'); 
      selectedPiece = undefined;
    }; 
  };

  showPieceMoves(row, col) {   
  
    const piece = boardData.getPiece(row, col);
   
    for (let piece of boardData.pieces) {
   
      if (piece.row === row && piece.col === col) {
   
        let possibleMoves = piece.getPossibleMoves(boardData); 
         
        for (let possibleMove of possibleMoves) {
   
          const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
   
          const possibleEnemy = boardData.getPiece(possibleMove[0], possibleMove[1])
   
          if(piece && piece.player === turn){
             
            if(possibleEnemy && piece.player !== possibleEnemy.player){ 

              cell.classList.add('attack');
            };  
            
            this.castleMarkConditions(piece);  
    
            cell.classList.add('movement');

          }; 
        }
      }; 
    }
   
    selectedCell = table.rows[row].cells[col];
    selectedCell.classList.add('select');
    selectedPiece = piece;  
  }; 

  resetMarks() {

    for(let i = 0; i < 8; i++){ 
        
      for(let j = 0; j < 8; j++){

        table.rows[i].cells[j].classList.remove('movement');
        table.rows[i].cells[j].classList.remove('select'); 
        table.rows[i].cells[j].classList.remove('attack');  
        table.rows[i].cells[j].classList.remove('castle');   
        if(turn === GAME_OVER){ 
            
          table.rows[i].cells[j].removeEventListener('click', clickOnCell()); 
        };
      } 
    }  
  };

  castleMarkConditions(piece) { 

    if(piece.type === KING){

      if(this.whiteKingDidntMove && turn === WHITE_PLAYER){

        if(boardData.getPiece(0, 1) === undefined){
        table.rows[0].cells[2].classList.add('castle');
        };

        if(boardData.getPiece(0, 5) === undefined){
        table.rows[0].cells[6].classList.add('castle'); 
        }; 
      };

      if(this.blackKingDidntMove && turn === BLACK_PLAYER){ 

        if(boardData.getPiece(7, 1) === undefined){
        table.rows[7].cells[2].classList.add('castle');
        };

        if(boardData.getPiece(7, 5) === undefined){
        table.rows[7].cells[6].classList.add('castle'); 
        };
      };
    };

  }

};  
