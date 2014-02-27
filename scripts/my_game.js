
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
    window.flappyDev = new FlappyEngine(container);

    // PreLoadAssets
    // ...and set options for them
    flappyDev.preLoadAssets(
            {
                root: 'assets',
                assets: [
                    {name: 'background', src:'background.png'},
                    {name: 'background2', src:'background.png', offset: {x: 500, y: 0}},
                    {name: 'character', src:'character.png', offset: {x: 140, y: 200}},
                    {name: 'pillar', src:'pillar.png', offset: {x: 700, y: 200}},
                    {name: 'pillar2', src:'pillar.png', offset: {x: 700, y: -330}},
                    {name: 'pillar3', src:'pillar.png', offset: {x: 1000, y: 430}},
                    {name: 'pillar4', src:'pillar.png', offset: {x: 1000, y: -100}}
                ]
            }
        );

    // Start the game!
    flappyDev.start();


    // Flappy container click event
    // 'this' will reference to the new FlappyDev instance
    flappyDev.clicksOnContainer(function () {

        if (this.getGameState().idle) {
            this.play();
        }

        // GameSate returns states for 'on', 'paused', 'level', 'idle', etc.
        if (this.getGameState().on) {
            this.assets.character.rise(4.5);
        }

    });

    // Hook into the game loop
    // 'this' will reference to the new FlappyDev instance
    flappyDev.inLoop(function () {

        animateBackground();

        if (this.idle) {
            wobbleCharacter();
            return;
        }

        animateCharacter();
        animatePillar();

        isOutOfBounds();
        isCollision();

    });

    function animatePillar () {
        flappyDev.assets.pillar.moveXRTL(2);
        flappyDev.game.ctx.drawImage(flappyDev.assets.pillar.el, flappyDev.assets.pillar.x, flappyDev.assets.pillar.y);
        flappyDev.assets.pillar2.moveXRTL(2);
        flappyDev.game.ctx.drawImage(flappyDev.assets.pillar2.el, flappyDev.assets.pillar2.x, flappyDev.assets.pillar2.y);
        flappyDev.assets.pillar3.moveXRTL(2);
        flappyDev.game.ctx.drawImage(flappyDev.assets.pillar3.el, flappyDev.assets.pillar3.x, flappyDev.assets.pillar3.y);
        flappyDev.assets.pillar4.moveXRTL(2);
        flappyDev.game.ctx.drawImage(flappyDev.assets.pillar4.el, flappyDev.assets.pillar4.x, flappyDev.assets.pillar4.y);
    }

    function isOutOfBounds () {
        if (flappyDev.assets.character.isOutOfBounds(flappyDev.width, flappyDev.height)) {
            flappyDev.reset();
        }
    }

    function isCollision () {
        var pArr = [];

        pArr.push(flappyDev.assets.pillar);
        pArr.push(flappyDev.assets.pillar2);
        pArr.push(flappyDev.assets.pillar3);
        pArr.push(flappyDev.assets.pillar4);

        pArr.forEach(function (p) {
            if (flappyDev.assets.character.isCollision(p.x, p.y, p.w, p.h)) {
                flappyDev.reset();
            }
        });
    }

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



