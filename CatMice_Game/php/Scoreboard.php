<?php
// Scoreboard is een class (blauwdruk) die de scores beheert.
// Net als Spaceship bevat het eigenschappen (data) en methodes (acties).
class Scoreboard
{
    // PRIVATE: alleen deze class mag direct bij het bestandspad.
    // Andere code moet via de methodes hieronder. Dat heet encapsulation.
    private $file;

    // De constructor krijgt het pad naar het JSON-bestand mee
    public function __construct($file)
    {
        $this->file = $file;
    }

    // Voegt een nieuwe score toe en slaat alles op
    public function addScore($name, $score)
    {
        // Schoonmaken: spaties weghalen, maximaal 15 tekens,
        // en HTML-tekens onschadelijk maken
        $name = trim($name);
        $name = mb_substr($name, 0, 15);
        $name = htmlspecialchars($name);

        // Een lege naam wordt "Anoniem"
        if ($name === "") {
            $name = "Anoniem";
        }

        $scores = $this->loadScores();
        $scores[] = ["name" => $name, "score" => (int)$score];
        $this->saveScores($scores);
    }

    // Geeft de beste scores terug, hoogste eerst
    public function getTopScores($limit = 10)
    {
        $scores = $this->loadScores();

        // Sorteer van hoog naar laag op score
        usort($scores, function ($a, $b) {
            return $b["score"] - $a["score"];
        });

        // array_slice pakt alleen de eerste $limit items
        return array_slice($scores, 0, $limit);
    }

    // PRIVATE hulpmethode: leest het JSON-bestand.
    // Bestaat het bestand nog niet, dan geven we een lege lijst terug.
    private function loadScores()
    {
        if (!file_exists($this->file)) {
            return [];
        }

        $json = file_get_contents($this->file);
        $scores = json_decode($json, true);

        // Als het bestand leeg of kapot is, begin dan met een lege lijst
        return is_array($scores) ? $scores : [];
    }

    // PRIVATE hulpmethode: schrijft de lijst naar het JSON-bestand.
    // LOCK_EX voorkomt dat twee spelers tegelijk het bestand beschadigen.
    private function saveScores($scores)
    {
        file_put_contents($this->file, json_encode($scores), LOCK_EX);
    }
}