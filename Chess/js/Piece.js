class Piece {
  constructor(row, col, type, player, id) {
    this.row = row;
    this.col = col;
    this.player = player;
    this.type = type;
    this.id = id;  
  };

 
 getOpponent() {

    if (this.player === WHITE_PLAYER) {

      return BLACK_PLAYER;
    }

    return WHITE_PLAYER;
  };

  getPossibleMoves(boardData) {

    let moves; 

    if (this.type === PAWN) {
      moves = this.getPawnMoves(boardData);
    } else if (this.type === ROOK) {
      moves = this.getRookMoves(boardData);
    } else if (this.type === KNIGHT) {
      moves = this.getKnightMoves(boardData); 
    } else if (this.type === BISHOP) {
      moves = this.getBishopMoves(boardData);
    } else if (this.type === KING) {
      moves = this.getKingMoves(boardData);
    } else if (this.type === QUEEN) {
      moves = this.getQueenMoves(boardData);  
    } else {
      console.log("Unknown type"); 
    }

   let filteredMoves = [];
    for (let absoluteMove of moves) {

      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];

      if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {

       filteredMoves.push(absoluteMove);
      };
    } 
     
    return filteredMoves;
  };

  getPawnMoves(boardData) {

    let result = [];
    let direction = 1;

    if (this.player === BLACK_PLAYER) {

      direction = -1;
      
    }

    let position = [this.row + direction, this.col];
    if (boardData.isEmpty(position[0], position[1])) {

      result.push(position);
    }

    //check if enemy can be eaten, 
    //if ture:
    // add the move to the pawn.
    position = [this.row + direction, this.col + direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {

      result.push(position);

    }

    position = [this.row + direction, this.col - direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {

      result.push(position);

    }

    //first pawn move can do 2 steps or 1, else can do 1.
    if(this.player === BLACK_PLAYER && this.row === 6 && boardData.getPiece(this.row-2, this.col) === undefined){

      result.push([this.row-2, this.col])   

    }else if(this.player === WHITE_PLAYER && this.row === 1 && boardData.getPiece(this.row+2, this.col) === undefined){ 

      result.push([this.row+2, this.col])
    } ; 

    return result;
  };

  getRookMoves(boardData) {

    let result = [];

    result = result.concat(this.getMovesInDirection(-1, 0, boardData));
    result = result.concat(this.getMovesInDirection(1, 0, boardData));
    result = result.concat(this.getMovesInDirection(0, -1, boardData));
    result = result.concat(this.getMovesInDirection(0, 1, boardData));

     return result;

  };

  getMovesInDirection(directionRow, directionCol, boardData) {

    let result = [];

    //get all moves on board in given direction with loop.  
    //direction is defined with both row and col values.

    for (let i = 1; i < 8; i++) {

      // for every index from 1 to 8 check if:

      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;


      

      if (boardData.isEmpty(row, col)) { 

        result.push([row, col]); 

        //if during loop we encounter 'enemy',
        //'give' his position as valid move and break loop.


      } else if (boardData.isPlayer(row, col, this.getOpponent())) {

        result.push([row, col]);
        return result; 

        //if during loop we encounter 'friendly',
        //'dont give' his position as valid move and break loop.


      } else if (boardData.isPlayer(row, col, this.player)) {

        return result; 
      };
    } 
    
    return result;
  };

  getKnightMoves(boardData) {

    let result = [];

    const relativeMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [-1, 2], [1, 2], [-1, -2], [1, -2]];

    for (let relativeMove of relativeMoves) {

      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];

      const piece = boardData.getPiece(row, col);

      if(!boardData.isPlayer(row, col, this.player)){

        result.push([row, col]); 

      }; 
    }

    return result;
  };

  getBishopMoves(boardData) {

    let result = [];

    result = result.concat(this.getMovesInDirection(-1, -1, boardData));
    result = result.concat(this.getMovesInDirection(-1, 1, boardData));
    result = result.concat(this.getMovesInDirection(1, -1, boardData));
    result = result.concat(this.getMovesInDirection(1, 1, boardData));

    return result;
  };

  getKingMoves(boardData) {

    let result = [];

    const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    for (let relativeMove of relativeMoves) {

      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];

      if(!boardData.isPlayer(row, col, this.player)){

        result.push([row, col]); 

      };
    }
    // Small castle conditions.

    if(boardData.whiteKingDidntMove && boardData.leftWhiteRookDidntMove && boardData.getPiece(0, 5) === undefined 
    && boardData.getPiece(0, 6) === undefined){
      if(this.player === WHITE_PLAYER){
       result.push([0, 6]); 
      } 
      
    };  

    if(boardData.blackKingDidntMove && boardData.leftBlackRookDidntMove && boardData.getPiece(7, 5) === undefined 
    && boardData.getPiece(7, 6) === undefined){ 
      if(this.player === BLACK_PLAYER){
        result.push([7, 6]);
      } 
    };  

    // Big castle conditions.

    if(boardData.whiteKingDidntMove && boardData.rightWhiteRookDidntMove && boardData.getPiece(0, 1) === undefined 
    && boardData.getPiece(0, 2) === undefined && boardData.getPiece(0, 3) === undefined){

      if(this.player === WHITE_PLAYER){
        result.push([0, 2]); 
      };  
    };  

    if(boardData.blackKingDidntMove && boardData.rightBlackRookDidntMove && boardData.getPiece(7, 1) === undefined  
    && boardData.getPiece(7, 2) === undefined && boardData.getPiece(7, 3) === undefined){  

      if(this.player === BLACK_PLAYER){ 
        result.push([7, 2]);
      }; 
    };  
  
    return result;
  };

  getQueenMoves(boardData) {

    let result = this.getBishopMoves(boardData);
    result = result.concat(this.getRookMoves(boardData));
    return result;

  }; 
}; 