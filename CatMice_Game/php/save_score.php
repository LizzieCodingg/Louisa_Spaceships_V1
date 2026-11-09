<?php
// Dit bestand ontvangt een score van JavaScript (fetch) en slaat hem op.
include_once 'Scoreboard.php';

header("Content-Type: application/json");

// JavaScript stuurt JSON, dat lezen we hier uit de "body" van het verzoek
$data = json_decode(file_get_contents("php://input"), true);

// Controleer of de gegevens kloppen voordat we iets opslaan
if (!isset($data["name"]) || !isset($data["score"]) || !is_numeric($data["score"])) {
    http_response_code(400); // 400 = ongeldig verzoek
    echo json_encode(["success" => false]);
    exit;
}

// Maak een Scoreboard-object en voeg de score toe
$scoreboard = new Scoreboard("scores.json");
$scoreboard->addScore($data["name"], $data["score"]);

echo json_encode(["success" => true]);