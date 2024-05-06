class EnemyOneHP extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey / texture - key for the sprite image asset
    // animSprite - sprite for the death anim
    // animKey - key for the death anim
    constructor(scene, x, y, texture, frame, animSprite, animKey) {
    // constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.HP = 1;
        this.pts = 500;
        this.animS = animSprite;
        this.animK = animKey;
        this.spriteKey = texture;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Decrease the amount of points while active and not killed
        // Goes no lower than 250
        if (this.active == true && this.pts > 250){
            this.pts--;
        }
    }

    getHP(){
        return this.HP;
6    }

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
        this.hit1.visible = false;
        this.animS.play(this.animK);
        this.active = false;
    }
}