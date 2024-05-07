class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {

        if (this.active) {
            this.y += this.speed;
            if (this.y > game.config.height+15) {
                // console.log(this.displayHeight);
                this.makeInactive();
                // console.log("inactive bullet at "+this.y);
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}