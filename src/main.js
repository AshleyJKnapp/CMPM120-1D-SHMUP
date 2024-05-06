// Ashley Knapp
// Created: 4/25/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: false  // prevent pixel art from getting blurred when scaled
    },
    // Orig
    // width: 800,
    // height: 600,
    // Edited
    width: 600,
    height: 800,
    scene: [PlayGame, EndScreen],
    fps: {forceSetTimeOut: true, target: 30}
}

const game = new Phaser.Game(config);