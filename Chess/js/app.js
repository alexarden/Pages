let body = document.querySelector('body'); 
let table = document.createElement('table');
let winnerPopUp = document.createElement('div');
let currentPiece = undefined; 
let boardData;
let selectedCell; 
let selectedPiece;
let winner;
const WHITE_PLAYER = 'gold';
const BLACK_PLAYER = 'silver';  
let turn = WHITE_PLAYER;  
const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';
const CHESS_BOARD_ID = 'table-id';
const GAME_OVER = 'game over'; 

 
//TODO: add check feature.
//TODO: fix castle bugs like when no castle can be made dont show it,
// and rules of castle. 
//TODO: corrected king and queen positions, need to fix castles. 

function getNewBoard() {

  let result = [];

  const pieces = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK ]; 

  const addPieces = (row, pawnRow, player, id) => {

    for (let i = 0; i < 8; i++) { 

      result.push(new Piece(row, i, pieces[i], player, id + i));
      result.push(new Piece(pawnRow, i, PAWN, player, id + i + 8)); 

    };  
  };

  addPieces(0, 1, WHITE_PLAYER, 0);
  addPieces(7, 6, BLACK_PLAYER, 16);   

  return result;
};

const addImage = (cell, type, player) => {
  image = document.createElement('img');
  image.src = `img/${player}_${type}.png`; 
  image.classList.add(`${player}Pawns`);
  image.draggable = false; 
  cell.appendChild(image);
};

const clickOnCell = (row, col) => {

  console.log(boardData.pieces); 

  boardData.resetMarks(); 

  if (selectedPiece === undefined) {
        
    boardData.showPieceMoves(row, col); 

  } else { 

    if(selectedPiece.player === turn){ 

      if (boardData.movePiece(selectedPiece, row, col)) {  

       selectedPiece = undefined;
       updateChessBoard(boardData);

      } else {
      
       boardData.showPieceMoves(row, col);
      }

    }else{

     return selectedPiece = undefined;

    };
  };

 boardData.endGame(); 
};

const initGame = () => {

  boardData = new BoardData(getNewBoard());
  updateChessBoard(boardData)

}

const updateChessBoard = () => {

  table = document.getElementById(CHESS_BOARD_ID);

  if (table !== null) {

    table.remove();

  }

  table = document.createElement('table');
  table.id = CHESS_BOARD_ID;
  document.body.appendChild(table);

  for (let row = 0; row < 8; row++) {

    const rowElement = table.insertRow();

    for (let col = 0; col < 8; col++) { 

      const cell = rowElement.insertCell();
      cell.id = `cell-${row}-${col}`; 
      cell.addEventListener('click', () => clickOnCell(row, col)); 
      
    }
  }


  for (let piece of boardData.pieces) { 

    addImage(table.rows[piece.row].cells[piece.col], piece.type, piece.player);

  } 
  
 
  
};

window.addEventListener('load', initGame);    


