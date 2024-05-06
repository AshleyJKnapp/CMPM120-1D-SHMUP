var points = 0;
class PlayGame extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        
        this.bulletCooldown = 4;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        
        
        // Movement speeds
        this.playerSpeed = 18;
        this.playerBulletSpeed = 28;

        // Locations of enemies on a sort of grid
        this.gridArr = [
            [80, 50],
            [80, 150],
            [80, 250],
            [80, 350],
            [(game.config.width/3)-7, 50],
            [(game.config.width/3)-7, 150],
            [(game.config.width/3)-7, 250],
            [(game.config.width/3)-7, 350],
            [(game.config.width/2)-15, 50],
            [(game.config.width/2)-15, 150],
            [(game.config.width/2)-15, 250],
            [(game.config.width/2)-15, 350],
            [(game.config.width-200), 50],
            [(game.config.width-200), 150],
            [(game.config.width-200), 250],
            [(game.config.width-200), 350],
            [(game.config.width-100), 50],
            [(game.config.width-100), 150],
            [(game.config.width-100), 250],
            [(game.config.width-100), 350]
        ]

        this.redEnemyGroup = [];
        this.blueEnemyGroup = [];
        this.waveNum = 0;
        this.maxWaves = 4;

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
        // Some assets are edited (googly eyes onto shapes, shape animation images squished)
        // Heart asset created by me
        // All edits and assets by me took less than 10 mins time total

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
        this.reset();
        let my = this.my;   // create an alias to this.my for readability

        // Instructions
        document.getElementById('description').innerHTML = '<h3>SHMUP.js</h3>Decorate scraps of paper quickly to earn points<br>Decorating pink scraps gives health or bonus points! <br>Get through all the waves of enemies for a final score.<br>Temporary: ESC to pause and ESC to restart <br><h4>Controls</h4>Left: A or &#8592; <br>Right: D or &#8594; <br>Shoot: Spacebar';

        // --------== Background Tiles ==---------
        // my.sprite.bgBrown = this.add.tileSprite(64, 64, 0, 0, "bgBrown");  
        my.sprite.blueBG = this.add.tileSprite(0, 0, 1800, 1800, "bgBlue");
        // my.sprite.greenBG = this.add.tileSprite(0, 0, 1800, 1800, "bgGreen");

        // --------== Text ==---------
        this.scoreTxt = this.add.text(game.config.width-430, game.config.height-80, points, {
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

        // --------== ENEMIES ==----------
        // --------== 1HP ==--------
        // Create death animation
        this.anims.create({
            key: "redDie",
            frames: [
                { key: "redDie0" },
                { key: "redDie1" },
                { key: "redDie2" },
            ],
            framerate: 1,
            hideOnComplete: true
        });

        // Create Wave Group 1
        my.sprite.redEnemyW1 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "redCir0",
            maxSize: 2,
            runChildUpdate: true
        })
        // Create Wave Group 2
        my.sprite.redEnemyW2 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "redCir0",
            maxSize: 4,
            runChildUpdate: true
        })
        // Create Wave Group 3
        my.sprite.redEnemyW3 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "redCir0",
            maxSize: 1,
            runChildUpdate: true
        })
        // Create Wave Group 4
        my.sprite.redEnemyW4 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "redCir0",
            maxSize: 4,
            runChildUpdate: true
        })


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
        
        // Create Wave Group 1
        my.sprite.blueEnemyW1 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 1,
            runChildUpdate: true
        })
        // Create Wave Group 2
        my.sprite.blueEnemyW2 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 1,
            runChildUpdate: true
        })
        // Create Wave Group 3
        my.sprite.blueEnemyW3 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 3,
            runChildUpdate: true
        })
        // Create Wave Group 4
        my.sprite.blueEnemyW4 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 4,
            runChildUpdate: true
        })

        // --------== Spawn in first wave ==----------
        this.waveGroups = [[my.sprite.redEnemyW1, my.sprite.blueEnemyW1], [my.sprite.redEnemyW2, my.sprite.blueEnemyW2], [my.sprite.redEnemyW3, my.sprite.blueEnemyW3], [my.sprite.redEnemyW4, my.sprite.blueEnemyW4]]
        this.redEnemyGroup = this.waveGroups[0][0];
        this.blueEnemyGroup = this.waveGroups[0][1];

        this.wave(this, my.sprite.redEnemyW1, my.sprite.blueEnemyW1);
        this.waveSize = my.sprite.redEnemyW1.maxSize + my.sprite.blueEnemyW1.maxSize;
        
        

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
            for (let enemy of this.blueEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    if (enemy.getHP() == 2){
                        enemy.onHit();
                    } else if (enemy.getHP() == 1){
                        enemy.onDeath();
                        points += enemy.getPoint();
                        this.numDeafeat++;
                        this.scoreTxt.setText(points);
                    }
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }

            // Check 1HP enemies
            for (let enemy of this.redEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    enemy.onDeath();
                    points += enemy.getPoint();
                    this.numDeafeat++;
                    this.scoreTxt.setText(points);
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }

            // if (pinkEnemy.active == true && this.collides(pinkEnemy, bullet)){
                
            // }
            
        }

        // Select current active wave
        if (this.waveSize == this.numDeafeat) {
            this.waveNum++;
            // If game is complete: stop
            // Else: proceed as normal
            if (this.waveNum == this.maxWaves){
                this.scene.start('pauseScreen'); //temp scene
            } else {
                this.numDeafeat = 0;
                this.redEnemyGroup = this.waveGroups[this.waveNum][0];
                this.blueEnemyGroup = this.waveGroups[this.waveNum][1];
                this.waveSize = this.redEnemyGroup.maxSize + this.blueEnemyGroup.maxSize;

                for (let enemy of this.redEnemyGroup.getChildren()){
                    enemy.active = true;
                }
                for (let enemy of this.blueEnemyGroup.getChildren()){
                    enemy.active = true;
                }
                // Call Next Wave
                this.wave(this, this.redEnemyGroup, this.blueEnemyGroup);
            }
        }
        
        my.sprite.player.update();
    }
