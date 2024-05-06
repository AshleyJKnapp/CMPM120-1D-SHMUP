class EnemyOneHP extends Phaser.GameObjects.Sprite {
    // x,y - starting sprite location
    // spriteKey / texture - key for the sprite image asset
    // animSprite - sprite for the death anim
    // animKey - key for the death anim
    constructor(scene, x, y, texture, frame, animSprite, animKey, destY) {
    // constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.HP = 1;
        this.pts = 500;
        this.animS = animSprite;
        this.animK = animKey;
        this.spriteKey = texture;
        this.endY = destY;

        this.timer = 0;

        scene.add.existing(this);

        return this;
    }

    update() {
        if (this.active == true){
            // Decrease the amount of points while active and not killed
            // Goes no lower than 250
            this.timer++; //to make it decrease slower
            if (this.timer%25 == 0 && this.pts > 250){
                this.pts -= 10;
            }

            // While Active, move sprite down until at destination
            if (this.y < this.endY){
                this.y += 13;
            }
        }
    }

    getHP(){
        return this.HP;
    }

    decHP(){
        this.HP--;
        // console.log("HP is: " + this.HP);
    }

    getPoint(){
        return this.pts;
    }

    animationSprite(){
        return this.animS;
    }

    animationKey(){
        return this.animK;
    }

    onDeath(){
        this.animS.x = this.x;
        this.animS.y = this.y;
        this.visible = false;
        this.animS.play(this.animK);
        this.active = false;
    }
}