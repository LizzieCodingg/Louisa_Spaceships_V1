// Game is de "baas" van het spel: maakt objecten aan, luistert naar het
// toetsenbord, controleert botsingen, praat met het PHP-scorebord
// en draait de game loop.
class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // HTML-elementen voor het scorebord (staan in index.php)
        this.saveForm = document.getElementById("saveForm");
        this.nameInput = document.getElementById("nameInput");
        this.saveButton = document.getElementById("saveButton");
        this.scoreList = document.getElementById("scoreList");

        // De 4 plekken waar muizen binnenkomen (midden van elke rand)
        this.spawnPoints = [
            { x: 400, y: -20 },  // boven
            { x: 400, y: 620 },  // onder
            { x: -20, y: 300 },  // links
            { x: 820, y: 300 }   // rechts
        ];

        // Instellingen per level (de kat heeft speed 4).
        // Elk level heeft muizen-instellingen EN een Room (het uiterlijk).
        this.levels = [
            {
                mouseSpeed: 2, spawnInterval: 90,
                room: new Room({
                    name: "Keuken", pattern: "checker",
                    colorA: "#f3e6cc", colorB: "#e3b99a", holeColor: "#3a2418",
                    decorations: [
                        { emoji: "🍳", x: 730, y: 65,  size: 46 },
                        { emoji: "🥛", x: 70,  y: 540, size: 40 },
                        { emoji: "🍞", x: 735, y: 540, size: 40 },
                        { emoji: "🥫", x: 75,  y: 150, size: 36 }
                    ]
                })
            },
            {
                mouseSpeed: 2.5, spawnInterval: 75,
                room: new Room({
                    name: "Woonkamer", pattern: "planks",
                    colorA: "#c9a66b", colorB: "#bf9a5e", lineColor: "#a07f48",
                    holeColor: "#3a2418", rugColor: "#b5546a",
                    decorations: [
                        { emoji: "🪴", x: 735, y: 65,  size: 46 },
                        { emoji: "🛋️", x: 725, y: 540, size: 52 },
                        { emoji: "🧸", x: 70,  y: 540, size: 40 }
                    ]
                })
            },
            {
                mouseSpeed: 3, spawnInterval: 60,
                room: new Room({
                    name: "Zolder", pattern: "planks",
                    colorA: "#8a7458", colorB: "#7d694f", lineColor: "#5f4e3a",
                    holeColor: "#241a10",
                    decorations: [
                        { emoji: "🕸️", x: 745, y: 55,  size: 48 },
                        { emoji: "📦", x: 725, y: 540, size: 46 },
                        { emoji: "🧳", x: 75,  y: 540, size: 42 }
                    ]
                })
            },
            {
                mouseSpeed: 3.5, spawnInterval: 45,
                room: new Room({
                    name: "Kelder", pattern: "bricks",
                    colorA: "#6f7a86", colorB: "#5f6a76", lineColor: "#454e58",
                    holeColor: "#14181d",
                    decorations: [
                        { emoji: "🛢️", x: 735, y: 65,  size: 46 },
                        { emoji: "🍷", x: 70,  y: 540, size: 40 },
                        { emoji: "🪣", x: 735, y: 540, size: 42 }
                    ]
                })
            },
            {
                mouseSpeed: 4.5, spawnInterval: 30,
                room: new Room({
                    name: "Kaasfabriek", pattern: "checker",
                    colorA: "#f6d44d", colorB: "#e8bd2e", holeColor: "#6b4a0a",
                    decorations: [
                        { emoji: "🧀", x: 735, y: 65,  size: 48 },
                        { emoji: "🧀", x: 70,  y: 540, size: 44 },
                        { emoji: "🧀", x: 735, y: 540, size: 52 },
                        { emoji: "🧀", x: 75,  y: 150, size: 38 }
                    ]
                })
            }
        ];

        // true = ingedrukt, false = losgelaten
        // WASD = bewegen, pijltjestoetsen = schieten
        this.keys = {
            w: false, a: false, s: false, d: false,
            arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
        };

        this.setupControls();

        // Klikken op de Opslaan-knop slaat de score op
        this.saveButton.addEventListener("click", () => this.saveScore());

        this.reset();      // zet alle spelgegevens op beginwaarden
        this.loadScores(); // haal het scorebord op uit PHP
    }

    // Zet het spel terug naar het begin (bij opstarten en opnieuw spelen)
    reset() {
        this.cat = new Cat(400, 300);
        this.yarnBalls = [];
        this.mice = [];
        this.score = 0;
        this.gameOver = false;
        this.scoreSaved = false;
        this.currentLevel = 0; // 0 = level 1
        this.spawnTimer = 0;
        this.saveForm.hidden = true;
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            // Typen in het naamveld mag het spel niet beinvloeden.
            // Enter in het naamveld slaat de score op.
            if (e.target === this.nameInput) {
                if (e.key === "Enter" && !e.repeat) this.saveScore();
                return;
            }
            // TIJDELIJK (om de ontwerpen te bekijken): toets 1 t/m 5 springt naar dat level
            if (e.key >= "1" && e.key <= "5") {
                this.currentLevel = Number(e.key) - 1;
            }

            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = true;
                e.preventDefault(); // voorkomt scrollen met de pijltjes
            }

            // Enter start een nieuw spel, maar pas nadat de score is opgeslagen
            if (e.key === "Enter" && !e.repeat && this.gameOver && this.scoreSaved) {
                this.reset();
            }
        });

        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = false;
        });
    }

    start() {
        this.loop();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    // Maakt een muis aan op een willekeurig spawnpunt van de 4
    spawnMouse() {
        const level = this.levels[this.currentLevel];
        const index = Math.floor(Math.random() * this.spawnPoints.length);
        const point = this.spawnPoints[index];

        this.mice.push(new Mouse(point.x, point.y, level.mouseSpeed));
    }

    update() {
        // Bij game over staat alles stil
        if (this.gameOver) return;

        this.cat.update(this.keys);

        // Schietrichting uit de pijltjestoetsen
        const dirX = (this.keys.arrowright ? 1 : 0) - (this.keys.arrowleft ? 1 : 0);
        const dirY = (this.keys.arrowdown ? 1 : 0) - (this.keys.arrowup ? 1 : 0);

        const yarn = this.cat.shoot(dirX, dirY);
        if (yarn) this.yarnBalls.push(yarn);

        for (const ball of this.yarnBalls) {
            ball.update();
        }

        // Muizen laten spawnen
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnMouse();
            this.spawnTimer = this.levels[this.currentLevel].spawnInterval;
        }

        for (const mouse of this.mice) {
            mouse.update(this.cat);
        }

        this.checkCollisions();

        // Gooi kluwens weg die buiten beeld zijn
        this.yarnBalls = this.yarnBalls.filter(ball => !ball.isOffscreen());
    }

    // Controleert alle botsingen in het spel
    checkCollisions() {
        // 1. Kluwen raakt muis: de muis verliest hp en de kluwen verdwijnt
        for (const ball of this.yarnBalls) {
            for (const mouse of this.mice) {
                if (mouse.hp > 0 && ball.collidesWith(mouse)) {
                    mouse.hp--;
                    ball.x = -9999; // buiten beeld, wordt zo weggegooid
                    if (mouse.hp <= 0) this.score += 10;
                    break; // een kluwen kan maar 1 muis raken
                }
            }
        }

        // 2. Muis raakt kat: de muis verdwijnt ALTIJD bij aanraking.
        // takeHit() in Cat checkt zelf of de kat onkwetsbaar is.
        for (const mouse of this.mice) {
            if (mouse.hp > 0 && mouse.collidesWith(this.cat)) {
                this.cat.takeHit();
                mouse.hp = 0;
            }
        }

        // Gooi dode muizen weg
        this.mice = this.mice.filter(mouse => mouse.hp > 0);

        // Geen levens meer = game over. Omdat update() daarna stopt,
        // gebeurt dit maar 1x per spel.
        if (this.cat.lives <= 0) {
            this.gameOver = true;
            this.showSaveForm();
        }
    }

    // Toont het naamveld en zet de cursor erin
    showSaveForm() {
        this.saveForm.hidden = false;
        this.nameInput.value = "";
        this.nameInput.focus();
    }

    // Stuurt naam + score naar PHP (save_score.php) met fetch
    async saveScore() {
        if (this.scoreSaved) return; // voorkomt dubbel opslaan
        this.scoreSaved = true;

        try {
            await fetch("php/save_score.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: this.nameInput.value, score: this.score })
            });
        } catch (error) {
            console.error("Score opslaan mislukt:", error);
        }

        this.saveForm.hidden = true;
        this.nameInput.blur(); // zodat Enter daarna het spel herstart
        this.loadScores();     // ververs het scorebord
    }

    // Haalt de top 10 op bij PHP (get_scores.php) en zet ze in de lijst
    async loadScores() {
        try {
            const response = await fetch("php/get_scores.php");
            const scores = await response.json();

            this.scoreList.innerHTML = "";
            for (const entry of scores) {
                const item = document.createElement("li");
                item.textContent = entry.name + " - " + entry.score;
                this.scoreList.appendChild(item);
            }
        } catch (error) {
            console.error("Scorebord laden mislukt:", error);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Eerst de kamer (vloer), daarna alles wat erbovenop beweegt
        this.levels[this.currentLevel].room.draw(this.ctx);

        for (const ball of this.yarnBalls) {
            ball.draw(this.ctx);
        }
        for (const mouse of this.mice) {
            mouse.draw(this.ctx);
        }
        this.cat.draw(this.ctx);

        this.drawHud();

        if (this.gameOver) {
            this.drawGameOver();
        }
    }

    // Tekent score, levens en de naam van de kamer
    drawHud() {
        this.ctx.font = "28px Fredoka, Arial";
        this.ctx.textBaseline = "top";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "rgba(43, 27, 10, 0.85)";
        this.ctx.fillStyle = "#fff4de";

        this.ctx.textAlign = "left";
        this.ctx.strokeText("Score: " + this.score, 15, 12);
        this.ctx.fillText("Score: " + this.score, 15, 12);
        this.ctx.fillText("❤️".repeat(Math.max(0, this.cat.lives)), 15, 48);

        // Levelnaam rechtsboven
        const room = this.levels[this.currentLevel].room;
        const label = "Level " + (this.currentLevel + 1) + ": " + room.name;
        this.ctx.textAlign = "right";
        this.ctx.strokeText(label, 785, 12);
        this.ctx.fillText(label, 785, 12);
    }

    // Donkere laag met tekst als het spel voorbij is
    drawGameOver() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#f2e8d5";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "56px Fredoka, Arial";
        this.ctx.fillText("Game over", 400, 250);
        this.ctx.font = "30px Fredoka, Arial";
        this.ctx.fillText("Score: " + this.score, 400, 310);

        // De tekst eronder hangt af van of de score al is opgeslagen
        if (this.scoreSaved) {
            this.ctx.fillText("Druk op Enter om opnieuw te spelen", 400, 360);
        } else {
            this.ctx.fillText("Vul hieronder je naam in en druk op Enter", 400, 360);
        }
    }
}