// ----------------------------------------------------------------------------------------
// -------------------== WAVES ==-------------------
// This was originally going to be in create() but took up a lot of space
// I could make a function that takes params to make waves if I take more time to do so
// For now, theres going to be a bit of repeated code in each wave
wave(thisParam, redEnemyGroup, blueEnemyGroup){
    let thisOG = thisParam;
    let my = thisOG.my;
    
    // Possible Initial Location of all enemies
    let startArr = this.gridArr.slice(0);
    
    // --------== 1HP ==--------
    /// Manually add custom sprites to group
    // For a sort of randomized element to the paths picked
    // Random paths are picked from an array
    // Paths are simple, moving from the top of the screen down to a fixed point
    for (let i = 0; i < redEnemyGroup.maxSize;  i++){
        // Create sprites that are referenced by the enemy
        let dSprite = thisOG.add.sprite(-50, -50, "redDie0");
        // Pick paths of enemies
        let delIdx = Math.floor(Math.random()*startArr.length);
        let start = startArr[delIdx];
        startArr.splice(delIdx, 1)
        // Create enemy and add to group
        let enemSpr = new EnemyOneHP(thisOG, start[0], -50, "redCir0", 0, dSprite, "redDie", start[1])
        redEnemyGroup.add(enemSpr);
    }

    // --------== 2HP ==--------
    /// Manually add custom sprites to group
    // For a sort of randomized element to the paths picked
    // Random paths are picked from an array
    // Paths are simple, moving from the top of the screen down to a fixed point
    for (let i = 0; i < blueEnemyGroup.maxSize;  i++){
        // Create sprites that are referenced by the enemy
        let hSprite = this.add.sprite(-50, -50, "blueSq1");
        let dSprite = this.add.sprite(-50, -50, "blueDie0");
        // Select randomly which hurt sprite to use
        let decider = Math.floor(Math.random()*2);
        if (decider) {
            hSprite = this.add.sprite(-50, -50, "blueSq2");
        }
        // Pick paths of enemies
        let delIdx = Math.floor(Math.random()*startArr.length);
        let start = startArr[delIdx];
        startArr.splice(delIdx, 1)
        // Create enemy and add to group
        let enemSpr = new EnemyTwoHP(this, start[0], -50, "blueSq0", 0, hSprite, dSprite, "blueDie", start[1])
        blueEnemyGroup.add(enemSpr);
    }
}


// A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    
    reset(){
        // console.log("restart game");
        points = 0;

        this.redEnemyGroup = [];
        this.blueEnemyGroup = [];
        this.waveNum = 0;

        // Timer
        this.timer = 0;
        this.numDeafeat = 0;
    }

}