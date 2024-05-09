var points = 0;
var highScore = 0;
class PlayGame extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        
        this.bulletCooldown = 6;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.enemyBulletCooldown = 4;        // Number of update() calls to wait before making a new bullet
        this.enemyBulletCooldownCounter = 0;
        
        this.pHealthMax = 3;
        this.playerHealth = this.pHealthMax;

        // Movement speeds
        this.playerSpeed = 18;
        this.playerBulletSpeed = 28;
        this.enemyBulletSpeed = 28;

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
        // Audio
        // https://kenney.nl/assets/music-jingles
        // https://kenney.nl/assets/impact-sounds
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

        // HP+ Enemy
        this.load.image("pinkDia0", "pink-dia-0.png"); 
        this.load.image("pinkDie0", "pink-dia-i-0.png"); 
        this.load.image("pinkDie1", "pink-dia-i-1.png"); 
        this.load.image("pinkDie2", "pink-dia-i-2.png"); 

        // Player HP
        this.load.image("fullHP", "heart0.png");
        this.load.image("hurtHP", "heart1.png");

        // BG
        // this.load.image("bgBrown", "brownbg1.png");
        this.load.image("bgBlue", "bluebg1.png");
        // this.load.image("bgGreen", "greenbg1.png");

        // SFX
        this.load.audio("hitSFX", "impactTin.ogg");
        this.load.audio("winSFX", "jingles_HAPPY.ogg");
        this.load.audio("loseSFX", "jingles_SAD.ogg");
        this.load.audio("shootSFX", "shootWood.ogg");
        this.load.audio("pHitSFX", "impactPlate.ogg");
        this.load.audio("eShootSFX", "impactSoft.ogg");
    }
