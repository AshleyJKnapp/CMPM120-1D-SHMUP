class PauseScreen extends Phaser.Scene {
    constructor() {
        super('pauseScreen');
    }

    preload() {
        // nothing rn
    }

    create() {
        // -----= Resume Game =-----
        // (Esc)
        let escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey.on('down', (key, event) => {
            // console.log("esc key");
            this.scene.start('playScene');
            // this.scene.resume('playScene');
        })

        // -----= Restart Game =-----
        // (R)
        let rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        rKey.on('down', (key, event) => {
            // console.log("r key");
            this.scene.start('playScene');
        })
    }
}