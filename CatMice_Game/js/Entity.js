// Entity is de "basisclass" (blauwdruk) voor alles wat in het spel
// op het scherm staat: de kat, de muizen, de kluwens en later de power-ups.
// Alle andere classes ERVEN hiervan (extends). Entity regelt ook het
// animeren van sprites, zodat Cat en Mouse dat niet allebei hoeven te schrijven.
class Entity {

    constructor(x, y, size, speed, emoji) {
        this.x = x;          // horizontale positie op het canvas
        this.y = y;          // verticale positie op het canvas
        this.size = size;    // grootte in pixels (ook voor botsingen)
        this.speed = speed;  // snelheid in pixels per frame
        this.emoji = emoji;  // reserve-uiterlijk als er (nog) geen sprite is

        // --- Animatie-gegevens ---
        this.animations = {};   // alle animaties van dit object (door child classes gevuld)
        this.state = null;      // welke animatie speelt nu, bijv. "walk"
        this.frame = 0;         // welk plaatje van die animatie
        this.frameTimer = 0;    // telt game-frames tot het volgende plaatje
        this.animationDone = false; // true als een animatie zonder loop klaar is
        this.facing = 1;        // 1 = kijkt naar rechts, -1 = naar links (spiegelen)
        this.scale = 1;         // vergroting van de sprite (heel getal = scherpe pixels)
        this.anchorX = 16;      // punt in het 32x32 vakje dat op (x, y) komt te liggen
        this.anchorY = 16;
    }

    // Haalt een plaatje op. Elk bestand wordt maar 1x geladen en daarna gedeeld
    // door alle objecten (bijv. alle muizen gebruiken hetzelfde plaatje).
    static getImage(path) {
        if (!Entity.imageCache[path]) {
            const img = new Image();
            img.onerror = () => console.error("Plaatje niet gevonden:", path);
            img.src = path;
            Entity.imageCache[path] = img;
        }
        return Entity.imageCache[path];
    }

    // Registreert de animaties van dit object en begint met startState.
    // Een animatie ziet er zo uit:
    //   { src: "img/x.png", frames: 6, speed: 5, vertical: true, loop: false }
    //   - frames: aantal plaatjes     - speed: game-frames per plaatje (hoger = trager)
    //   - vertical: plaatjes staan onder elkaar (anders naast elkaar, met row)
    //   - loop: false = speelt 1x en blijft op het laatste plaatje staan
    setAnimations(animations, startState) {
        this.animations = animations;
        for (const name in animations) {
            Entity.getImage(animations[name].src); // alvast laden
        }
        this.setState(startState, true);
    }

    // Wisselt van animatie. Gebeurt er niets als hij al speelt (tenzij restart = true).
    setState(state, restart = false) {
        if (this.state === state && !restart) return;
        this.state = state;
        this.frame = 0;
        this.frameTimer = 0;
        this.animationDone = false;
    }

    // Gaat naar het volgende plaatje als het tijd is. Roep dit elke frame aan.
    updateAnimation() {
        const anim = this.animations[this.state];
        if (!anim || this.animationDone) return;

        this.frameTimer++;
        if (this.frameTimer < anim.speed) return;
        this.frameTimer = 0;

        if (this.frame + 1 >= anim.frames) {
            if (anim.loop === false) {
                this.animationDone = true; // blijf op het laatste plaatje staan
            } else {
                this.frame = 0;            // begin opnieuw
            }
        } else {
            this.frame++;
        }
    }

    // Lege update(): child classes OVERSCHRIJVEN (override) deze zelf.
    update() {
    }

    // Tekent het huidige plaatje. Lukt dat niet (geen animatie of het plaatje is
    // nog niet geladen), dan tekenen we gewoon de emoji.
    draw(ctx) {
        if (this.drawSprite(ctx)) return;

        ctx.font = this.size + "px Fredoka";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    // Snijdt het juiste plaatje uit de sprite en tekent het. Geeft true terug als het gelukt is.
    drawSprite(ctx) {
        const anim = this.animations[this.state];
        if (!anim) return false;

        const img = Entity.getImage(anim.src);
        if (!img.complete || img.naturalWidth === 0) return false;

        const cell = 32; // elk plaatje is 32x32 pixels
        // Staan de plaatjes onder elkaar, dan schuiven we omlaag, anders opzij
        const sx = anim.vertical ? 0 : this.frame * cell;
        const sy = anim.vertical ? this.frame * cell : (anim.row || 0) * cell;

        ctx.imageSmoothingEnabled = false; // geen vervaging bij vergroten
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1); // -1 spiegelt het plaatje (kijkt naar links)
        ctx.drawImage(
            img,
            sx, sy, cell, cell,                                  // stuk uit de sprite
            -this.anchorX * this.scale, -this.anchorY * this.scale,
            cell * this.scale, cell * this.scale                 // getekende grootte
        );
        ctx.restore();
        return true;
    }

    // Raakt dit object een ander object? We behandelen elk object als een cirkel.
    collidesWith(other) {
        const distance = Math.hypot(this.x - other.x, this.y - other.y);
        const radii = (this.size + other.size) * 0.35;
        return distance < radii;
    }
}

// De gedeelde plaatjes-opslag (hoort bij de class, niet bij 1 object)
Entity.imageCache = {};