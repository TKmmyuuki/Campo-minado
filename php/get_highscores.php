<?php
require 'db_connect.php';

$stmt = $conn->prepare("
    SELECT s.*, u.username
    FROM scores s
    JOIN users u ON s.user_id = u.id
    WHERE s.status = 'vitória'
    ORDER BY TIME_TO_SEC(s.time_spent) ASC
    LIMIT 10
");
$stmt->execute();
$scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($scores);
?>