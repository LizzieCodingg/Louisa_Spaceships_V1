// Game is de "baas" van het spel: maakt objecten aan, luistert naar het
// toetsenbord en draait de game loop.
class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.cat = new Cat(400, 300);
        this.yarnBalls = []; // alle kluwens die nu in de lucht zijn
        this.mice = [];      // alle muizen die nu rondlopen

        // De 4 plekken waar muizen binnenkomen, zoals in Prairie King:
        // het midden van elke rand, net buiten beeld zodat ze naar binnen lopen.
        this.spawnPoints = [
            { x: 400, y: -20 },  // boven
            { x: 400, y: 620 },  // onder
            { x: -20, y: 300 },  // links
            { x: 820, y: 300 }   // rechts
        ];

        // Instellingen per level. Voor nu gebruiken we alleen level 1 (index 0).
        // De kat heeft speed 4, dus level 1 heeft muizen met speed 2: langzamer.
        // De waarden van level 2 t/m 5 zijn tijdelijke gokjes, die tunen we later.
        // spawnInterval = aantal frames tussen twee muizen (60 frames = 1 seconde)
        this.levels = [
            { mouseSpeed: 2,   spawnInterval: 90 },  // level 1
            { mouseSpeed: 2.5, spawnInterval: 75 },  // level 2
            { mouseSpeed: 3,   spawnInterval: 60 },  // level 3
            { mouseSpeed: 3.5, spawnInterval: 45 },  // level 4
            { mouseSpeed: 4.5, spawnInterval: 30 }   // level 5
        ];
        this.currentLevel = 0; // 0 = level 1
        this.spawnTimer = 0;   // telt af tot de volgende muis verschijnt

        // true = ingedrukt, false = losgelaten
        // WASD = bewegen, pijltjestoetsen = schieten
        this.keys = {
            w: false, a: false, s: false, d: false,
            arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
        };

        this.setupControls();
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = true;
                e.preventDefault(); // voorkomt scrollen met de pijltjes
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
        this.cat.update(this.keys);

        // Schietrichting uit de pijltjestoetsen (rechts min links, onder min boven)
        const dirX = (this.keys.arrowright ? 1 : 0) - (this.keys.arrowleft ? 1 : 0);
        const dirY = (this.keys.arrowdown ? 1 : 0) - (this.keys.arrowup ? 1 : 0);

        // shoot() geeft een YarnBall terug, of null als de kat niet kan schieten
        const yarn = this.cat.shoot(dirX, dirY);
        if (yarn) this.yarnBalls.push(yarn);

        for (const ball of this.yarnBalls) {
            ball.update();
        }
        this.yarnBalls = this.yarnBalls.filter(ball => !ball.isOffscreen());

        // Muizen laten spawnen: elke frame gaat de timer omlaag,
        // bij 0 komt er een nieuwe muis en begint de timer opnieuw.
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnMouse();
            this.spawnTimer = this.levels[this.currentLevel].spawnInterval;
        }

        // Elke muis loopt naar de kat toe
        for (const mouse of this.mice) {
            mouse.update(this.cat);
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
    }
}