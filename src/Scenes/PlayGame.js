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
        // this.load.image("bgGreen", "greebbg1.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // --------== Background Tiles ==---------
        // my.sprite.bgBrown = this.add.tileSprite(64, 64, 0, 0, "bgBrown");  
        my.sprite.blueBG = this.add.tileSprite(0, 0, 1800, 1800, "bgBlue");

        // --------== Text ==---------
        this.add.text(game.config.width-430, game.config.height-80, this.points, {
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

        
        // this.anims.create({
        //     key: "blueSqua",
        //     frames: [
        //         { key: "blueSq0" },
        //         { key: "blueSq1" },
        //         { key: "blueSq2" },
        //     ],
        //     framerate: 1
        // });

        // my.sprite.blueSq = this.add.sprite(game.config.width/2, 60, "blueSq0").setFrame("blueSq3");
        // // my.sprite.blueSq = this.blueSqua.setFrame("blueSq1");
        
        // -- Enemy --
        my.sprite.blueA = this.add.sprite(50, 60, "blueSq0");
        my.sprite.blueB = this.add.sprite(-50, 60, "blueSq1");
        my.sprite.blueC = this.add.sprite(-50, 60, "blueSq2");
        // my.sprite.blueD = this.add.sprite(game.config.width/2, 60, "blueSq3");
        my.sprite.blueB.visible = false;
        my.sprite.blueC.visible = false;
        // my.sprite.blueD.visible = false;

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

        // testing class for 2hit enemy
        // my.sprite.enemy2 = new EnemyTwoHP(this, game.config.width/2, 60, "blueSq0", 0, "blueSq1", "bluesq2", "blueDie");
        this.BlueDeath = this.add.sprite(my.sprite.blueB.x, my.sprite.blueB.y, "blueDie0")
        // my.sprite.enemy1A = new EnemyTwoHP(this, game.config.width-50, 60, "blueSq0", 0, my.sprite.blueB, this.BlueDeath, "blueDie");
        
        
        
        my.sprite.blueEnemyGroup = this.add.group({
            // classType: EnemyTwoHP,
            defaultKey: "blueSq0",
            maxSize: 3
        })
        
        // my.sprite.blueEnemyGroup = this.add.group();
        // my.sprite.temp = new EnemyTwoHP(this, game.config.width/2, 60, "blueSq0", 0, my.sprite.blueB, this.BlueDeath, "blueDie")

        // function EnemyTwoHP(game, x, y, frame){
        //     Phaser.Sprite.call(this, game, x, y, "blueSq0", frame, my.sprite.blueB, this.BlueDeath, "blueDie")
        // }

        // my.sprite.blueEnemyGroup.add(new EnemyTwoHP(this, game.config.width/2, 60, "blueSq0", 0, my.sprite.blueB, this.BlueDeath, "blueDie"));
        // my.sprite.blueEnemyGroup.add(new EnemyTwoHP(this, game.config.width/3, 150, "blueSq0", 0, my.sprite.blueB, this.BlueDeath, "blueDie"));
        // my.sprite.blueEnemyGroup.add(new EnemyTwoHP(this, game.config.width-100, 150, "blueSq0", 0, my.sprite.blueB, this.BlueDeath, "blueDie"));
        
        // my.sprite.blueEnemyGroup.createMultiple({
        //     classType: EnemyTwoHP,
        //     active: false,
        //     visible: true,
        //     key: my.sprite.blueEnemyGroup.defaultKey
        //     // x: game.config.width/2,
        //     // y: 60,
        //     // x: [game.config.width/2, game.config.width/3, game.config.width-100],
        //     // y: [60, 150, 90],
        //     // hit1: my.sprite.blueB,
        //     // animS: this.BlueDeath,
        //     // animK: "blueDie"
        // })
        let tmpArr = [game.config.width/2, game.config.width/3, game.config.width-100]
        // let i = 0;
        // for (let enemy of my.sprite.blueEnemyGroup.getChildren()){
        //     enemy.hit1 = my.sprite.blueB;
        //     enemy.animS = this.BlueDeath;
        //     enemy.animK = "blueDie";
        //     enemy.spriteKey = enemy.key;
        //     // enemy.x = game.config.width/2;
        //     enemy.x = tmpArr[i];
        //     enemy.y = 60;
        //     i++;
        //     console.log("x is ", enemy.x);
        // }
        // my.sprite.blueEnemyGroup.hit1 = my.sprite.blueB;
        // my.sprite.blueEnemyGroup.setAll("hit1", my.sprite.blueB);

        // Manually add custum sprites to group
        for (let i = 0; i < 3;  i++){
            let hSprite = this.add.sprite(-50, 60, "blueSq1");
            let decider = Math.floor(Math.random()*2);
            if (decider) {
                hSprite = this.add.sprite(-50, 60, "blueSq2");
            }
            let enemSpr = new EnemyTwoHP(this, tmpArr[i], 60, "blueSq0", 0, hSprite, this.BlueDeath, "blueDie")
            my.sprite.blueEnemyGroup.add(enemSpr);
        }


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

        // -----= Menu =-----
        // (Esc)
        let escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey.on('down', (key, event) => {
            // console.log("esc key");
            this.scene.pause();
            this.scene.start('pauseScreen');
        })
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.timer++;
        this.bulletCooldownCounter--;

        // BG Scroll
        my.sprite.blueBG.tilePositionY -= 8;
        my.sprite.blueBG.tilePositionX += .5; 

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


        // Check for collision with blueA (0 -> 1 hit on 2hit enemy)
        // my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        for (let bullet of my.sprite.pBulletGroup.getChildren()) {
            for (let enemy of my.sprite.blueEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    if (enemy.getHP() == 2){
                        enemy.onHit();
                    } else if (enemy.getHP() == 1){
                        enemy.onDeath();
                        this.points += enemy.getPoint();
                    }
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }

            for (let enemy of my.sprite.blueEnemyGroup.getChildren()){
                if (enemy.active == true && this.collides(enemy, bullet)){
                    // console.log("enemy hit");
                    enemy.onDeath();
                    this.points += enemy.getPoint();
                    enemy.decHP()
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }
            
            // if (this.collides(my.sprite.blueA, bullet)) {
            //     // swap sprite on first hit
            //     my.sprite.blueA.visible = false;
            //     // let decider = Math.floor(Math.random()*2);
            //     let decider = 1;
            //     if (decider) {
            //         // my.sprite.blueSq.setFrame("blueSq1")
            //         my.sprite.blueB.visible = true;
            //         my.sprite.blueB.x = my.sprite.blueA.x;
            //         my.sprite.blueB.y = my.sprite.blueA.y;
            //     } else {
            //         // my.sprite.blueSq.setFrame("blueSq2")
            //         my.sprite.blueC.visible = true;
            //         my.sprite.blueC.x = my.sprite.blueA.x;
            //         my.sprite.blueC.y = my.sprite.blueA.y;
            //     }
            //     // clear out bullet -- put y offscreen, will get reaped next update
            //     my.sprite.blueA.x = -50;
            //     bullet.y = -100;
            // } 
            // else if (this.collides(my.sprite.blueB, bullet) || this.collides(my.sprite.blueC, bullet)){
            //     this.blueDie = this.add.sprite(my.sprite.blueB.x, my.sprite.blueB.y, "blueDie0").play("blueDie");

            //     // my.sprite.enemy1A.animationSprite().x = my.sprite.enemy1A.x;
            //     // my.sprite.enemy1A.animationSprite().y = my.sprite.enemy1A.y;
            //     // my.sprite.enemy1A.visible = false;
            //     // my.sprite.enemy1A.animationSprite().play(my.sprite.enemy1A.animationKey());
            //     // my.sprite.enemy1A.onDeath();

            //     my.sprite.blueB.visible = false;
            //     // my.sprite.blueC.visible = false;
            //     my.sprite.blueB.x = -100;
            //     // my.sprite.blueC.x = -100;
            //     this.blueDie.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            //         this.my.sprite.blueB.visible = false;
            //         // this.my.sprite.blueB.x = Math.random()*config.width;
            //     }, this);
            //     // clear out bullet -- put y offscreen, will get reaped next update
            //     my.sprite.blueB.x = -50;
            //     my.sprite.blueC.x = -50;
            //     bullet.y = -100;
            // }
        }

        my.sprite.player.update();
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