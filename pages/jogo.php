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
    <title>Campo Minado - Jogo</title>
    <link rel="stylesheet" href="../css/jogo.css">
    <link rel="icon" type="image/png" href="../images/logo.png">
</head>

<body>
    <header>
        <a href="index.php" class="btn voltar">Voltar</a>
    </header>

    <section class="container">
        <div class="row center">
            <div class="game-container">
                <div class="game-actions">
                    <a> Usuário: <?php echo htmlspecialchars($_SESSION['username']); ?></a>
                    <a href="#" class="btn cheat" id="cheatBtn">Trapaça</a>
                    <a href="jogo.php" class="btn reiniciar">Reiniciar</a>
                    <a href="#historico" class="btn">Histórico</a>
                </div>
            </div>
            <div id="game">
                <div class="time-container">
                    <p>Tempo: <span id="timer">00:00</span></p>
                </div>
                <div id="game-board"></div>
            </div>
            <div class="game-info">
                <p>Bombas Restantes: <span id="bombs-count">10</span></p>
                <p>Configuração: <span id="config">12x12</span></p>
                <p>Modalidade: <span id="mode">Rivotril</span></p>
            </div>
        </div>
    </section>

    <section id="historico" class="historico center">
        <div class="leaderboard-container">
            <div class="ranking-section">
                <img src="../images/cogumelo.gif" alt="GIF animado">
                <h1>Histórico de Partidas</h1>
            </div>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>USUÁRIO</th>
                        <th>TAMANHO</th>
                        <th>BOMBAS</th>
                        <th>MODO</th>
                        <th>STATUS</th>
                        <th>TEMPO</th>
                        <th>DATA</th>
                    </tr>
                </thead>
                <tbody id="history-body"></tbody>
            </table>
        </div>
    </section>
    
    <script>
    const username = "<?php echo htmlspecialchars($_SESSION['username']); ?>";
    </script>

    <script src="../js/jogo.js"></script>
</body>

</html>
