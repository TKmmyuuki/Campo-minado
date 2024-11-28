<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    die("Usuário não autenticado.");
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT *
    FROM scores
    WHERE user_id = :user_id
    ORDER BY date_played DESC
    LIMIT 10
");
$stmt->execute(['user_id' => $user_id]);
$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($scores);
?>