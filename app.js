
// Generate a gameboard
function Gameboard() {
    const board = [];

    const boardSize = 3;

    const generateBoard = () => {
        for (let row = 0; row < boardSize; row++) {
            board[row] = [];
            for (let col = 0; col < boardSize; col++) {
                board[row].push(Cell());
            }
        }
    };

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

    generateBoard();

    const printBoard = () => {
        const cellWithMarks = board.map((row) => row.map((cell) => cell.getMark()));
        console.log(cellWithMarks);
    };

    return { addMark, getBoard, getBoardSize, printBoard, generateBoard }
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
function GameController(
    playerOneName = 'Player 1',
    playerTwoName = 'Player 2'
) {
    let scores = { X: 0, O: 0, draw: 0 };

    let gameOver = false;

    let winner = null;

    // Initialize board
    const board = Gameboard();

    // Initialize players
    const players = [
        createPlayer(playerOneName, 'X'),
        createPlayer(playerTwoName, 'O'),
    ];

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getScores = () => scores;

    const isGameOver = () => gameOver;

    const getWinner = () => winner;

    const getBoard = () => board.getBoard();

    const playRound = (row, col) => {
        if (!gameOver) {
            const { mark } = getActivePlayer();

            const isValidMove = board.addMark(row, col, mark);

            if (!isValidMove) {
                return;
            }

            if (isBoardFull() && !checkWinner(row, col)) {
                scores.draw += 1;

                winner = 'draw';
                
                gameOver = true;
                
                return;
            }

            if (checkWinner(row, col)) {
                scores[mark] += 10;

                winner = mark;

                gameOver = true;
                
                return;
            }

            switchActivePlayer();
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

    const newGame = () => {
        // Variable resets
        activePlayer = players[0];
        gameOver = false;
        winner = null;

        // Regenerates the board
        board.generateBoard();
    }

    return {
        playRound,
        getActivePlayer,
        getScores,
        getBoard,
        isGameOver,
        getWinner,
        newGame,
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
        'draw' : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>scale-balance</title>
                    <path
                        d="M12,3C10.73,3 9.6,3.8 9.18,5H3V7H4.95L2,14C1.53,16 3,17 5.5,17C8,17 9.56,16 9,14L6.05,7H9.17C9.5,7.85 10.15,8.5 11,8.83V20H2V22H22V20H13V8.82C13.85,8.5 14.5,7.85 14.82,7H17.95L15,14C14.53,16 16,17 18.5,17C21,17 22.56,16 22,14L19.05,7H21V5H14.83C14.4,3.8 13.27,3 12,3M12,5A1,1 0 0,1 13,6A1,1 0 0,1 12,7A1,1 0 0,1 11,6A1,1 0 0,1 12,5M5.5,10.25L7,14H4L5.5,10.25M18.5,10.25L20,14H17L18.5,10.25Z" />
                </svg>`,
    };

    const select = (element) => document.querySelector(element);

    const game = GameController();
    const boardElement = select('.game-board');

    const board = game.getBoard();
    const playerXTurn = select('#player-x');
    const playerOTurn = select('#player-o');

    const playerXScoreElement = select('#player-X-score'); 
    const playerOScoreElement = select('#player-O-score'); 
    const drawScoreElement = select('#draw-score');

    const winnerDialog = select('.winner-dialog');
    const winnerMessageElement = select('.winner-dialog__message');
    const winnerMarkElement = select('.winner-dialog__mark');
    const closeDialogBtn = select('.close-dialog');

    const gameControlsElement = select('.game-controls');
    const newGameBtn = select('.new-game');

    newGameBtn.addEventListener('click', () => {
        game.newGame();
        updateScreen();
        toggleGameControlsVisibility();
    });

    closeDialogBtn.addEventListener('click', () => {
        winnerDialog.close();
    });

    const updateScreen = () => {
        // Clears the board
        boardElement.innerHTML = '';

        // Switches player's turn
        const currentPlayer = game.getActivePlayer();

        [playerXTurn, playerOTurn].forEach((el) => el.classList.remove('current'));
        (currentPlayer.mark === 'X' ? playerXTurn : playerOTurn).classList.add('current');

        // Displays Score
        const { X: playerXScore, O: playerOScore, draw: drawScore } = game.getScores();
        playerXScoreElement.textContent = playerXScore;
        playerOScoreElement.textContent = playerOScore;
        drawScoreElement.textContent = drawScore;

        // Renders the board
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = createCellButton(cell, rowIndex, colIndex);
                boardElement.appendChild(cellButton);
            });
        });

        // Checks if the game is over
        if(game.isGameOver()){
            const winner = game.getWinner();
            if(winner === 'draw') {
                announceWinner(marks[winner], 'TIE')
            } else {
                announceWinner(marks[winner], 'Win')
            }
        }
    }

    const announceWinner = (mark, message) => {
        winnerMarkElement.innerHTML = mark;
        winnerMessageElement.textContent = message;
        winnerDialog.showModal();

        toggleGameControlsVisibility();
    };

    const toggleGameControlsVisibility = () => {
        gameControlsElement.classList.toggle('hidden');
    }

    const createCellButton = (cell, rowIndex, colIndex) => {
        const cellMark = cell.getMark();

        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.col = colIndex;

        const isMarked = cellMark !== '';
        cellButton.innerHTML = isMarked ? marks[cellMark] : '';
        if (isMarked) cellButton.classList.add('taken');

        return cellButton;
    }

    const clickHandlerBoard = (e) => {
        const selectedCell = e.target;

        if (!selectedCell.classList.contains('cell')) return;

        const cellCol = parseInt(selectedCell.dataset.col);
        const cellRow = parseInt(selectedCell.dataset.row);

        game.playRound(cellRow, cellCol);
    
        updateScreen();
    };

    boardElement.addEventListener('click', clickHandlerBoard);

    // Initial render
    updateScreen();
}

(function () {
    ScreenController();
})();





