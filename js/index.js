document.addEventListener('DOMContentLoaded', function() {
    const customRadio = document.getElementById('custom');
    const customSizeInput = document.getElementById('custom-size-input');
    const gridRadios = document.querySelectorAll('input[name="grid-size"]');
    const customRowsInput = document.getElementById('custom-rows');
    const customColsInput = document.getElementById('custom-cols');
    const customBombRadio = document.getElementById('bomb-custom');
    const customBombInput = document.getElementById('custom-bombs-input');
    const customBombsInputField = document.getElementById('custom-bombs');
    let maxBombsAllowed = 0;

    function updateMaxBombs() {
        let selectedGridSize = document.querySelector('input[name="grid-size"]:checked')?.value;
        let rows, cols;

        if (selectedGridSize === 'personalizado') {
            rows = Math.min(parseInt(customRowsInput.value) || 0, 25);
            cols = Math.min(parseInt(customColsInput.value) || 0, 25);
        } else if (selectedGridSize) {
            [rows, cols] = selectedGridSize.split('x').map(Number);
        }

        const totalCells = rows * cols;
        maxBombsAllowed = totalCells > 1 ? totalCells - 1 : 0;

        customBombsInputField.max = maxBombsAllowed;
        customBombsInputField.placeholder = `Max ${maxBombsAllowed}`;
    }

    function validateCustomInput() {
        const rows = Math.min(parseInt(customRowsInput.value) || 0, 25);
        const cols = Math.min(parseInt(customColsInput.value) || 0, 25);
        customRowsInput.value = rows;
        customColsInput.value = cols;

        if (rows > 25) alert("O número máximo de linhas é 25.");
        if (cols > 25) alert("O número máximo de colunas é 25.");
    }

    function validateBombCount(bombCount) {
        if (bombCount > maxBombsAllowed) {
            alert(`O número máximo de bombas é ${maxBombsAllowed} para o tamanho do tabuleiro atual.`);
            return false;
        }
        return true;
    }

    // Atualiza o máximo de bombas permitido quando o tamanho do grid muda
    gridRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            customSizeInput.style.display = customRadio.checked ? 'block' : 'none';
            updateMaxBombs();
        });
    });

    customRowsInput.addEventListener('input', function() {
        validateCustomInput();
        updateMaxBombs();
    });

    customColsInput.addEventListener('input', function() {
        validateCustomInput();
        updateMaxBombs();
    });

    // Seleciona todos os botões de rádio do grupo "bomb-count"
    const bombRadios = document.querySelectorAll('input[name="bomb-count"]');

    // Adiciona um listener a cada botão de rádio para mostrar ou esconder o campo personalizado
    bombRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            customBombInput.style.display = customBombRadio.checked ? 'block' : 'none';
        });
    });

    customBombsInputField.addEventListener('input', function() {
        const bombs = parseInt(customBombsInputField.value) || 0;
        validateBombCount(bombs);
    });

    updateMaxBombs();

    document.getElementById('btn-jogar').addEventListener('click', function(event) {
        event.preventDefault();

        const gridSize = document.querySelector('input[name="grid-size"]:checked')?.value;
        const gameMode = document.querySelector('input[name="game-mode"]:checked')?.value;
        let bombCount;

        if (gridSize === 'personalizado') {
            const customRows = customRowsInput.value;
            const customCols = customColsInput.value;
            bombCount = customBombRadio.checked ? customBombsInputField.value : document.querySelector('input[name="bomb-count"]:checked')?.value;

            localStorage.setItem('gridSize', `${customRows}x${customCols}`);

            if (!validateBombCount(bombCount)) return; // Validação do número de bombas
        } else {
            bombCount = customBombRadio.checked ? customBombsInputField.value : document.querySelector('input[name="bomb-count"]:checked')?.value;
            localStorage.setItem('gridSize', gridSize);
        }

        if (!bombCount || !gameMode) {
            alert("Por favor, selecione todas as opções antes de continuar.");
            return;
        }

        localStorage.setItem('bombCount', bombCount + " bombas");
        localStorage.setItem('gameMode', gameMode);

        window.location.href = '../pages/jogo.php';
    });
    
    loadHighScores();
});

function loadHighScores() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_highscores.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const scores = JSON.parse(xhr.responseText);
            const leaderboardBody = document.getElementById('leaderboard-body');
            leaderboardBody.innerHTML = ''; // Limpa o conteúdo existente

            scores.forEach((score, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${score.username}</td>
                    <td>${score.grid_size}</td>
                    <td>${score.bomb_count}</td>
                    <td>${score.game_mode}</td>
                    <td>${score.time_spent}</td>
                    <td>${new Date(score.date_played).toLocaleDateString('pt-BR')}</td>
                `;
                leaderboardBody.appendChild(tr);
            });
        }
    };
    xhr.send();
}