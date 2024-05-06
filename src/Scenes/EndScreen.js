class EndScreen extends Phaser.Scene {
    constructor() {
        super('endScreen');
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("bgGreen", "greenbg1.png");
    }

    create() {
        let my = this.my;    // create an alias to this.my for readability
        my.sprite.greenBG = this.add.tileSprite(0, 0, 1800, 1800, "bgGreen");

        // --------== Text ==---------
        // Previous score
        this.scoreTxt = this.add.text(game.config.width/3-10, 125, "     Score:\n     "+points, {
            fontFamily: "'Freeman'",
            fontSize: 50,
            align: "center",
            fixedHeight: 200
        });
        // High Score
        this.scoreTxt = this.add.text(game.config.width/3-10, 325, "High Score:\n"+highScore, {
            fontFamily: "'Freeman'",
            fontSize: 50,
            align: "center",
            fixedHeight: 200
        });
        // Instructions
        this.scoreTxt = this.add.text(game.config.width/3-5, game.config.height-200, "Press ESC\nto retry", {
            fontFamily: "'Courier'",
            fontSize: 40,
            align: "center",
            fixedHeight: 400
        });

        // -----= Restart Game =-----
        // (Esc)
        let escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey.on('down', (key, event) => {
            // console.log("esc key");
            this.scene.start('playScene');
            // this.scene.resume('playScene');
        })

    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        my.sprite.greenBG.tilePositionY += 1;
        my.sprite.greenBG.tilePositionX -= .25; 
    }
}