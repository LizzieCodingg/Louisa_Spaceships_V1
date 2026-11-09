class Cat extends Entity {

    constructor(x,y) {
        super(x,y,50,4,"🐱");

        this.lives=5;
    }
    update(keys){
        if (keys.w) this.y -= this.speed; //omhoog
        if (keys.s) this.y += this.speed; //omlaag
        if (keys.a) this.x -= this.speed; //links
        if (keys.d) this.x += this.speed; //rechts

        const half = this.size / 2;
        this.x = Math.max(half, Math.min(800 - half, this.x));
        this.y = Math.max(half, Math.min(600 - half, this.y));
    }
}