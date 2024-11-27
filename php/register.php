<?php
require 'db_connect.php';

$nome = $_POST['name'];
$data_nasc = $_POST['data'];
$telefone = $_POST['telefone'];
$cpf = $_POST['cpf'];
$email = $_POST['email'];
$username = $_POST['username'];
$password = $_POST['password'];

if (empty($nome) || empty($data_nasc) || empty($telefone) || empty($cpf) || empty($email) || empty($username) || empty($password)) {
    die("Por favor, preencha todos os campos.");
}

$stmt = $conn->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
$stmt->execute(['username' => $username, 'email' => $email]);

if ($stmt->rowCount() > 0) {
    die("Nome de usuário ou e-mail já cadastrado.");
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (nome, data_nasc, telefone, cpf, email, username, password) VALUES (:nome, :data_nasc, :telefone, :cpf, :email, :username, :password)");
$stmt->execute([
    'nome' => $nome,
    'data_nasc' => $data_nasc,
    'telefone' => $telefone,
    'cpf' => $cpf,
    'email' => $email,
    'username' => $username,
    'password' => $hashed_password
]);

header("Location: ../pages/login.html");
exit();
?>
