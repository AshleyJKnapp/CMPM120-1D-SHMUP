class EnemyTwoHP extends Phaser.GameObjects.Sprite {
    // x,y - starting sprite location
    // spriteKey / texture - key for the sprite image asset
    // spriteHit1 - key for next sprite to display on hit
    // animSprite - sprite for the death anim
    // animKey - key for the death anim
    constructor(scene, x, y, texture, frame, spriteHit1, animSprite, animKey, destY) {
    // constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.HP = 2;
        this.pts = 1000;
        this.hit1 = spriteHit1;
        this.animS = animSprite;
        this.animK = animKey;
        this.spriteKey = texture;
        this.endY = destY;
        
        this.hit1.x = this.x;
        this.hit1.y = this.y;

        scene.add.existing(this);

        return this;
    }

    update() {
        if (this.active == true){
            // Decrease the amount of points while active and not killed
            // Goes no lower than 250
            if (this.pts > 500){
                this.pts -= 10;
            }

            // While Active, move sprite down until at destination
            if (this.y < this.endY){
                this.y += 10;
            }

            // keep the 1hit sprite moving with the main one when visible
            if (this.hit1.visible = true){
                this.hit1.x = this.x;
                this.hit1.y = this.y;
            }
        }
    }

    getHP(){
        return this.HP;
6    }

    decHP(){
        this.HP--;
        // console.log("HP is: " + this.HP);
    }

    onHit(){
        this.hit1.visible = true;
        this.visible = false;
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