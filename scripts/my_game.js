
// Flappy Dev Example Game
// Author:  @robertpiira
// Home:    github.com/robertpiira/flappyDev
// Thanks:  Johan G for the gravity


// This is where we create a new FlappyEngine Instance
// and start using the FlappyEngine game API
(function () {

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

        // GameSate returns states for 'on', 'paused', 'level', 'idle', etc.
        if (this.getGameState().on) {
            this.assets.character.rise(4.5);
        }

        if (this.getGameState().idle) {
            this.play();
        }

    });

    // Hook into the game loop renderer
    // 'this' will reference to the new FlappyDev instance
    flappyDev.inLoop(function () {

        animateBackground();

        if (this.idle) {
            wobbleCharacter();
            return;
        }

        animateCharacter();

    });

    function animateBackground () {
        flappyDev.assets.background.moveXRTL(0.2, true);
        flappyDev.assets.background2.moveXRTL(0.2, true);
        flappyDev.background.ctx.drawImage(flappyDev.assets.background.el, flappyDev.assets.background.x, flappyDev.assets.background.y);
        flappyDev.background.ctx.drawImage(flappyDev.assets.background2.el, flappyDev.assets.background2.x, flappyDev.assets.background2.y);

    }

    function animateCharacter () {
        flappyDev.game.ctx.drawImage(flappyDev.assets.character.el, flappyDev.assets.character.x, flappyDev.assets.character.y);
        flappyDev.assets.character.fall();
    }

    // Some custom fuctions
    function wobbleCharacter () {
        flappyDev.game.ctx.drawImage(flappyDev.assets.character.el, flappyDev.assets.character.x, flappyDev.assets.character.y);

        flappyDev.assets.character.callback(function () {

            var medium = 200;

            if (medium - 20 < this.y) {
                this.velocityY += this.scopeGravityY;
                this.y += this.velocityY;
            } else if (medium - 20 > this.y) {
                this.velocityY -= this.scopeGravityY;
                this.y += this.velocityY;
            }

        });
    }

})();



