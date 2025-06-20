const Cell = () => {
    const DEFAULT_VALUE = " ";
    let value = DEFAULT_VALUE;
    let filled = false;
    const getValue = () => {
        return value;
    }

    const isFilled = () => {
        return filled;
    }

    const setValue = (newValue) => {
        value = newValue
        filled = true;
    }

    return {getValue, setValue, isFilled};
}

const Player = (playerMark, playerName) => {

    const getPlayerMark = () => {
        return playerMark;
    }

    const setPlayerMark = (newMark) => {
        playerMark = newMark;
    } 

    const getPlayerName = () => {
        return playerName;
    }

    return {getPlayerMark, setPlayerMark, getPlayerName};
};

const GameController = (() => {
    let playerOne;
    let playerTwo;
    let currentPlayer;
    let roundInProgress = false;

    const initializePlayers = (newPlayerOne, newPlayerTwo) => {
        playerOne = newPlayerOne;
        playerTwo = newPlayerTwo;
        currentPlayer = playerOne;
        roundInProgress = true;
    }

    const playRound = (row, column) => {
        if(roundInProgress) {
            const currentPlayerMark = currentPlayer.getPlayerMark();
            const putMarkSuccessful = GameBoard.putMark(currentPlayerMark, row, column);
            TicTacToeDisplay.render();

            if(GameBoard.checkWinner()) {
                GameMessageDisplay.displayWinMessage(currentPlayer);
                endRound();
            } else if(GameBoard.checkTie()) {
                GameMessageDisplay.displayTieMessage();
                endRound();
            }

            if(putMarkSuccessful) {
                //Alternate between player turns
                currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
            }
        }
        
    }

    const endRound = () => {
        roundInProgress = false;
        TicTacToeDisplay.toggleFadeGrid();
    }

    const resetRound = () => {
        GameBoard.init();

        if(!roundInProgress) {
            TicTacToeDisplay.toggleFadeGrid();
        }

        roundInProgress = true;
        currentPlayer = playerOne;

        GameMessageDisplay.hideMessage();
        TicTacToeDisplay.render();
    }

    return {playRound, initializePlayers, resetRound};
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
        return gameBoard[row][column].isFilled();
    }

    const checkWinner = () => {
        //Check rows
        for(let i = 0; i < rows; i++) {
            if((gameBoard[i][0].getValue() === gameBoard[i][1].getValue() &&
                gameBoard[i][1].getValue() === gameBoard[i][2].getValue()) && 
                gameBoard[i][0].isFilled()) {
                return true;
            }
        }

        //Check columns
        for(let i = 0; i < columns; i++){
            if((gameBoard[0][i].getValue() === gameBoard[1][i].getValue() &&
                gameBoard[1][i].getValue() === gameBoard[2][i].getValue()) && 
                gameBoard[0][i].isFilled()) {
                return true;
            }
        }

        //Check diagonals
        if((gameBoard[0][0].getValue() === gameBoard[1][1].getValue() &&
            gameBoard[1][1].getValue() === gameBoard[2][2].getValue()) && 
            gameBoard[0][0].isFilled()) {
            return true;
        }

        if((gameBoard[0][2].getValue() === gameBoard[1][1].getValue() &&
            gameBoard[1][1].getValue() === gameBoard[2][0].getValue()) && 
            gameBoard[0][2].isFilled()) {
            return true;
        }
        
        return false;
    }

    //Tie happens when board is filled and there are no winners
    const checkTie = () => {
        let boardFilled = true;
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                if(!gameBoard[i][j].isFilled()) {
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
    return {getGameBoard, logGameBoard, putMark, checkWinner, checkTie, init};
})();

const TicTacToeDisplay = (() => {
    const gridEl = document.getElementById("tic-tac-toe-grid");
    const gridWrapper = document.getElementById("grid-wrapper");

    const render = () => {
        gridWrapper.style.display = "block";
        gridEl.innerHTML = "";

        const gameBoard = GameBoard.getGameBoard();
        for(let i = 0; i < gameBoard.length; i++) {
            for(let j = 0; j < gameBoard[i].length; j++) {
                const cellTemplate = `
                    <div class="tic-tac-toe-cell ${gameBoard[i][j].isFilled() ? "cell-filled" : ""}" data-row="${i}" data-col="${j}">
                        ${gameBoard[i][j].getValue()}
                    </div>
                `;
                gridEl.innerHTML += cellTemplate;
            }
        }
    }

    const toggleFadeGrid = () => {
        if(gridEl.classList.contains("game-over-grid")) {
            gridEl.classList.remove("game-over-grid");
        } else {
            gridEl.classList.add("game-over-grid");
        }
    }

    const clickCallBack = (event) => {
        const clickedRow = event.target.dataset.row;
        const clickedCol = event.target.dataset.col;
        GameController.playRound(clickedRow, clickedCol);
    }

    gridEl.addEventListener("click", clickCallBack);

    return {render, toggleFadeGrid};
})();

const GameMessageDisplay = (() => {
    const endMessageDiv = document.getElementById("end-message-div");

    const displayWinMessage = (winningPlayer) => {
        endMessageDiv.innerHTML = `<h2>Winner: ${winningPlayer.getPlayerName()} (${winningPlayer.getPlayerMark()})</h2>`
    }

    const displayTieMessage = () => {
        endMessageDiv.innerHTML = `<h2>Tie Game</h2>`;
    }

    const hideMessage = () => {
        endMessageDiv.innerHTML = "";
    }

    return {displayTieMessage, displayWinMessage, hideMessage};
})();

const PlayerNameForm = (() => {
    const form = document.getElementById("player-name-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const playerNameFormData = new FormData(form);
        GameController.initializePlayers(
            Player("X", playerNameFormData.get("player_one_name_input")),
            Player("O", playerNameFormData.get("player_two_name_input"))
        );

        form.innerHTML = "";
        TicTacToeDisplay.render();
    });
})();

const ResetBoardButton = (() => {
    const resetButtonEl = document.getElementById("reset-board-btn");

    resetButtonEl.addEventListener("click", GameController.resetRound);
})();