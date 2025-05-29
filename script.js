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

    return {init, getGameBoard, logGameBoard};
})();

const Cell = () => {
    let value = "0";

    const getValue = () => {
        return value;
    }

    const setValue = (newValue) => {
        value = newValue
    }

    return {getValue, setValue};
}