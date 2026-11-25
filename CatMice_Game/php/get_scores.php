<?php
require_once __DIR__ . '/../vendor/autoload.php';

use CatMice\Scoreboard;

header("Content-Type: application/json");

$scoreboard = new Scoreboard("scores.json");
echo json_encode($scoreboard->getTopScores(10));