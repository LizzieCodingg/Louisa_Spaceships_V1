class YarnBall extends Entity {

    constructor(x,y, dirX, dirY) {
        super(x, y, 24, 8, "🧶");
    

    const length = Math.hypot(dirX,dirY);
    this.dirX = dirX / length;
    this.dirY = dirY / length;
}

    update() {
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
    }

    isOffscreen() {
        return this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600;
    }
}