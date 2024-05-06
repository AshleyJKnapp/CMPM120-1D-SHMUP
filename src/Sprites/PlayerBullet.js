class PlayerBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    // constructor(scene, key, mSize, scale) {        
    //         super(scene, key, mSize, scale);
    //         this.visible = false;
    //         this.active = false;
    //         scene.add.existing(this);
    //         return this;
    //     }

    // create() {
    //     // Create BulletGroup
    //     bGroup = this.add.group({
    //         defaultKey: key,
    //         maxSize: mSize
    //         }
    //     )

    //     // Create bullets in BulletGroup
    //     bGroup.createMultiple({
    //         active: false,
    //         visible: false,
    //         key: my.sprite.pBulletGroup.defaultKey,
    //         repeat: my.sprite.pBulletGroup.maxSize-1,
    //         setScale: { x: scale, y: scale }
    //     });
    // }

    update() {
        if (this.active) {
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
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