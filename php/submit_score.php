<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    die("Usuário não autenticado.");
}

$user_id = $_SESSION['user_id'];
$grid_size = $_POST['grid_size'];
$bomb_count = $_POST['bomb_count'];
$game_mode = $_POST['game_mode'];
$time_spent = $_POST['time_spent'];
$status = $_POST['status'];

if (empty($grid_size) || empty($bomb_count) || empty($game_mode) || empty($time_spent) || empty($status)) {
    die("Dados incompletos.");
}

$time_spent_formatted = date('H:i:s', strtotime($time_spent));

$stmt = $conn->prepare("INSERT INTO scores (user_id, grid_size, bomb_count, game_mode, time_spent, status) VALUES (:user_id, :grid_size, :bomb_count, :game_mode, :time_spent, :status)");
$stmt->execute([
    'user_id' => $user_id,
    'grid_size' => $grid_size,
    'bomb_count' => $bomb_count,
    'game_mode' => $game_mode,
    'time_spent' => $time_spent_formatted,
    'status' => $status
]);

echo "Score registrado com sucesso.";
?>