class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")

        this.cat = new Cat(400,300);

        this.keys = { w: false, a:false, s:false, d:false};

        this.setupControls();
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            const key = e.key.toLocaleLowerCase();
            if (key in this.keys) this.keys[key]= false;
        })
    }

    start() {
        this.loop();
    }

    loop() {
        this.update();
        this.draw();

        requestAnimationFrame(()=> this.loop());
    }

    update() {
        this.cat.update(this.keys);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cat.draw(this.ctx);
    }
}