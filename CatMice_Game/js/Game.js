// Game is de "baas" van het spel: maakt objecten aan, luistert naar het
// toetsenbord, controleert botsingen en draait de game loop.
class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // De 4 plekken waar muizen binnenkomen (midden van elke rand)
        this.spawnPoints = [
            { x: 400, y: -20 },  // boven
            { x: 400, y: 620 },  // onder
            { x: -20, y: 300 },  // links
            { x: 820, y: 300 }   // rechts
        ];

        // Instellingen per level (de kat heeft speed 4)
        this.levels = [
            { mouseSpeed: 2,   spawnInterval: 90 },  // level 1
            { mouseSpeed: 2.5, spawnInterval: 75 },  // level 2
            { mouseSpeed: 3,   spawnInterval: 60 },  // level 3
            { mouseSpeed: 3.5, spawnInterval: 45 },  // level 4
            { mouseSpeed: 4.5, spawnInterval: 30 }   // level 5
        ];

        // true = ingedrukt, false = losgelaten
        // WASD = bewegen, pijltjestoetsen = schieten
        this.keys = {
            w: false, a: false, s: false, d: false,
            arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
        };

        this.setupControls();
        this.reset(); // zet alle spelgegevens op beginwaarden
    }

    // Zet het spel terug naar het begin. Wordt bij het opstarten en
    // bij opnieuw proberen gebruikt, zodat we de code maar 1x hoeven te schrijven.
    reset() {
        this.cat = new Cat(400, 300);
        this.yarnBalls = [];
        this.mice = [];
        this.score = 0;
        this.gameOver = false;
        this.currentLevel = 0; // 0 = level 1
        this.spawnTimer = 0;
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = true;
                e.preventDefault(); // voorkomt scrollen met de pijltjes
            }

            // Enter start een nieuw spel als je game over bent
            if (e.key === "Enter" && this.gameOver) {
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
                    ball.x = -9999; // buiten beeld, wordt zo door isOffscreen() weggegooid
                    if (mouse.hp <= 0) this.score += 10;
                    break; // een kluwen kan maar 1 muis raken
                }
            }
        }

        // 2. Muis raakt kat: de kat verliest een leven en de muis verdwijnt
        for (const mouse of this.mice) {
            if (mouse.hp > 0 && mouse.collidesWith(this.cat)) {
                this.cat.takeHit();
                mouse.hp = 0;
            }
        }

        // Gooi dode muizen weg
        this.mice = this.mice.filter(mouse => mouse.hp > 0);

        // Geen levens meer = game over
        if (this.cat.lives <= 0) {
            this.gameOver = true;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

    // Tekent score en levens linksboven
    drawHud() {
        this.ctx.fillStyle = "#2b1b0a";
        this.ctx.font = "28px Fredoka, Arial";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Score: " + this.score, 15, 12);
        this.ctx.fillText("❤️".repeat(Math.max(0, this.cat.lives)), 15, 48);
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
        this.ctx.fillText("Druk op Enter om opnieuw te spelen", 400, 360);
    }
}