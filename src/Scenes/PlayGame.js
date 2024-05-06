class PlayGame extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.bulletCooldown = 5;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        
        this.points = 0;

        // Movement speeds
        this.playerSpeed = 18;
        this.playerBulletSpeed = 25;

        // Timer
        this.timer = 0;

        this.numDeafeat = 0;
    }
// ----------------------------------------------------------------------------------------
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
        this.load.image("googB", "googly-b.png");
        this.load.image("googC", "googly-c.png");
        this.load.image("googD", "googly-d.png");
        this.load.image("googE", "googly-e.png");

        // 1HP Enemy
        this.load.image("redCir0", "red-circ-0.png");
        this.load.image("redDie0", "red-circ-i-0.png");
        this.load.image("redDie1", "red-circ-i-1.png");
        this.load.image("redDie2", "red-circ-i-2.png");

        // 2HP Enemy
        this.load.image("blueSq0", "blue-square-0.png");
        this.load.image("blueSq1", "blue-square-1.png");
        this.load.image("blueSq2", "blue-square-2.png");
        this.load.image("blueDie0", "blue-square-i-0.png");
        this.load.image("blueDie1", "blue-square-i-1.png");
        this.load.image("blueDie2", "blue-square-i-2.png");

        // BG
        // this.load.image("bgBrown", "brownbg1.png");
        this.load.image("bgBlue", "bluebg1.png");
        // this.load.image("bgGreen", "greenbg1.png");
    }
// ----------------------------------------------------------------------------------------
    create() {
        let my = this.my;   // create an alias to this.my for readability

        // --------== Background Tiles ==---------
        // my.sprite.bgBrown = this.add.tileSprite(64, 64, 0, 0, "bgBrown");  
        my.sprite.blueBG = this.add.tileSprite(0, 0, 1800, 1800, "bgBlue");
        // my.sprite.greenBG = this.add.tileSprite(0, 0, 1800, 1800, "bgGreen");

        // --------== Text ==---------
        this.scoreTxt = this.add.text(game.config.width-430, game.config.height-80, this.points, {
            fontFamily: "'Freeman'",
            fontSize: 50,
            align: "right",
            fixedWidth: 400,
            fixedHeight: 50
        });

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
    

        // --------== Objects ==-------
        // -- Initialize Player --
        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 150, "yellowHand", 0, this.aKey, this.leftKey, this.dKey, this.rightKey, this.playerSpeed);
        my.sprite.player.rotation = -1;
        // my.sprite.player.preFX.addShadow(my.sprite.player, 30, 30, 15, 5);
        // my.sprite.player.postFX.addShadow(my.sprite.player, 30, 30, 15, 5);


        // -- Player Bullets --
        // Create group for player bullet
        let pBulletArr = ["googA", "googB", "googC", "googD", "googE"];
        my.sprite.pBulletGroup = this.add.group({
            defaultKey: pBulletArr,
            maxSize: 10,
            runChildUpdate: true
            }
        )

        // Create all of the bullets at once, and set them to inactive
        // Taken from https://github.com/JimWhiteheadUCSC/BulletTime
        my.sprite.pBulletGroup.createMultiple({
            classType: PlayerBullet,
            active: false,
            visible: false,
            key: my.sprite.pBulletGroup.defaultKey,
            repeat: my.sprite.pBulletGroup.maxSize-1,
            setScale: { x: .1, y: .1 }
        });
        my.sprite.pBulletGroup.propertyValueSet("speed", this.playerBulletSpeed);

        // --------== Spawning in waves ==----------
        this.wave1(this);

        // -----= Menu =-----
        // (Esc)
        let escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey.on('down', (key, event) => {
            // console.log("esc key");
            this.scene.pause();
            this.scene.start('pauseScreen');
        })
    }
