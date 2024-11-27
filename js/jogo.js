// Variáveis globais
let globalBoard, globalRows, globalCols, globalNumMines;
let revealedCells = 0;
let globalGameMode;
let timeLeft; 
let isGameOver = false;


document.addEventListener('DOMContentLoaded', function () {
    const gridSize = localStorage.getItem('gridSize');
    const bombCountWithSuffix = localStorage.getItem('bombCount');
    const gameMode = localStorage.getItem('gameMode');
    globalGameMode = gameMode; 
    document.getElementById('mode').textContent = gameMode === 'rivotril' ? "Rivotril (Tempo Limitado)" : "Clássico";



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
    return totalCells; 
}

// Função de contagem regressiva
function startCountdownTimer() {
    if (isTimerStarted) return; 
    isTimerStarted = true;

    const timerElement = document.getElementById("timer");
    timeLeft = calculateTimeLimit(globalRows, globalCols); 

    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            // Calcula minutos e segundos
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            // Formata o tempo para ficar no estilo 00:00
            const formattedTime = 
                `${minutes < 10 ? '0' : ''}${minutes}:` + 
                `${seconds < 10 ? '0' : ''}${seconds}`;

            // Exibe o tempo restante no formato 00:00
            timerElement.textContent = formattedTime;

        } else {
            clearInterval(timerInterval);
            alert("Tempo esgotado! Você perdeu.");
            revealBoard(globalBoard, globalRows, globalCols); 
        }
    }, 1000); 
}


// Criação do tabuleiro
function createBoard(rows, cols, numMines) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    globalRows = rows;
    globalCols = cols;
    globalNumMines = numMines;

    const cellSize = 400 / Math.max(rows, cols);
    const fontSize = Math.max(10, cellSize * 0.6) + 'px';

    document.documentElement.style.setProperty('--cell-font-size', fontSize);

    const board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            revealed: false,
            flagged: false,
            element: null,
            adjacentMines: 0,
            originallyRevealed: false 
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
    if (isGameOver) return; // Impede ações após o fim do jogo

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

    checkVictory(board, rows, cols, numMines);
}

function handleRightClick(event, board) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed) {
        return;
    }

    const remainingBombsElement = document.getElementById('bombs-count');
    let remainingBombs = parseInt(remainingBombsElement.textContent);

    if (!board[row][col].flagged && remainingBombs === 0) {
        alert("Você não tem mais bandeiras disponíveis.");
        return;
    }

    board[row][col].flagged = !board[row][col].flagged;

    if (board[row][col].flagged) {
        board[row][col].element.textContent = '🚩';
        remainingBombsElement.textContent = remainingBombs - 1;
    } else {
        board[row][col].element.textContent = '';
        remainingBombsElement.textContent = remainingBombs + 1;
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

let gameOverDisplayed = false; 

function gameOver(board, rows, cols) {
    if (gameOverDisplayed) return;
    gameOverDisplayed = true;
    isGameOver = true; // Marca o jogo como terminado

    alert('Você perdeu!');
    stopTimer();
    document.getElementById('bombs-count').textContent = '0';

    revealBoard(board, rows, cols);
}

// Verificação de vitória
function checkVictory(board, rows, cols, numMines) {
    if (isGameOver) return;


    let flaggedMines = 0;
    let revealedCells = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = board[row][col];

            // Verifica se a célula contém uma bomba
            if (cell.mine) {
                // Verifica se a célula com bomba está marcada com bandeira
                if (cell.flagged) {
                    flaggedMines++;
                }
            } else {
                // Verifica se a célula sem bomba está revelada
                if (cell.revealed) {
                    revealedCells++;
                }
            }
        }
    }

    // Verifica se todas as bombas foram corretamente marcadas e todas as células sem bomba foram reveladas
    if (flaggedMines === numMines || revealedCells === (rows * cols - numMines)) {
        alert('Você venceu!');
        stopTimer();
        revealBoard(board, rows, cols); // Revela o tabuleiro como prêmio
    }
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
document.getElementById("game-board").addEventListener("click", function() {
    if (globalGameMode === 'clássico') {
        startTimer();
    } else if (globalGameMode === 'rivotril') {
        startCountdownTimer(); 
    }
});

// Botão trapaça
document.getElementById('cheatBtn').addEventListener('click', function(event) {
    event.preventDefault(); 
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
                    // Se a célula estava sinalizada com bandeirinha, restaura a bandeirinha
                    if (originalStates[row][col].flagged) {
                        globalBoard[row][col].flagged = true;
                        globalBoard[row][col].element.textContent = '🚩'; 
                    }
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