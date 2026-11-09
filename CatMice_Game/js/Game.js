// Game is de "baas" van het spel: maakt objecten aan, luistert naar het
// toetsenbord en draait de game loop.
class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.cat = new Cat(400, 300);
        this.yarnBalls = []; // lijst met alle kluwens die nu in de lucht zijn

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
                e.preventDefault(); // voorkomt dat de pagina scrolt met de pijltjes
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

    update() {
        this.cat.update(this.keys);

        // Bepaal de schietrichting uit de pijltjestoetsen.
        // Rechts min links geeft -1, 0 of 1 (zo kan het ook schuin).
        const dirX = (this.keys.arrowright ? 1 : 0) - (this.keys.arrowleft ? 1 : 0);
        const dirY = (this.keys.arrowdown ? 1 : 0) - (this.keys.arrowup ? 1 : 0);

        // De kat geeft een YarnBall terug (of null als hij niet kan schieten)
        const yarn = this.cat.shoot(dirX, dirY);
        if (yarn) this.yarnBalls.push(yarn);

        // Update elke kluwen
        for (const ball of this.yarnBalls) {
            ball.update();
        }

        // Gooi kluwens weg die buiten het scherm zijn (anders groeit de lijst eindeloos)
        this.yarnBalls = this.yarnBalls.filter(ball => !ball.isOffscreen());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const ball of this.yarnBalls) {
            ball.draw(this.ctx);
        }
        this.cat.draw(this.ctx);
    }
}