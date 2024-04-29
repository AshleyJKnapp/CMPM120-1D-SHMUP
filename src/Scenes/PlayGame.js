class PlayGame extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.bulletCooldown = 5;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets
        // https://kenney.nl/assets/googly-eyes
        // https://kenney.nl/assets/shape-characters
        // https://kenney.nl/assets/rolling-ball-assets

        this.load.setPath("./assets/");
        
        // Player Sprite
        this.load.image("yellowHand", "hand_yellow_point.png");

        // Bullet (might load more later)
        this.load.image("googA", "googly-a.png");

    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        // Movement speeds
        this.playerSpeed = 18;
        this.playerBulletSpeed = 25;

        // ------== Key Objects ==------
        // -- Movement --
        // (A) Move Left
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        
        // (D) Move Right
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // -- Bullets --
        // (Space)
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // ------== Objects ==-----
        // -- Initialize Player --
        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 150, "yellowHand", 0, this.aKey, this.leftKey, this.dKey, this.rightKey, this.playerSpeed);
        my.sprite.player.rotation = -1;

        // -- Player Bullets --
        // Create group for player bullet
        my.sprite.pBulletGroup = this.add.group({
            defaultKey: "googA",
            maxSize: 10
            }
        )

        // Taken from https://github.com/JimWhiteheadUCSC/BulletTime
        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.pBulletGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.pBulletGroup.defaultKey,
            repeat: my.sprite.pBulletGroup.maxSize-1,
            // setXY: { x: -15, y: -15 },
            setScale: { x: .1, y: .1 }
        });

        // -- Player Bullets --
        // (Space) fire/shoot single event
        // Don't want the player to press and hold, so this is not in update()
        this.spaceKey.on('down', (key, event) => {
            // Get the first inactive bullet and make it active
            let bullet = my.sprite.pBulletGroup.getFirstDead();
            // Bullet will be null if there are no inactive bullets
            if (bullet != null){
                bullet.active = true;
                bullet.visible = true;
                bullet.x = my.sprite.player.x-10;
                bullet.y = my.sprite.player.y-30;
                this.bulletCooldownCounter = this.bulletCooldown;
            }
        })
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.bulletCooldownCounter--;

        // Check for bullet offscreen
        for (let bullet of my.sprite.pBulletGroup.getChildren()){
            if (bullet.y < -(bullet.displayHeight-2)){
                bullet.active = false;
                bullet.visible = false;
            }
        }

        // Move bullets
        my.sprite.pBulletGroup.incY(-this.playerBulletSpeed);
        

        my.sprite.player.update();
    }

}