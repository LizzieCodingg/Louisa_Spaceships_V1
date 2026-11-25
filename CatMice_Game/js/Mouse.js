// Mouse is de vijand. Het ERFT van Entity, net als Cat en YarnBall.
class Mouse extends Entity {

    // speed krijgen we van buiten mee, zodat elk level andere muizen kan maken
    constructor(x, y, speed) {
        super(x, y, 36, speed, "🐭");
        this.hp = 1;             // aantal treffers dat de muis aankan
        this.dying = false;      // true tijdens de sterf-animatie
        this.removable = false;  // true = Game mag deze muis weggooien

        // De muis is klein in zijn vakje, dus een kleinere schaal dan de kat.
        // Elke animatie heeft zijn eigen bestand (plaatjes onder elkaar).
        this.scale = 3;
        this.anchorX = 16;
        this.anchorY = 15;
        this.setAnimations({
            run:    { src: "img/MouseRun.png",    frames: 6, speed: 5, vertical: true },
            damage: { src: "img/MouseDamage.png", frames: 4, speed: 5, vertical: true, loop: false },
            die:    { src: "img/MouseDie.png",    frames: 6, speed: 6, vertical: true, loop: false }
        }, "run");
    }

    // De muis wordt geraakt door een kluwen. RETURNT true als hij hierdoor doodgaat,
    // zodat Game weet dat er punten bij moeten (net als de return van shoot()).
    hit() {
        this.hp--;
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        this.setState("damage", true); // speelt de pijn-animatie opnieuw af
        return false;
    }

    // Start de sterf-animatie. Daarna mag Game de muis weggooien.
    die() {
        this.hp = 0;
        this.dying = true;
        this.setState("die");
    }

    // Override van update(): de muis loopt naar de kat toe.
    // "target" is de kat. We geven hem mee als parameter.
    update(target) {
        // Een stervende muis blijft staan en speelt alleen zijn animatie af
        if (this.dying) {
            this.updateAnimation();
            if (this.animationDone) this.removable = true;
            return;
        }

        // Tijdens de pijn-animatie staat de muis even stil (kort uit balans)
        if (this.state === "damage") {
            this.updateAnimation();
            if (this.animationDone) this.setState("run");
            return;
        }

        // Afstand tot de kat in x- en y-richting
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy); // stelling van Pythagoras

        // Delen door de afstand geeft een richting met lengte 1:
        // de muis loopt recht op de kat af met precies zijn eigen speed.
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        // Kijk naar de kat (de marge voorkomt heen-en-weer flippen)
        if (Math.abs(dx) > 1) this.facing = dx > 0 ? 1 : -1;

        this.updateAnimation();
    }
}