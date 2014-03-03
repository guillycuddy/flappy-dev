
// Flappy Dev Example Game
// Author:  @robertpiira
// Home:    github.com/robertpiira/flappyDev
// Thanks:  Johan G for the gravity


// Optional use of FastClickJS for touchScreen betterness
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

// This is where we create a new FlappyEngine Instance
// and start using the FlappyEngine game API
(function () {

    // Get the game container DOM element
    var container = document.getElementById('FlappyDevGame');

    // Game settings
    var settings = {
        gravityY: -0.19
    }

    // Initialize a new FlappyEngine game within the game container
    window.flappyDev = new FlappyEngine(container, settings);

    // Load some assets
    // Last asset goes on the top layer
    flappyDev.loadAssets(
            {
                collectionName: 'background',
                assets: [
                    {src:'/assets/background.png'},
                ],
                amount: 2
            }
        );

    flappyDev.loadAssets(
            {
                collectionName: 'pillars',
                assets: [
                    {src:'/assets/pillar.png', offset: {x: 700, y: 200}}
                ],
                amount: 20
            }
        );

    flappyDev.loadAssets(
            {
                assets: [
                    {name: 'character', src:'/assets/character.png', offset: {x: 140, y: 200}}
                ]
            }
        );

    // The games load event
    // Here we can do some further work
    // that needs to be done once
    // assets are loaded etc.
    flappyDev.onLoad(function () {

        // set the static offset
        flappyDev.assets.background[1].offsetX = 500;
        // set the dynamic offset
        flappyDev.assets.background[1].x = 500;

        // Now we can start the game!
        flappyDev.start();

    });



    // Flappy container click event
    // 'this' will reference to the new FlappyDev instance
    flappyDev.clicksOnContainer(function () {

        if (this.getGameState().idle) {
            this.play();
        }

        // GameSate returns states for 'on', 'paused', 'level', 'idle', etc.
        if (this.getGameState().on) {
            this.assets.character.rise(4);
        }

    });

    document.addEventListener('keyup', function (e) {

        if (e.which === 32) {

            e.preventDefault();

            if (flappyDev.getGameState().idle) {
                flappyDev.play();
            }

            // GameSate returns states for 'on', 'paused', 'level', 'idle', etc.
            if (flappyDev.getGameState().on) {
                flappyDev.assets.character.rise(4.5);
            }

        }

    });

    // CTX Draw hook into the game loop
    // 'this' will reference to the new FlappyDev instance
    flappyDev.onDraw = function () {

    };

    // Update Assets, position etc.
    flappyDev.onUpdate = function () {

        animateBackground();

        if (this.idle) {
            wobbleCharacter();
            return;
        }

        animateCharacter();
        animatePillars();

        isOutOfBounds();
        isCollision();

    };

    function animatePillars () {

        flappyDev.assets.pillars.forEach(function (pillar) {

            pillar.move(2).left();

            if (pillar.hasPassed(0)) {
                pillar.x = 600;
            }

        });

    }

    function isOutOfBounds () {
        if (flappyDev.assets.character.isOutOfBounds(flappyDev.width, flappyDev.height)) {
            flappyDev.reset();
        }
    }

    function isCollision () {

        flappyDev.assets.pillars.forEach(function (p) {
            if (flappyDev.assets.character.isCollision(p.x, p.y, p.w, p.h)) {
                flappyDev.reset();
            }
        });

    }

    function animateBackground () {

        flappyDev.assets.background.forEach(function (background) {

            background.move(0.4).left();

            if (background.hasPassed(0)) {
                background.x = background.w;
            }

        });

    }

    function animateCharacter () {
        flappyDev.assets.character.fall();
    }

    // Some custom fuctions
    function wobbleCharacter () {

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



