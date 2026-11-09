<?php
// Dit is de hoofdpagina van het spel. We gebruiken .php zodat we later
// het scorebord (PHP) op dezelfde pagina kunnen tonen.
?>
<!doctype html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat vs Mice</title>

    <!-- Ronde lettertype (Fredoka) van Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Cat vs Mice</h1>

    <!-- Het canvas is het "tekenvlak" waar JavaScript het spel op tekent -->
    <canvas id="gameCanvas" width="800" height="600"></canvas>

    <!-- Verschijnt bij game over: naam invullen om je score op te slaan -->
    <div id="saveForm" hidden>
        <p class="speech">🐱 Mauw! Hoe heet je?</p>
        <div class="nameRow">
            <input id="nameInput" type="text" maxlength="15" placeholder="Jouw naam" autocomplete="off">
            <button id="saveButton" type="button">🐾 Opslaan</button>
        </div>
    </div>

    <!-- Het scorebord: wordt door JavaScript gevuld met data uit PHP -->
    <div id="scoreCard">
        <h2>🏆 Top Cats</h2>
        <ol id="scoreList"></ol>
    </div>

    <!-- Het scorebord: wordt door JavaScript gevuld met data uit PHP -->
    <h2>Top Cats</h2>
    <ol id="scoreList"></ol>

    <!-- Hier laden we de classes -->
   <script src="js/Entity.js"></script>
   <script src="js/Cat.js"></script>
   <script src="js/YarnBall.js"></script>
   <script src="js/Mouse.js"></script>
   <script src="js/Room.js"></script>
   <script src="js/Game.js"></script>

   <script>
       const game = new Game(document.getElementById("gameCanvas"));
       game.start();
   </script>
</body>
</html>