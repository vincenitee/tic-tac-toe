
// Generate a gameboard
function Gameboard() {
    const board = [];

    const boardSize = 3;

    for (let row = 0; row < boardSize; row++) {
        board[row] = [];
        for (let col = 0; col < boardSize; col++) {
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    const getBoardSize = () => boardSize;

    const addMark = (row, col, mark) => {
        if (
            row < 0 ||
            col < 0 ||
            row >= boardSize ||
            col >= boardSize
        ) return false;

        const cell = board[row][col];

        if (!cell || cell.getMark() !== '') return false;

        cell.setMark(mark);

        return true;
    };

    const printBoard = () => {
        const cellWithMarks = board.map((row) => row.map((cell) => cell.getMark()));
        console.log(cellWithMarks);
    };

    return { addMark, getBoard, getBoardSize, printBoard }
}

// Generates a cell object
function Cell() {
    let mark = '';

    const setMark = (newMark) => {
        if (mark === '') mark = newMark;
    };

    const getMark = () => mark;

    return { setMark, getMark };
}

// Generates a player object
function createPlayer(name, mark) {
    return { name, mark };
}

// Main controller of the game
function GameController() {

    let gameOver = false;
    // Initialize board
    const board = Gameboard();

    // Initialize players
    const players = [
        createPlayer('Player 1', 'X'),
        createPlayer('Player 2', 'O'),
    ];

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, col) => {
        if (!gameOver) {
            const { mark } = getActivePlayer();

            const isValidMove = board.addMark(row, col, mark);

            if (!isValidMove) {
                console.log('Invalid move, please try again.');
                return;
            }

            if(isBoardFull() && !checkWinner(row, col)) {
                console.log(`It's a tie.`);
                gameOver = true;
                return;
            }

            if (checkWinner(row, col)) {
                console.log(`${getActivePlayer().name} Wins!`)
                gameOver = true;
                return;
            }

            switchActivePlayer();
            printNewRound();
        }
    };

    const checkWinner = (row, col) => {
        const { mark } = getActivePlayer();

        if (row === col && checkMainDiagonals(mark)) return true;

        if (row + col === 2 && checkAntiDiagonals(mark)) return true;

        if (checkRow(row, mark) || checkColumn(col, mark)) return true;

        return false;
    }

    const checkRow = (row, mark) =>
        board.getBoard()[row].every(cell => cell.getMark() === mark);

    const checkColumn = (col, mark) =>
        board.getBoard().map(row => row[col]).every(cell => cell.getMark() === mark);

    const checkMainDiagonals = (mark) => {
        const cells = [[0, 0], [1, 1], [2, 2]].map(
            ([row, col]) => board.getBoard()[row][col]
        );
        return cells.every(cell => cell.getMark() === mark);
    };

    const checkAntiDiagonals = (mark) => {
        const cells = [[0, 2], [1, 1], [2, 0]].map(
            ([row, col]) => board.getBoard()[row][col]
        );
        return cells.every(cell => cell.getMark() === mark);
    }

    const isBoardFull = () => {
        return board.getBoard()
            .every(row => row.every(cell => cell.getMark() !== ''));
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };

}

const gameController = GameController();



