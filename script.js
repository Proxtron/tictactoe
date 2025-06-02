const Cell = () => {
    const DEFAULT_VALUE = "/";
    let value = DEFAULT_VALUE;

    const getValue = () => {
        return value;
    }

    const setValue = (newValue) => {
        value = newValue
    }

    return {getValue, setValue, DEFAULT_VALUE};
}

const Player = (playerMark) => {

    const getPlayerMark = () => {
        return playerMark;
    }

    const setPlayerMark = (newMark) => {
        playerMark = newMark;
    } 

    return {getPlayerMark, setPlayerMark};
};

const GameController = (() => {
    const playerOne = Player("X");
    const playerTwo = Player("O");
    let currentPlayer = playerOne;

    const playRound = (row, column) => {
        const currentPlayerMark = currentPlayer.getPlayerMark();
        const putMarkSuccessful = GameBoard.putMark(currentPlayerMark, row, column);

        if(putMarkSuccessful) {
            //Alternate between player turns
            currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        }

        if(GameBoard.checkWinner()) {
            console.log("Winner");
        } else if(GameBoard.checkTie()) {
            console.log("Tie");
        }

        GameBoard.logGameBoard();
    }

    return {playRound};
})();


const GameBoard = (() => {
    const gameBoard = [];
    const rows = 3;
    const columns = 3;
    function init() {
        for(let i = 0; i < rows; i++) {
            gameBoard[i] = [];
            for(let j = 0; j < columns; j++) {
                gameBoard[i][j] = Cell();
            }
        }
    }

    init();

    function getGameBoard() {
        return gameBoard;
    }

    function logGameBoard() {
        let gameBoardStr = "";
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                gameBoardStr += gameBoard[i][j].getValue();
            }
            gameBoardStr += "\n"
        }
        console.log(gameBoardStr);
    }

    const putMark = (mark, row, column) => {
        const collisionOccured = checkCollision(row, column);
        if(!collisionOccured) gameBoard[row][column].setValue(mark);

        const markPlacementSuccessful = !collisionOccured;
        return markPlacementSuccessful;
    }

    const checkCollision = (row, column) => {
        return gameBoard[row][column].getValue() !== Cell().DEFAULT_VALUE;
    }

    const checkWinner = () => {
        //Check rows
        for(let i = 0; i < rows; i++) {
            if((gameBoard[i][0].getValue() === gameBoard[i][1].getValue() &&
                gameBoard[i][1].getValue() === gameBoard[i][2].getValue()) && 
                gameBoard[i][0].getValue() !== Cell().DEFAULT_VALUE) {
                return true;
            }
        }

        //Check columns
        for(let i = 0; i < columns; i++){
            if((gameBoard[0][i].getValue() === gameBoard[1][i].getValue() &&
                gameBoard[1][i].getValue() === gameBoard[2][i].getValue()) && 
                gameBoard[0][i].getValue() !== Cell().DEFAULT_VALUE) {
                return true;
            }
        }

        //Check diagonals
        if((gameBoard[0][0].getValue() === gameBoard[1][1].getValue() &&
            gameBoard[1][1].getValue() === gameBoard[2][2].getValue()) && 
            gameBoard[0][0].getValue() !== Cell().DEFAULT_VALUE) {
            return true;
        }

        if((gameBoard[0][2].getValue() === gameBoard[1][1].getValue() &&
            gameBoard[1][1].getValue() === gameBoard[2][0].getValue()) && 
            gameBoard[0][2].getValue() !== Cell().DEFAULT_VALUE) {
            return true;
        }
        
        return false;
    }

    //Tie happens when board is filled and there are no winners
    const checkTie = () => {
        let boardFilled = true;
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                if(gameBoard[i][j].getValue() === Cell().DEFAULT_VALUE) {
                    boardFilled = false;
                }
            }
        }

        const gameHasBeenWon = checkWinner();

        if(boardFilled && !gameHasBeenWon) {
            return true;
        }
        return false;
    }
    return {getGameBoard, logGameBoard, putMark, checkWinner, checkTie};
})();
