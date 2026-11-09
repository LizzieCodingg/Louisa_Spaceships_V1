// YarnBall is het "kogeltje" dat de kat schiet. Het ERFT van Entity,
// dus het heeft al x, y, size, speed, emoji en draw().
class YarnBall extends Entity {

    // dirX en dirY zijn de richting: -1, 0 of 1 (bijv. dirX=1, dirY=-1 = schuin rechtsboven)
    constructor(x, y, dirX, dirY) {
        super(x, y, 24, 8, "🧶");

        // Bij schuin schieten is de richting (1,1) langer dan (1,0).
        // Daarom delen we door de lengte, zodat alle ballen even snel gaan.
        const length = Math.hypot(dirX, dirY);
        this.dirX = dirX / length;
        this.dirY = dirY / length;
    }

    // Override van update(): het bolletje vliegt in een rechte lijn
    update() {
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
    }

    // Is het bolletje buiten het canvas? Dan kan Game het weggooien.
    isOffscreen() {
        return this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600;
    }
}