// Entity is de "basisclass" (blauwdruk) voor alles wat in het spel
// op het scherm staat: de kat, de muizen, de hairballs en de power-ups.
// Alle andere classes gaan hier van erven (extends)
// Zodat ik dezelfde code niet steeds opnieuw moet schrijven.

class Entity {

    constructor(x,y,size,speed,emoji) {
        this.x = x; //horizontale positie
        this.y = y; //verticale positie
        this.size = size; //grootte in pixels
        this.speed = speed; //snelheid in pixels per update
        this.emoji = emoji; // hoe object eruit ziet (voor nu een emoji)
    }


update() {

}

draw(ctx) {
    ctx.font = this.size + "px Fredoka";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x, this.y);
    }
}