<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

require '../php/db_connect.php';

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['name'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($nome) || empty($telefone) || empty($email) || empty($username)) {
        $error = "Por favor, preencha todos os campos.";
    } else {
        $stmt = $conn->prepare("SELECT * FROM users WHERE (username = :username OR email = :email) AND id != :id");
        $stmt->execute([
            'username' => $username,
            'email' => $email,
            'id' => $user_id
        ]);

        if ($stmt->rowCount() > 0) {
            $error = "Nome de usuário ou e-mail já está em uso.";
        } else {
            if (!empty($password)) {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET nome = :nome, telefone = :telefone, email = :email, username = :username, password = :password WHERE id = :id");
                $stmt->execute([
                    'nome' => $nome,
                    'telefone' => $telefone,
                    'email' => $email,
                    'username' => $username,
                    'password' => $hashed_password,
                    'id' => $user_id
                ]);
            } else {
                $stmt = $conn->prepare("UPDATE users SET nome = :nome, telefone = :telefone, email = :email, username = :username WHERE id = :id");
                $stmt->execute([
                    'nome' => $nome,
                    'telefone' => $telefone,
                    'email' => $email,
                    'username' => $username,
                    'id' => $user_id
                ]);
            }

            $_SESSION['username'] = $username;

            $success = "Perfil atualizado com sucesso.";

            $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->execute(['id' => $user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
} else {
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        die("Usuário não encontrado.");
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campo Minado - Atualizar Perfil</title>
    <link rel="stylesheet" href="../css/login.css"> 
    <link rel="icon" type="image/png" href="../images/logo.png"> 
</head>
<body>
    <div class="perfil-container">
        <h2>Atualizar Perfil: <?php echo htmlspecialchars($_SESSION['username']); ?></h2>

        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <?php if (isset($success)): ?>
            <div class="success-message"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>

        <form id="profileForm" method="POST">
            <div class="form-group">
                <label for="name">Nome Completo:</label>
                <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($user['nome']); ?>" required>
            </div>

            <div class="form-group-row">
                <div class="form-group">
                    <label for="telefone">Telefone:</label>
                    <input type="tel" id="telefone" name="telefone" value="<?php echo htmlspecialchars($user['telefone']); ?>" required>
                </div>
            </div>

            <div class="form-group-row">
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                </div>
            </div>

            <div class="form-group-row"> 
                <div class="form-group">
                    <label for="username">Usuário:</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>
                </div>

                <div class="form-group">
                    <label for="password">Senha (deixe em branco para não alterar):</label>
                    <input type="password" id="password" name="password" placeholder="Digite sua nova senha">
                </div>
            </div>

            <div class="container">
                <button type="submit" class="btn">Atualizar</button>
            </div>
        </form>
    </div>

    <script src="../js/validacao.js"></script>
</body>
</html>