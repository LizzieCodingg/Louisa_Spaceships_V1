<?php
// Dit bestand geeft de top 10 terug aan JavaScript, als JSON.
include_once 'Scoreboard.php';

header("Content-Type: application/json");

$scoreboard = new Scoreboard("scores.json");
echo json_encode($scoreboard->getTopScores(10));