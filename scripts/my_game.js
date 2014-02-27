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


// Flappy container click event
// 'this' will reference to the new FlappyDev instance
flappyDev.clicksOnContainer(function () {

    // GameSate returns states for 'on', 'paused', 'level', etc.
    if (this.getGameState().on) {
        this.assets.character.rise(4.5);
    }

    if (this.getGameState().idle) {
        this.play();
    }

});

// Hook into the game loop renderer
// 'this' will reference to the new FlappyDev instance
flappyDev.onRender(function () {

    // Animate and Draw backgrounds
    this.assets.background.moveXRTL(0.2, true);
    this.assets.background2.moveXRTL(0.2, true);
    this.background.ctx.drawImage(this.assets.background.el, this.assets.background.x, this.assets.background.y);
    this.background.ctx.drawImage(this.assets.background2.el, this.assets.background2.x,this.assets.background2.y);

    if (this.idle) {

        this.game.ctx.drawImage(this.assets.character.el, this.assets.character.x, this.assets.character.y);

        this.assets.character.callback(function () {

            var medium = 200;

            if (medium - 20 < this.y) {
                this.velocityY += this.scopeGravityY;
                this.y += this.velocityY;
            } else if (medium - 20 > this.y) {
                this.velocityY -= this.scopeGravityY;
                this.y += this.velocityY;
            }

        });

        return;
    }

    this.game.ctx.drawImage(this.assets.character.el, this.assets.character.x, this.assets.character.y);
    this.assets.character.fall();

});

