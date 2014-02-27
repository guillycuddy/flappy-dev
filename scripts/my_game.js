// Author: @robertpiira
// Home: github.com/robertpiira/flappyDev

// This is where we create a new FlappyEngine Instance
// and start using the FlappyEngine game API

// Get the game container DOM element
var container = document.getElementById('FlappyDevGame');

// Initialize a new FlappyEngine game within the game container
var flappyDev = new FlappyEngine(container);

// PreLoadAssets
// ...and set options for them
flappyDev.preLoadAssets(
        {
            root: 'assets',
            assets: [
                {name: 'background', src:'background.png'},
                {name: 'background2', src:'background.png', offset: {x: 500, y: 0}},
                {name: 'character', src:'character.png', offset: {x: 140, y: 200}}
            ]
        }
    );

// Start the game!
flappyDev.start();

// Set custom values
flappyDev.clicked = 0;

// Flappy container click event
// 'this' will reference to the new FlappyDev instance
flappyDev.clicksOnContainer(function () {

    this.clicked = this.clicked + 1;

});

// Add as many Flappy click handlers as you'd like
flappyDev.clicksOnContainer(function () {

    // GameSate returns states for 'on', 'paused', 'level', etc.
    if (this.getGameState().on) {
        this.assets.character.rise();
    }

});

// Hook into the game loop renderer
flappyDev.onRender(function () {

    this.assets.background.move();
    this.assets.background2.move();

    this.game.ctx.drawImage(this.assets.character.el, this.assets.character.x, this.assets.character.y);

    this.background.ctx.drawImage(this.assets.background.el, this.assets.background.x, this.assets.background.y);
    this.background.ctx.drawImage(this.assets.background2.el, this.assets.background2.x,this.assets.background2.y);

    flappyDev.assets.character.fall();

});

