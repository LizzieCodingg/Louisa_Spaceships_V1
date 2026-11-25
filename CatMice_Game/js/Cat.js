// Cat is de speler. Het ERFT van Entity (extends).
class Cat extends Entity {

    constructor(x, y) {
        super(x, y, 50, 4, "🐱");

        this.lives = 5;        // aantal levens
        this.cooldown = 0;     // frames die we nog moeten wachten voor het volgende schot
        this.fireRate = 11;    // wachttijd tussen schoten (lager = sneller)
        this.invincible = 0;   // frames dat de kat nog onkwetsbaar is na een hit

        // Sprite-instellingen. De kat zit onderin zijn vakje, dus het ankerpunt ligt laag.
        this.scale = 4;
        this.anchorX = 16;
        this.anchorY = 26;

        // Beide animaties staan in dezelfde spritesheet, in verschillende rijen
    this.setAnimations({
            idle: { src: "img/Cat_Sprite_Sheet.png", row: 0, frames: 4, speed: 12 },
            walk: { src: "img/Cat_Sprite_Sheet.png", row: 9, frames: 8, speed: 5 }
        }, "idle");}

    update(keys) {
        if (keys.w) this.y -= this.speed; // omhoog
        if (keys.s) this.y += this.speed; // omlaag
        if (keys.a) this.x -= this.speed; // links
        if (keys.d) this.x += this.speed; // rechts

        // De kat mag niet van het scherm af
        const half = this.size / 2;
        this.x = Math.max(half, Math.min(800 - half, this.x));
        this.y = Math.max(half, Math.min(600 - half, this.y));

        // Timers tellen elke frame af richting 0
        if (this.cooldown > 0) this.cooldown--;
        if (this.invincible > 0) this.invincible--;

        // Kijkrichting: de kant op waar de kat naartoe loopt
        if (keys.a && !keys.d) this.facing = -1;
        if (keys.d && !keys.a) this.facing = 1;

        // Lopen of zitten, en daarna het volgende plaatje (beide uit Entity)
        const moving = keys.w || keys.a || keys.s || keys.d;
        this.setState(moving ? "walk" : "idle");
        this.updateAnimation();
    }

    // Schiet een kluwen wol. RETURNT een nieuw YarnBall-object, of null.
    shoot(dirX, dirY) {
        // Tijdens het schieten kijkt de kat naar de schietrichting
        if (dirX !== 0) this.facing = dirX > 0 ? 1 : -1;

        if (this.cooldown > 0) return null;
        if (dirX === 0 && dirY === 0) return null;

        this.cooldown = this.fireRate;
        return new YarnBall(this.x, this.y, dirX, dirY);
    }

    // De kat wordt geraakt door een muis. Alleen als hij niet onkwetsbaar is.
    takeHit() {
        if (this.invincible > 0) return;

        this.lives--;
        this.invincible = 120; // 120 frames = 2 seconden onkwetsbaar
    }

    // We OVERSCHRIJVEN draw() alleen voor het knipperen. Het echte tekenen
    // doet super.draw(ctx), de draw() van Entity.
    draw(ctx) {
        const blinkOff = this.invincible > 0 && Math.floor(this.invincible / 6) % 2 === 0;
        if (!blinkOff) {
            super.draw(ctx);
        }
    }
}