// ----------------------------------------------------------------------------------------
    create() {
        this.reset();
        let my = this.my;   // create an alias to this.my for readability

        // Instructions
        document.getElementById('description').innerHTML = '<h3>SHMUP.js</h3>Decorate scraps of paper quickly to earn points<br>Decorating pink scraps gives health or bonus points! <br>Get through all the waves of enemies for a final score. <br><h4>Controls</h4>Left: A or &#8592; <br>Right: D or &#8594; <br>Shoot: Spacebar';

        // --------== Background Tiles ==---------
        // my.sprite.bgBrown = this.add.tileSprite(64, 64, 0, 0, "bgBrown");  
        my.sprite.blueBG = this.add.tileSprite(0, 0, 1800, 1800, "bgBlue");
        // my.sprite.greenBG = this.add.tileSprite(0, 0, 1800, 1800, "bgGreen");

        my.sprite.GUIBG = this.add.rectangle(game.config.width/2, game.config.height, game.config.width, 200, 0xFF70B4, 0.4);

        // --------== Text ==---------
        this.scoreTxt = this.add.text(game.config.width-430, game.config.height-80, points, {
            fontFamily: "'Freeman'",
            fontSize: 50,
            align: "right",
            fixedWidth: 400,
            fixedHeight: 50
        });
        this.waveTxt = this.add.text(game.config.width/2-25, game.config.height-80, "Wave\n"+this.waveNum+"/"+this.maxWaves, {
            fontFamily: "'Freeman'",
            fontSize: 25,
            align: "center",
            fixedHeight: 150
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

        // -- Enemy Bullets --
        my.sprite.eBulletGroup = this.add.group({
            defaultKey: "pinkDia0",
            maxSize: 10,
            runChildUpdate: true
            }
        )

        // Create all of the bullets at once, and set them to inactive
        // Taken from https://github.com/JimWhiteheadUCSC/BulletTime
        my.sprite.eBulletGroup.createMultiple({
            classType: EnemyBullet,
            active: false,
            visible: false,
            key: my.sprite.eBulletGroup.defaultKey,
            repeat: my.sprite.eBulletGroup.maxSize-1,
            setScale: { x: .3, y: .3 }
        });
        my.sprite.eBulletGroup.propertyValueSet("speed", this.enemyBulletSpeed);

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
            maxSize: 5,
            runChildUpdate: true
        })
        // Create Wave Group 4
        my.sprite.redEnemyW4 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "redCir0",
            maxSize: 5,
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
            maxSize: 2,
            runChildUpdate: true
        })
        // Create Wave Group 2
        my.sprite.blueEnemyW2 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 3,
            runChildUpdate: true
        })
        // Create Wave Group 3
        my.sprite.blueEnemyW3 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 4,
            runChildUpdate: true
        })
        // Create Wave Group 4
        my.sprite.blueEnemyW4 = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 6,
            runChildUpdate: true
        })

        // --------== HP restore ==--------
        // Create death animation
        this.anims.create({
            key: "pinkDie",
            frames: [
                { key: "pinkDie0" },
                { key: "pinkDie1" },
                { key: "pinkDie2" },
            ],
            framerate: .5,
            hideOnComplete: true
        });

        // This is probably something that should be read from a .json file or something
        this.curvePoints = [
            [(game.config.width/3)-15, -50,
            (game.config.width/3)-15, 300,
            -50, 350],
            [(game.config.width-200), -50,
            (game.config.width-200), 300,
            (game.config.width+50), 350],
            [(game.config.width/3), -50,
            (game.config.width-200), 150,
            (game.config.width+50), 350],
            [(game.config.width-200), -50,
            (game.config.width/3)-15, 200,
            -50, 350],
            [(game.config.width/3)-15, -50,
            (game.config.width/2)-15, 150,
            -50, 350],
            // The following are pasted several times to increase probability
            [(game.config.width/6)-15, -40,
            (game.config.width/2), 100,
            (game.config.width-50), -40],
            [(game.config.width-50), -40,
            (game.config.width/2), 100,
            (game.config.width/6)-15, -40],
            [(game.config.width/6)-15, -40,
            (game.config.width/2), 100,
            (game.config.width-50), -40],
            [(game.config.width-50), -40,
            (game.config.width/2), 100,
            (game.config.width/6)-15, -40],
            [(game.config.width/6)-15, -40,
            (game.config.width/2), 100,
            (game.config.width-50), -40],
            [(game.config.width-50), -40,
            (game.config.width/2), 100,
            (game.config.width/6)-15, -40],
            [(game.config.width/6)-15, -40,
            (game.config.width/2), 100,
            (game.config.width-50), -40],
            [(game.config.width-50), -40,
            (game.config.width/2), 100,
            (game.config.width/6)-15, -40],
        ];
        // Make an array of spline paths to choose from
        this.pinkCurve = [];
        for (let i = 0; i < this.curvePoints.length; i++){
            this.pinkCurve.push(new Phaser.Curves.Spline(this.curvePoints[i]));
        }
        // randomly pick a spline path to follow
        let randIdx = Math.floor(Math.random()*this.pinkCurve.length);
        my.sprite.pinkEnem = this.add.follower(this.pinkCurve[randIdx], -250, -50, "pinkDia0");

        // --------== Spawn in first wave ==----------
        this.waveGroups = [[my.sprite.redEnemyW1, my.sprite.blueEnemyW1], [my.sprite.redEnemyW2, my.sprite.blueEnemyW2], [my.sprite.redEnemyW3, my.sprite.blueEnemyW3], [my.sprite.redEnemyW4, my.sprite.blueEnemyW4]]
        this.redEnemyGroup = this.waveGroups[0][0];
        this.blueEnemyGroup = this.waveGroups[0][1];

        this.wave(this, my.sprite.redEnemyW1, my.sprite.blueEnemyW1);
        this.waveSize = my.sprite.redEnemyW1.maxSize + my.sprite.blueEnemyW1.maxSize;
        
        
        // --------== Player Health ==--------
        // using arrays n stuff in case we want to change the amt of health given
        my.sprite.heartFullArr = [];
        my.sprite.heartHurtArr = [];
        let heartXarr = [50, 110, 170];

        for (let i = 0; i < this.pHealthMax; i++){
            let hurtTemp = this.add.sprite(heartXarr[i], game.config.height-50, "hurtHP");
            let fullTemp = this.add.sprite(heartXarr[i], game.config.height-50, "fullHP");
            hurtTemp.setScale(.75);
            fullTemp.setScale(.75);
            my.sprite.heartHurtArr.push(hurtTemp);
            my.sprite.heartFullArr.push(fullTemp);
        }

        // -----= Menu =----- (debug)
        // (Esc) 
        // let escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        // escKey.on('down', (key, event) => {
        //     // console.log("esc key");
        //     if (points > highScore){
        //         highScore = points;
        //     }
        //     // this.scene.pause();
        //     this.scene.start('endScreen');
        // })
    }
