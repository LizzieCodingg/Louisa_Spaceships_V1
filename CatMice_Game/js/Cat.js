// Cat is de speler. Het ERFT van Entity (extends).
class Cat extends Entity {

    constructor(x, y) {
        super(x, y, 50, 4, "🐱");

        this.lives = 5;     // aantal levens
        this.cooldown = 0;  // frames die we nog moeten wachten voor het volgende schot
        this.fireRate = 20; // wachttijd tussen schoten (15 frames = ongeveer 4 per seconde)
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

        // Elke frame telt de wachttijd af richting 0
        if (this.cooldown > 0) this.cooldown--;
    }

    // Schiet een kluwen wol in de richting (dirX, dirY).
    // Net als shoot() in je Spaceship: de methode RETURNT data,
    // hier een nieuw YarnBall-object. Is er geen schot, dan returnt hij null.
    shoot(dirX, dirY) {
        if (this.cooldown > 0) return null;           // nog aan het wachten
        if (dirX === 0 && dirY === 0) return null;    // geen richting gekozen

        this.cooldown = this.fireRate;
        return new YarnBall(this.x, this.y, dirX, dirY);
    }
}