// ----------------------------------------------------------------------------------------
    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.timer++;
        this.bulletCooldownCounter--;

        // BG Scroll Brown
        // my.sprite.bgBrown.tilePositionY -= 8;
        // my.sprite.bgBrown.tilePositionX += .5; 
        // BG Scroll Blue
        my.sprite.blueBG.tilePositionY -= 8;
        my.sprite.blueBG.tilePositionX += .5; 
        // BG Scroll Green
        // my.sprite.greenBG.tilePositionY -= 8;
        // my.sprite.greenBG.tilePositionX += .5; 
        
        // Player Bullets
        // If we allow the player to press and hold
        if (this.spaceKey.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.pBulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    bullet.makeActive();
                    bullet.x = my.sprite.player.x-10;
                    bullet.y = my.sprite.player.y-57;
                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }




        // Check for bullet hitting active enemy
        for (let bullet of my.sprite.pBulletGroup.getChildren()) {
            // Check 2HP enemies
            for (let enemy of my.sprite.blueEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    if (enemy.getHP() == 2){
                        enemy.onHit();
                    } else if (enemy.getHP() == 1){
                        enemy.onDeath();
                        this.points += enemy.getPoint();
                        this.numDeafeat++;
                        this.scoreTxt.setText(this.points);
                    }
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }

            // Check 1HP enemies
            for (let enemy of my.sprite.redEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    enemy.onDeath();
                    this.points += enemy.getPoint();
                    this.numDeafeat++;
                    this.scoreTxt.setText(this.points);
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }
            
        }

        my.sprite.player.update();
    }
// ----------------------------------------------------------------------------------------
// -------------------== WAVES ==-------------------
wave1(thisParam){
    let thisOG = thisParam;
    let my = thisOG.my;

    // --------== 1HP ==--------
    // Create death animation
    thisOG.anims.create({
        key: "redDie",
        frames: [
            { key: "redDie0" },
            { key: "redDie1" },
            { key: "redDie2" },
        ],
        framerate: 1,
        hideOnComplete: true
    });
    
    // Initial Location of all 3 Reds
    let redStartArr = [[80, 50], [(game.config.width/2)-15, 350], [game.config.width-100, 150]]
    
    // Create Group
    my.sprite.redEnemyGroup = thisOG.add.group({
        // classType: EnemyTwoHP,
        defaultKey: "redCir0",
        maxSize: 4,
        runChildUpdate: true
    })

    /// Manually add custom sprites to group
    // For a sort of randomized element to the paths picked
    // Random paths are picked from an array
    // Paths are simple, moving from the top of the screen down to a fixed point
    for (let i = 0; i < 3;  i++){
        // Create sprites that are referenced by the enemy
        let dSprite = thisOG.add.sprite(-50, -50, "redDie0");
        // Create enemy and add to group
        let enemSpr = new EnemyOneHP(thisOG, redStartArr[i][0], -50, "redCir0", 0, dSprite, "redDie", redStartArr[i][1])
        my.sprite.redEnemyGroup.add(enemSpr);
    }

    // --------== 2HP ==--------
    // Create death animation
    this.anims.create({
        key: "blueDie",
        frames: [
            { key: "blueDie0" },
            { key: "blueDie1" },
            { key: "blueDie2" },
        ],
        framerate: 1,
        hideOnComplete: true
    });
    
    // Initial Location of all 3 Blues
    let blueStartArr = [[game.config.width/2, 250], [game.config.width/3, 50], [game.config.width-100, 350]]
    
    // Create Group
    my.sprite.blueEnemyGroup = this.add.group({
        // classType: EnemyTwoHP,
        defaultKey: "blueSq0",
        maxSize: 3,
        runChildUpdate: true
    })

    /// Manually add custom sprites to group
    // For a sort of randomized element to the paths picked
    // Random paths are picked from an array
    // Paths are simple, moving from the top of the screen down to a fixed point
    for (let i = 0; i < 3;  i++){
        // Create sprites that are referenced by the enemy
        let hSprite = this.add.sprite(-50, -50, "blueSq1");
        let dSprite = this.add.sprite(-50, -50, "blueDie0");
        // Select randomly which hurt sprite to use
        let decider = Math.floor(Math.random()*2);
        if (decider) {
            hSprite = this.add.sprite(-50, -50, "blueSq2");
        }
        // Create enemy and add to group
        let enemSpr = new EnemyTwoHP(this, blueStartArr[i][0], 60, "blueSq0", 0, hSprite, dSprite, "blueDie", blueStartArr[i][1])
        my.sprite.blueEnemyGroup.add(enemSpr);
    }
}

// A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    
    reset(){
        console.log("restart game");
    }

}