// Variáveis globais
let globalBoard, globalRows, globalCols, globalNumMines;
let revealedCells = 0;

document.addEventListener('DOMContentLoaded', function () {
    const gridSize = localStorage.getItem('gridSize');
    const bombCountWithSuffix = localStorage.getItem('bombCount');
    const gameMode = localStorage.getItem('gameMode');

    if (!gridSize || !bombCountWithSuffix || !gameMode) {
        alert("Configurações de jogo não encontradas. Volte à página inicial e configure o jogo.");
        window.location.href = '../pages/index.html';
        return;
    }

    const bombCount = parseInt(bombCountWithSuffix.split(' ')[0]);
    document.getElementById('bombs-count').textContent = bombCount;
    document.getElementById('config').textContent = gridSize;
    document.getElementById('mode').textContent = gameMode;

    const [rows, cols] = gridSize.split('x').map(Number);
    document.documentElement.style.setProperty('--columns', cols);
    document.documentElement.style.setProperty('--rows', rows);

    createBoard(rows, cols, bombCount);
});

// Função para calcular o tempo limite em segundos
function calculateTimeLimit(rows, cols) {
    const totalCells = rows * cols;
    // Defina o tempo limite com base no tamanho do tabuleiro (por exemplo, 1 segundo por célula)
    return totalCells; // 1 segundo por célula, ajuste conforme necessário
}

// Criação do tabuleiro
function createBoard(rows, cols, numMines) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    globalRows = rows;
    globalCols = cols;
    globalNumMines = numMines;

    const board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            flagged: false,
            element: null,
            adjacentMines: 0,
            originallyRevealed: false // Nova propriedade
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

    globalBoard = board;
}

// Funções auxiliares
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

// Manipulação de cliques
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
        return; // Se a célula já foi revelada, não faz nada
    }

    board[row][col].flagged = !board[row][col].flagged;
    const remainingBombsElement = document.getElementById('bombs-count');

    if (board[row][col].flagged) {
        board[row][col].element.textContent = '🚩'; 
        remainingBombsElement.textContent = parseInt(remainingBombsElement.textContent) - 1;
    } else {
        board[row][col].element.textContent = '';
        remainingBombsElement.textContent = parseInt(remainingBombsElement.textContent) + 1;
    }
}

// Revelação de células
function revealCell(cell) {
    if (cell.revealed) {
        return;
    }

    cell.revealed = true;
    cell.originallyRevealed = true; 
    cell.element.classList.add('revealed');

    if (cell.mine) {
        cell.element.textContent = '💣';
    } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
        cell.element.classList.add(`number-${cell.adjacentMines}`);
    }

    revealedCells++; 
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

function revealBoard(board, rows, cols) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            revealCell(board[row][col]);
        }
    }
}

function hideCell(cell) {    
    cell.revealed = false; 
    cell.element.classList.remove('revealed'); 
    cell.element.textContent = '';
}

function gameOver(board, rows, cols) {
    alert('Você perdeu!');
    stopTimer();

    const remainingBombsElement = document.getElementById('bombs-count');
    remainingBombsElement.textContent = '0';

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

// Iniciar timer ao clicar no tabuleiro
document.getElementById("game-board").addEventListener("click", startTimer);

// Botão trapaça
document.getElementById('cheatBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o comportamento padrão do link
    console.log('Botão de trapaça clicado');

    // Armazena o estado original das células antes da revelação
    const originalStates = globalBoard.map(row => row.map(cell => ({
        revealed: cell.revealed,
        flagged: cell.flagged,
        adjacentMines: cell.adjacentMines,
        mine: cell.mine, 
        textContent: cell.element.textContent 
    })));

    // Revela todas as células do tabuleiro
    revealBoard(globalBoard, globalRows, globalCols);
    console.log('Todas as células foram reveladas');

    // Aguarda 2 segundos e então oculta as células não reveladas
    setTimeout(function () {
        console.log('Ocultando células não reveladas');
        for (let row = 0; row < globalRows; row++) {
            for (let col = 0; col < globalCols; col++) {
                // Se a célula não foi originalmente revelada, retorne ao estado original
                if (!originalStates[row][col].revealed) {
                    hideCell(globalBoard[row][col]); 
                } else {
                    // Se a célula foi revelada, restaura seu estado
                    globalBoard[row][col].revealed = true;
                    globalBoard[row][col].element.classList.add('revealed'); 

                    // Restaura o texto somente se a célula era uma mina ou tinha minas adjacentes
                    if (originalStates[row][col].mine) {
                        globalBoard[row][col].element.textContent = '💣'; 
                    } else if (originalStates[row][col].adjacentMines > 0) {
                        globalBoard[row][col].element.textContent = originalStates[row][col].adjacentMines; 
                    } else {
                        globalBoard[row][col].element.textContent = ''; 
                    }
                }
            }
        }
        console.log('Células não reveladas foram ocultadas');
    }, 2000); 
});
