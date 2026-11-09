// Mouse is de vijand. Het ERFT van Entity, net als Cat en YarnBall.
class Mouse extends Entity {

    // speed krijgen we van buiten mee, zodat elk level andere muizen kan maken
    constructor(x, y, speed) {
        super(x, y, 30, speed, "🐭");
        this.hp = 1; // aantal treffers dat de muis aankan
    }

    // Override van update(): de muis loopt naar de kat toe.
    // "target" is de kat. We geven hem mee als parameter, net zoals
    // hit($dmg) in je Spaceship-opdracht data van buiten kreeg.
    update(target) {
        // Afstand tot de kat in x- en y-richting
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        // Werkelijke afstand (stelling van Pythagoras)
        const distance = Math.hypot(dx, dy);

        // Delen door de afstand geeft een richting met lengte 1.
        // Zo loopt de muis recht op de kat af met precies zijn eigen speed.
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
}