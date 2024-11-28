<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campo Minado</title>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="icon" type="image/png" href="../images/logo.png">
</head>

<body>
    <nav>
        <img src="../images/logo_index.png" alt="Logo da MiniMax BOOM" class="imagem-absoluta">
        <div class="button-container">
            <a href="#manual" class="btn">Como Jogar?</a>
            <a href="#ranking" class="btn">Ranking</a>
            <a href="../pages/perfil.php" class="btn">Atualizar Perfil</a>
        </div>
        <div class="user-info">
            Olá, <?php echo htmlspecialchars($_SESSION['username']); ?>!
        </div>
        <div class="sair">
            <a href="../php/logout.php" class="btn btn-sair">Sair</a>
        </div>
    </nav>
    
    <div id="top" class="welcome-section">
        <div class="welcome-text">
            <h1>Bem-vindo ao <br>Campo Minado, <?php echo htmlspecialchars($_SESSION['username']); ?>! </h1>
        </div>
        <div class="options">
            <div class="option-box">
                <h2>Tamanho da Grade</h2>
                <div class="option-group">
                    <input type="radio" id="10x10" name="grid-size" value="10x10">
                    <label for="10x10">10x10</label>
                    <input type="radio" id="15x15" name="grid-size" value="15x15">
                    <label for="15x15">15x15</label>
                    <input type="radio" id="custom" name="grid-size" value="personalizado">
                    <label for="personalizado">Personalizado</label>
                </div>

                <!-- Aqui está o campo que será mostrado quando "Personalizado" for selecionado -->
                <div id="custom-size-input" style="display: none; margin-top: 10px;">
                    <label for="custom-rows">Linhas (até 25):</label>
                    <input type="number" id="custom-rows" min="1" max="25" value="10">

                    <label for="custom-cols">Colunas (até 25):</label>
                    <input type="number" id="custom-cols" min="1" max="25" value="10">
                </div>
            </div>

            <div class="option-box">
                <h2>Quantidade de Bombas</h2>
                <div class="option-group">
                    <input type="radio" id="bomb-15" name="bomb-count" value="15">
                    <label for="bomb-15">15 bombas</label>
                    <input type="radio" id="bomb-20" name="bomb-count" value="20">
                    <label for="bomb-20">20 bombas</label>
                    <input type="radio" id="bomb-custom" name="bomb-count" value="personalizado">
                    <label for="bomb-custom">Personalizado</label>
                </div>

                <!-- Campo de input que será exibido ao selecionar a opção "Personalizado" -->
                <div id="custom-bombs-input" style="display: none; margin-top: 10px;">
                    <label for="custom-bombs">Número de bombas (até o limite de espaços):</label>
                    <input type="number" id="custom-bombs" min="1" value="10">
                </div>
            </div>

            <div class="option-box">
                <h2>Modo de Jogo</h2>
                <div class="option-group">
                    <input type="radio" id="classic" name="game-mode" value="clássico">
                    <label for="classico">Clássico</label>
                    <input type="radio" id="rivotril" name="game-mode" value="rivotril">
                    <label for="rivotril">Rivotril</label>
                </div>
            </div>
        </div>

        <a href="jogo.php" id="btn-jogar" class="btn-jogar">
            <img src="../images/botao-jogar.png" alt="Jogar">
        </a>
    </div>
    <section id="ranking" class="ranking">
        <div class="leaderboard-container">
            <div class="ranking-section">
                <img src="../images/trofeu.webp" alt="GIF animado">
                <h2>Ranking</h2>
            </div>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>RANK</th>
                        <th>USUÁRIO</th>
                        <th>TAMANHO</th>
                        <th>BOMBAS</th>
                        <th>MODO</th>
                        <th>TEMPO</th>
                        <th>DATA</th>
                    </tr>
                </thead>
            <tbody id="leaderboard-body"></tbody>
</table>
        </div>
    </section>

    <section class="manual">
        <div>
            <p><br></p>
            <h2>Como Jogar?</h2>
            <ul>
                <li>Use o botão direito do mouse para selecionar um bloco e verificar se ele está vazio <br>ou se tem
                    uma mina;</li>
                <li>Se aparecer uma mina, você perde. Se aparecer um número, significa que ele está vazio;</li>
                <li>Cada número indica quantas minas estão ao redor do bloco com o número;</li>
                <li>Use o botão esquerdo do mouse para indicar que um bloco tem uma mina;</li>
                <li>O jogo termina quando não houverem mais blocos vazios.</li>
            </ul>
            <h2>Modo de Jogo</h2>
            <ul>
                <li><strong>Clássico:</strong> o cronômetro começa assim que você clica em "Jogar" e continua até que o
                    <br>jogo termine.
                </li>
                <li><strong>Rivotril:</strong> um cronômetro regressivo é iniciado, e o jogador precisa terminar a
                    partida <br>antes que o tempo acabe. Caso contrário, a partida será registrada como uma "derrota"
                    <br>no histórico.
                </li>
            </ul>
            <h2 id="manual">Recurso Adicional</h2>
            <ul>
                <li><strong>Trapaça:</strong> temporariamente revela todas as células do tabuleiro. Após o tempo de
                    <br>exibição permitido, as células não abertas retomam ao estado original, sem impactar o
                    <br>progresso do jogo.
                </li>
            </ul>
        </div>
        <div class="button-comecar">
            <a href="#top" class="btn">Começar</a>
        </div>
    </section>

    <script src="../js/index.js"></script>
</body>

</html>
