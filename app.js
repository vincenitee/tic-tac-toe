
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

function ScreenController() {
    const marks = {
        'O': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>circle-outline</title>
                    <path
                        d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>`,
        'X': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>window-close</title>
                    <path
                        d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>`,
    };

    const select = (element) => document.querySelector(element);
    const selectAll = (element) => document.querySelectorAll(element);

    const boardElement = select('.game-board');

    const gameBoard = Gameboard();

    const updateScreen = () => {
        const board = gameBoard.getBoard();
        
        boardElement.innerHTML = '';

        board.forEach((row, rowIndex) => {
            console.log(row);
            row.forEach((cell, collIndex) => {
                const cellElement = document.createElement('button');
                cellElement.classList.add('cell');
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = collIndex;
                cellElement.textContent = cell.getMark();
                boardElement.appendChild(cellElement);
            });
        });
    };

    return {
        updateScreen,
    };
}

ScreenController().updateScreen();





