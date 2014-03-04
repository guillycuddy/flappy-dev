
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
                    {src:'/assets/background.png', offset: {x: 500}}
                ]
            }
        );

    flappyDev.loadAssets(
            {
                collectionName: 'pillars',
                assets: [
                    {src:'/assets/pillar.png', offset: {x: 700}}
                ],
                duplicates: 20
            }
        );

    flappyDev.loadAssets(
            {
                assets: [
                    {
                        name: 'character',
                        src:'/assets/ninja-sprite.png',
                        sprite: {
                            ticksPerFrame: 6,
                            numberOfFrames: 3
                        },
                        offset: {x: 140, y: 200}
                    }
                ]
            }
        );

    flappyDev.loadAssets(
            {
                collectionName: 'foreground',
                assets: [
                    {src:'/assets/foreground.png', offset: {x: 0, y: 400}},
                    {src:'/assets/foreground.png', offset: {x: 500, y: 400}}
                ]
            }
        );

    // The games load event
    // Here we can do some further work
    // that needs to be done once
    // assets are loaded etc.
    flappyDev.onLoad(function () {

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

    flappyDev.onPlay = function () {
        layoutPillars(true);
    };

    // CTX Draw hook into the game loop
    // 'this' will reference to the new FlappyDev instance
    flappyDev.onDraw = function () {

        flappyDev.allAssets.forEach(function(asset) {

            if (!asset.isSprite) {

                flappyDev.game.ctx.drawImage(asset.el, asset.x, asset.y);

            } else {
                asset.updateSprite();

                flappyDev.game.ctx.drawImage(
                    asset.el,
                    asset.frameIndex * asset.w,
                    0,
                    asset.w,
                    asset.h,
                    asset.x,
                    asset.y,
                    asset.w,
                    asset.h
                );

            }

        });

    };

    // Update Assets, position etc.
    flappyDev.onUpdate = function () {

        animateBackground();
        animateForeground();

        if (this.idle) {
            wobbleCharacter();
            return;
        }

        animateCharacter();
        animatePillars();

        isOutOfBounds();
        isCollision();

    };

    function layoutPillars (first) {

        if (first || flappyDev.cache.pillarIteration === 0) {
            flappyDev.cache.pillarIteration = flappyDev.assets.pillars.length;
        }

        var xOffset = first ? 700 : 500;
        var pairs = [];
        var pair = [];
        var positionY;

        flappyDev.assets.pillars.forEach(function (pillar, i) {


            if (flappyDev.cache.pillarIteration === flappyDev.assets.pillars.length) {

                pillar.isHidden = false;
                pair.push(pillar);


                if (i % 2 === 1) {

                    positionY = Math.random() * (400 - 200) + 200;


                    pair[0].y = positionY - 400 - 120;
                    pair[1].y = positionY;
                    pair[0].offsetY = positionY - 400 - 120;
                    pair[1].offsetY = positionY;
                    pair[0].x = xOffset;
                    pair[1].x = xOffset;
                    pair[0].offsetX = xOffset;
                    pair[1].offsetX = xOffset;

                    pair = [];
                    xOffset = xOffset + 250;
                }

            }



        });

        flappyDev.cache.pillarIteration = flappyDev.cache.pillarIteration - 1;

    }

    function animatePillars () {

        flappyDev.assets.pillars.forEach(function (pillar) {

            if (!pillar.isHidden) {
                pillar.move(2).left();
            }

            if (pillar.hasPassed(0) && !pillar.isHidden) {
                layoutPillars();
                pillar.isHidden = true;
            }

        });

    }

    function animateForeground () {

        flappyDev.assets.foreground.forEach(function (foreground) {

            foreground.move(2).left();

            if (foreground.hasPassed(0)) {
                foreground.x = foreground.w - 3;
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
                background.x = background.w - 3;
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



