class PlayGame extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.bulletCooldown = 5;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        // Event handling
        // Polling
        this.leftKey = null;
        this.rightKey = null;
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

        // update instruction text
        // document.getElementById('description').innerHTML = '<h2>Smiley.js</h2>'
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        // Movement speeds
        this.playerSpeed = 18;
        this.playerBulletSpeed = 25;

        // Create the player sprite
        // my.sprite.player = this.add.sprite(this.playerX, this.playerY, "yellowHand");
        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 150, "yellowHand");
        my.sprite.player.rotation = -1;

        // Create group for player bullet
        my.sprite.bulletGroup = this.add.group({
            defaultKey: "googA",
            maxSize: 10
            }
        )

        // Taken from https://github.com/JimWhiteheadUCSC/BulletTime
        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        // -------- Input handling --------
        // -- Movement --
        // (A) Move Left Polling
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        
        // (D) Move Right Polling
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // -- Player Bullets --
        // (Space) fire/shoot single event
        let fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        fKey.on('down', (key, event) => {
            console.log("SPACE key (event)");
            bNum++; // Add how many bullets exist
            my.sprite.bullet[bNum] = this.add.sprite(my.sprite.player.x-10, my.sprite.player.y-40, "googA");
            my.sprite.bullet[bNum].setScale(.1);
            // console.log(my.sprite.bullet);
        })
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        // For every bullet on the screen, move up
        // console.log("# of Bullets: " + bNum);
        if (bNum >= 0){
            for (let i = 0; i <= bNum; i++){
                if (my.sprite.bullet[i].y < -25) {
                    my.sprite.bullet[i].destroy(true);
                    // bNum--; // Decrease how many bullets exist
                } else {;
                    my.sprite.bullet[i].y -= 15;
                }

                // Known issue: destroyed sprites technically still exist in the bullet array. However, they are not being moved all the time
            }
        }
        

        if (this.leftKey.isDown){
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)+25) {
                // console.log("MoveLeft: Complete");
                my.sprite.player.x -= playerMoveSpeed;
            }

            // If player is multiple parts:
            // for (let part in my.sprite){
            //     my.sprite[part].x -= 5;
            // }
        }
       
        if (this.rightKey.isDown){
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))-25) {
                // console.log("MoveRight: Complete");
                my.sprite.player.x += playerMoveSpeed;
            }

            // If player is multiple parts:
            // for (let part in my.sprite){
            //     my.sprite[part].x += 5;
            // }
        }
    }

}