// ----------------------------------------------------------------------------------------
    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.timer++;
        // Prevent overflow
        if (this.timer == Number.MAX_SAFE_INTEGER-1){this.timer = 0}
        this.bulletCooldownCounter--;
        this.enemyBulletCooldownCounter--;
        
        // BG Scroll Brown
        // my.sprite.bgBrown.tilePositionY -= 8;
        // my.sprite.bgBrown.tilePositionX += .5; 
        // BG Scroll Blue
        my.sprite.blueBG.tilePositionY -= 8;
        my.sprite.blueBG.tilePositionX += .5; 
        // BG Scroll Green
        // my.sprite.greenBG.tilePositionY -= 8;
        // my.sprite.greenBG.tilePositionX += .5; 
        
        // Every 500 ticks, a pink enemy appears
        // We reuse the same pink enemy every time bc there is only one on screen at a time anyways
        if (this.timer%50 == 0){
            let followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 2000,
                ease: 'Sine.easeOut',
                // ease: 'Sine.easeInOut',
                repeat: 0,
                yoyo: false
                // rotateToPath: true,
                // rotationOffset: -90
            }
            my.sprite.pinkEnem.visible = true;
            // my.sprite.pinkEnem.active = true;

            let randIdx = Math.floor(Math.random()*this.pinkCurve.length);
            my.sprite.pinkEnem = this.add.follower(this.pinkCurve[randIdx], -250, -50, "pinkDia0");
            my.sprite.pinkEnem.x = this.pinkCurve[randIdx].points[0].x;
            my.sprite.pinkEnem.y = this.pinkCurve[randIdx].points[0].y;
            my.sprite.pinkEnem.startFollow(followConfig);
        }

        // Player Bullets
        if (this.spaceKey.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.pBulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.sound.play("shootSFX");
                    bullet.makeActive();
                    bullet.x = my.sprite.player.x-10;
                    bullet.y = my.sprite.player.y-57;
                    bullet.makeActive();

                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }

        // Set pinkEnem to inactive if out of bounds
        // if in bounds then my.sprite.pinkEnem.active = true;
        if ((my.sprite.pinkEnem.x > 0 || my.sprite.pinkEnem.y > 0)){
            my.sprite.pinkEnem.active = true;
        } else {
            my.sprite.pinkEnem.active = false;
        }

        // Enemy Bullets
        if ((this.timer-(Math.floor(1+Math.random()*50)))%10 == 0) {
        // if (true) { //debugging
            // if ((this.timer-15)%10 == 0) {
            if (my.sprite.pinkEnem.active == true) {
                // for (let bullet of my.sprite.eBulletGroup.getChildren()) {
                //     bullet.makeActive();
                //     bullet.x = my.sprite.pinkEnem.x+20;
                //     bullet.y = my.sprite.pinkEnem.y+20;
                // }
                if (this.enemyBulletCooldownCounter < 0) {
                    // Get the first inactive bullet, and make it active
                    let bullet = my.sprite.eBulletGroup.getFirstDead(true);
                    // bullet will be null if there are no inactive (available) bullets
                    if (bullet != null) {
                        this.sound.play("eShootSFX");
                        bullet.makeActive();
                        bullet.x = my.sprite.pinkEnem.x+20;
                        bullet.y = my.sprite.pinkEnem.y+20;
                        bullet.makeActive();
    
                        this.enemyBulletCooldownCounter = this.enemyBulletCooldown;
                    }
                }
            }
        }

        // Check for bullet hitting active enemy
        for (let bullet of my.sprite.pBulletGroup.getChildren()) {
            // Check 2HP enemies
            for (let enemy of this.blueEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    this.sound.play("hitSFX");
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
                    this.sound.play("hitSFX");
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

            // Check HP+ enemy
            if (bullet.active == true && my.sprite.pinkEnem.active == true && this.collides(my.sprite.pinkEnem, bullet)){
                this.sound.play("hitSFX");
                if (this.playerHealth == this.pHealthMax){
                    points += 1000;
                } else {
                    this.playerHealth++;
                }
                this.scoreTxt.setText(points);
                bullet.y = -100;
                this.add.sprite(my.sprite.pinkEnem.x, my.sprite.pinkEnem.y, "pinkDie0").play("pinkDie");
                my.sprite.pinkEnem.x = -250;
                my.sprite.pinkEnem.y = -150;
                my.sprite.pinkEnem.active = false;
                // might make a lot of new objects that need to be cleaned (not fixed rn)
                // let randIdx = Math.floor(Math.random()*this.curvePoints.length);
                // this.pinkCurve = new Phaser.Curves.Spline(this.curvePoints[randIdx]);
                // my.sprite.pinkEnem = this.add.follower(this.pinkCurve, -50, -50, "pinkDia0");
            }
        }

        // Select next active wave if previous is complete
        if (this.waveSize == this.numDeafeat) {
            this.waveNum++;
            // If game is complete: stop
            // Else: proceed as normal
            if (this.waveNum == this.maxWaves){
                if (points > highScore){
                    highScore = points;
                }
                this.sound.play("winSFX");
                this.scene.start('endScreen');
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
        
        // Check if player got hit
        for (let eBull of my.sprite.eBulletGroup.getChildren()){
            if (this.collides(my.sprite.player, eBull)){
                this.sound.play("pHitSFX");
                // console.log(my.sprite.player.x+" and "+my.sprite.eBulletGroup);
                this.playerHealth--;
                // eBull.active = false;
                eBull.x = -600;
            }
        }
        
        // End game if out of health
        if (this.playerHealth <= 0){
            if (points > highScore){
                highScore = points;
            }
            this.sound.play("loseSFX");
            this.scene.start('endScreen');
        }
        
        // Update the hearts shown
        if (this.playerHealth > 0){
            // Set the hearts to visible
            for (let i = 0; i < this.playerHealth; i++){
                my.sprite.heartFullArr[i].visible = true;
            }
            // Set the remaining full hearts to invisible
            for (let i = this.playerHealth; i < this.pHealthMax; i++){
                my.sprite.heartFullArr[i].visible = false;
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

        this.playerHealth = this.pHealthMax;

        // Timer
        this.timer = 0;
        this.numDeafeat = 0;
    }

}