<?php
// Composer laadt de classes automatisch (autoloading). Dit is de enige
// require die nog nodig is: hij laadt de autoloader zelf.
require_once __DIR__ . '/../vendor/autoload.php';

// Met "use" zeggen we welke class uit welke namespace we gebruiken
use CatMice\Scoreboard;

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