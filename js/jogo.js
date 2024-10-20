document.addEventListener('DOMContentLoaded', function () {
    const gridSize = localStorage.getItem('gridSize');
    const bombCountWithSuffix = localStorage.getItem('bombCount');
    const gameMode = localStorage.getItem('gameMode');

    if (!gridSize || !bombCountWithSuffix || !gameMode) {
        alert("Configurações de jogo não encontradas. Volte à página inicial e configure o jogo.");
        window.location.href = '../pages/index.html';
        return;
    }

    const bombCount = bombCountWithSuffix.split(' ')[0];
    document.getElementById('bombs-count').textContent = bombCount;
    document.getElementById('config').textContent = gridSize;
    document.getElementById('mode').textContent = gameMode;

    const [rows, cols] = gridSize.split('x').map(Number);
    document.documentElement.style.setProperty('--columns', cols);
    document.documentElement.style.setProperty('--rows', rows);

    const numMines = parseInt(bombCount);
    createBoard(rows, cols, numMines);
});

// Variáveis globais para o escopo de trapaça
let globalBoard;
let globalRows;
let globalCols;
let globalNumMines;

function createBoard(rows, cols, numMines) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    globalRows = rows; // Salva no escopo global
    globalCols = cols; // Salva no escopo global
    globalNumMines = numMines; // Salva no escopo global

    const board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            flagged: false,
            element: null,
            adjacentMines: 0
        }))
    );

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', function (event) {
                handleCellClick(event, board, rows, cols, numMines);
            });
            cell.addEventListener('contextmenu', function (event) {
                handleRightClick(event, board);
            });
            gameBoard.appendChild(cell);
            board[row][col].element = cell;
        }
    }

    placeMines(board, rows, cols, numMines);
    calculateAdjacentMines(board, rows, cols);

    globalBoard = board; // Salva o board no escopo global
}

function placeMines(board, rows, cols, numMines) {
    let placedMines = 0;
    while (placedMines < numMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }
}

function calculateAdjacentMines(board, rows, cols) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].mine) {
                let adjacentMines = 0;
                for (let r = row - 1; r <= row + 1; r++) {
                    for (let c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].mine) {
                            adjacentMines++;
                        }
                    }
                }
                board[row][col].adjacentMines = adjacentMines;
            }
        }
    }
}

let revealedCells = 0;

function handleCellClick(event, board, rows, cols, numMines) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed || board[row][col].flagged) {
        return;
    }

    revealCell(board[row][col]);

    if (board[row][col].mine) {
        gameOver(board, rows, cols);
    } else if (board[row][col].adjacentMines === 0) {
        revealAdjacentCells(board, row, col, rows, cols);
    }

    if (revealedCells === rows * cols - numMines) {
        alert('Você venceu!');
        stopTimer();
    }
}

function handleRightClick(event, board) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed) {
        return;
    }

    board[row][col].flagged = !board[row][col].flagged;
    board[row][col].element.classList.toggle('flag');
}

function revealCell(cell) {
    if (cell.revealed) {
        return;
    }

    cell.revealed = true;
    cell.element.classList.add('revealed');

    if (cell.mine) {
        cell.element.textContent = '💣';
    } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
        cell.element.classList.add(`number-${cell.adjacentMines}`);
    }

    revealedCells++; // Incrementa o contador de células reveladas
}

function revealAdjacentCells(board, row, col, rows, cols) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && !board[r][c].mine && !board[r][c].revealed) {
                revealCell(board[r][c]);
                if (board[r][c].adjacentMines === 0) {
                    revealAdjacentCells(board, r, c, rows, cols);
                }
            }
        }
    }
}

// Função para revelar todas as células (usada no cheat)
function revealBoard(board, rows, cols) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].revealed) { // Verifica se a célula não foi revelada
                revealCell(board[row][col]); // Revela a célula
            }
        }
    }
}

// Função para esconder a célula
function hideCell(cell) {
    cell.revealed = false; // Reseta o estado da célula
    cell.originallyRevealed = false; // Reseta o estado original
    cell.element.classList.remove('revealed'); // Remove a classe que revela a célula
    cell.element.textContent = ''; // Limpa o conteúdo da célula
}

function gameOver(board, rows, cols) {
    alert('Você perdeu!');
    stopTimer();
    
    // Revela todas as células do tabuleiro, incluindo as minas
    revealBoard(board, rows, cols);
}

// Timer
let timerElement = document.getElementById("timer");
let seconds = 0;
let minutes = 0;
let timerInterval;
let isTimerStarted = false;

function startTimer() {
    if (!isTimerStarted) {
        isTimerStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    timerElement.textContent =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;
}

function stopTimer() {
    clearInterval(timerInterval);
}

document.getElementById("game-board").addEventListener("click", startTimer);


// Botão trapaça
document.getElementById('cheatBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o comportamento padrão do link

    // Revela todas as células do tabuleiro
    for (let row = 0; row < globalRows; row++) {
        for (let col = 0; col < globalCols; col++) {
            revealCell(globalBoard[row][col]); // Revela a célula
        }
    }

    // Aguarda o tempo de trapaça e então oculta as células não reveladas
    setTimeout(function () {
        for (let row = 0; row < globalRows; row++) {
            for (let col = 0; col < globalCols; col++) {
                // Se a célula ainda não foi aberta, retorne ao estado original
                if (!globalBoard[row][col].revealed) {
                    hideCell(globalBoard[row][col]); 
                }
            }
        }
    }, 2000); // Executa após o tempo de trapaça
});
