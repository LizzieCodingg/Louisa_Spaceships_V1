// Room is een kamer: het uiterlijk van een level.
// Elk level krijgt een eigen Room-object met andere kleuren en decoratie.
// Game roept alleen room.draw(ctx) aan en hoeft niet te weten HOE de
// kamer getekend wordt. Dat is encapsulation.
class Room {

    // settings is een object met de gegevens van de kamer (zie Game.js)
    constructor(settings) {
        this.name = settings.name;
        this.pattern = settings.pattern;               // "checker", "planks" of "bricks"
        this.colorA = settings.colorA;                 // eerste vloerkleur
        this.colorB = settings.colorB;                 // tweede vloerkleur
        this.lineColor = settings.lineColor || null;   // kleur van naden en voegen
        this.holeColor = settings.holeColor;           // kleur van de muizengaten
        this.rugColor = settings.rugColor || null;     // optioneel tapijt in het midden
        this.decorations = settings.decorations || []; // lijst met emoji-decoratie
    }

    // Tekent de hele kamer: vloer, tapijt, muizengaten, decoratie (in die volgorde)
    draw(ctx) {
        this.drawFloor(ctx);
        if (this.rugColor) this.drawRug(ctx);
        this.drawHoles(ctx);
        this.drawDecorations(ctx);
    }

    // Kiest het vloerpatroon van deze kamer
    drawFloor(ctx) {
        if (this.pattern === "checker") {
            // Dambordtegels van 50x50
            const tile = 50;
            for (let row = 0; row < 12; row++) {
                for (let col = 0; col < 16; col++) {
                    ctx.fillStyle = (row + col) % 2 === 0 ? this.colorA : this.colorB;
                    ctx.fillRect(col * tile, row * tile, tile, tile);
                }
            }
        }

        if (this.pattern === "planks") {
            // Houten planken: horizontale rijen met verspringende naden
            const h = 40;
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = 2;
            for (let row = 0; row < 15; row++) {
                const y = row * h;
                ctx.fillStyle = row % 2 === 0 ? this.colorA : this.colorB;
                ctx.fillRect(0, y, 800, h);

                // Lijn onder de plank
                ctx.beginPath();
                ctx.moveTo(0, y + h);
                ctx.lineTo(800, y + h);
                ctx.stroke();

                // Korte naden, om en om verschoven
                for (let x = (row % 2) * 120; x < 800; x += 240) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + h);
                    ctx.stroke();
                }
            }
        }

        if (this.pattern === "bricks") {
            // Stenen muur-look: bakstenen van 80x40, elke rij verschoven
            const w = 80;
            const h = 40;
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = 2;
            for (let row = 0; row < 15; row++) {
                for (let col = -1; col < 11; col++) {
                    const x = col * w + (row % 2) * (w / 2);
                    const y = row * h;
                    // Sommige stenen krijgen de tweede kleur (vaste volgorde, geen random)
                    ctx.fillStyle = (row * 7 + col * 3) % 4 === 0 ? this.colorB : this.colorA;
                    ctx.fillRect(x, y, w, h);
                    ctx.strokeRect(x, y, w, h);
                }
            }
        }
    }

    // Een zacht tapijt in het midden (ligt onder alles wat beweegt)
    drawRug(ctx) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = this.rugColor;
        ctx.beginPath();
        ctx.ellipse(400, 300, 190, 120, 0, 0, Math.PI * 2);
        ctx.fill();

        // Randje binnenin
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(400, 300, 165, 98, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    // De 4 muizengaten op dezelfde plekken als de spawnPoints in Game
    drawHoles(ctx) {
        const holes = [
            { x: 400, y: 0,   rx: 38, ry: 24 },  // boven
            { x: 400, y: 600, rx: 38, ry: 24 },  // onder
            { x: 0,   y: 300, rx: 24, ry: 38 },  // links
            { x: 800, y: 300, rx: 24, ry: 38 }   // rechts
        ];

        for (const hole of holes) {
            // Lichte rand
            ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.beginPath();
            ctx.ellipse(hole.x, hole.y, hole.rx + 6, hole.ry + 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Het gat zelf
            ctx.fillStyle = this.holeColor;
            ctx.beginPath();
            ctx.ellipse(hole.x, hole.y, hole.rx, hole.ry, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Emoji-decoratie in de hoeken. Halfdoorzichtig, zodat ze niet afleiden.
    drawDecorations(ctx) {
        ctx.globalAlpha = 0.55;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const item of this.decorations) {
            ctx.font = item.size + "px Fredoka";
            ctx.fillText(item.emoji, item.x, item.y);
        }
        ctx.globalAlpha = 1;
    }
}