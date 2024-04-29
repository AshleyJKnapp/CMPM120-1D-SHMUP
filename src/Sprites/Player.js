class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // altLeftKey - key for moving left
    // rightKey - key for moving right
    // altRightKey - key for moving right
    constructor(scene, x, y, texture, frame, leftKey, altLeftKey, rightKey, altRightKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.altLeft = altLeftKey;
        this.right = rightKey;
        this.altRight = altRightKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown || this.altLeft) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown || this.altRight) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.playerSpeed;
            }
        }
    }

}