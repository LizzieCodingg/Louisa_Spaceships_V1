// Cat is de speler. Het ERFT van Entity (extends).
class Cat extends Entity {

    constructor(x, y) {
        super(x, y, 50, 4, "🐱");

        this.lives = 5;        // aantal levens
        this.cooldown = 0;     // frames die we nog moeten wachten voor het volgende schot
        this.fireRate = 11;    // wachttijd tussen schoten (lager = sneller)
        this.invincible = 0;   // frames dat de kat nog onkwetsbaar is na een hit
    }

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
    }

    // Schiet een kluwen wol. RETURNT een nieuw YarnBall-object, of null.
    shoot(dirX, dirY) {
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

    // We OVERSCHRIJVEN draw() zodat de kat knippert als hij onkwetsbaar is.
    // super.draw(ctx) roept de draw() van Entity aan: we hergebruiken die dus
    // en voegen alleen het knipperen toe.
    draw(ctx) {
        const blinkOff = this.invincible > 0 && Math.floor(this.invincible / 6) % 2 === 0;
        if (!blinkOff) {
            super.draw(ctx);
        }
    }
}