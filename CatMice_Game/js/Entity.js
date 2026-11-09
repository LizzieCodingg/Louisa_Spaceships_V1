// Entity is de "basisclass" (blauwdruk) voor alles wat in het spel
// op het scherm staat: de kat, de muizen, de kluwens en later de power-ups.
// Alle andere classes ERVEN hiervan (extends), zodat we dezelfde code
// niet steeds opnieuw hoeven te schrijven.
class Entity {

    // De constructor wordt automatisch uitgevoerd bij "new Entity(...)".
    constructor(x, y, size, speed, emoji) {
        this.x = x;          // horizontale positie op het canvas
        this.y = y;          // verticale positie op het canvas
        this.size = size;    // grootte in pixels
        this.speed = speed;  // snelheid in pixels per frame
        this.emoji = emoji;  // hoe het object eruitziet (voor nu een emoji)
    }

    // Lege update(): child classes OVERSCHRIJVEN (override) deze zelf.
    update() {
    }

    // Tekent het object op het canvas. "ctx" is de tekenpen van het canvas.
    draw(ctx) {
        ctx.font = this.size + "px Fredoka";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    // Raakt dit object een ander object? We behandelen elk object als een cirkel:
    // als de afstand tussen de middelpunten kleiner is dan de twee stralen bij
    // elkaar, dan overlappen ze. De 0.35 is een "hitbox": een emoji heeft lege
    // ruimte rondom, dus een iets kleinere cirkel voelt eerlijker.
    // Omdat dit in Entity staat, kunnen Cat, Mouse en YarnBall dit allemaal.
    collidesWith(other) {
        const distance = Math.hypot(this.x - other.x, this.y - other.y);
        const radii = (this.size + other.size) * 0.35;
        return distance < radii;
    }
}