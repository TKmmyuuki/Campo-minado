document.getElementById('btn-jogar').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link

    // Captura as opções selecionadas
    const gridSize = document.querySelector('input[name="grid-size"]:checked')?.value;
    let bombCount = document.querySelector('input[name="bomb-count"]:checked')?.value;
    const gameMode = document.querySelector('input[name="game-mode"]:checked')?.value;

    // Verifica se todas as opções foram selecionadas
    if (!gridSize || !bombCount || !gameMode) {
        alert("Por favor, selecione todas as opções antes de continuar.");
        return;
    }

    // Formata corretamente o bombCount para adicionar "bombas"
    bombCount = bombCount + " bombas";  // Garante que o valor tenha o sufixo correto

    // Armazena as opções no localStorage
    localStorage.setItem('gridSize', gridSize);
    localStorage.setItem('bombCount', bombCount);
    localStorage.setItem('gameMode', gameMode);

    // Redireciona para a página do jogo
    window.location.href = '../pages/jogo.html';
});
