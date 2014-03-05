
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
    var score = 0;
    var hiscore = window.localStorage.getItem('flappyHiScore') || 0;


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
                            ticks: 6,
                            frames: 3
                        },
                        offset: {x: 120, y: 200}
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
    flappyDev.clicksOnContainer(function (e) {

        if (this.getGameState().idle) {
            this.play();
        }

        if (this.getGameState().ended) {

            if (this.isOnTarget({x: 125, y: 250, w: 250, h: 60}, e.offsetX, e.offsetY)) {
                this.reset();
            }
        }

        // GameSate returns states for 'on', 'paused', 'level', 'idle', etc.
        if (this.getGameState().on) {
            this.assets.character.rise(4);
        }

    });

    document.addEventListener('keydown', function (e) {

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

        score = 0;
    };

    // CTX Draw hook into the game loop
    // 'this' will reference to the new FlappyDev instance
    flappyDev.onDraw = function () {

        // Draw a collection
        this.assets.collection('background').draw();
        this.assets.collection('foreground').draw();
        this.assets.collection('pillars').draw();

        // Draw individual enteties
        this.assets.character.draw();

        if (this.ended) {
            printEndScore();
            this.paused = true;
        }

        if (!this.ended) {
            printScore();
        }

    };

    // Update Assets, position etc.
    flappyDev.onUpdate = function () {

        if (this.ended) {
            return;
        }

        animateBackground();
        animateForeground();

        if (this.idle) {
            wobbleCharacter();
            return;
        }

        this.assets.character.updateSprite();

        animateCharacter();
        animatePillars();

        isOutOfBounds();
        isCollision();

    };

    function layoutPillars (first) {

        var l = flappyDev.assets.pillars.length;

        if (flappyDev._.pillarIteration) {
            flappyDev._.pillarIteration = flappyDev._.pillarIteration - 1
        }

        if (first || flappyDev._.pillarIteration === 0) {
            flappyDev._.pillarIteration = l;
        } else {
            return ;
        }

        var xOffset = first ? 700 : 500;
        var pair = [];
        var positionY;

        flappyDev.assets.pillars.forEach(function (pillar, i) {

                pillar.isHidden = false;
                pillar.hasScored = false;
                pair.push(pillar);

                if (i % 2 === 1) {

                    positionY = Math.random() * (400 - 200) + 200;

                    pair[0].y = positionY - 400 - 130;
                    pair[1].y = positionY;
                    pair[0].offsetY = positionY - 400 - 130;
                    pair[1].offsetY = positionY;
                    pair[0].x = xOffset;
                    pair[1].x = xOffset;
                    pair[0].offsetX = xOffset;
                    pair[1].offsetX = xOffset;

                    pair.length = 0;
                    xOffset = xOffset + 255;
                }

        });



    }

    function animatePillars () {

        flappyDev.assets.pillars.forEach(function (pillar, i) {

            if (!pillar.isHidden) {
                pillar.move(2).left();
            }

            if (pillar.hasPassed(0) && !pillar.isHidden) {
                pillar.isHidden = true;
                layoutPillars();
            }

            if (!pillar.hasScored && pillar.hasPassed() < flappyDev.assets.character.x - flappyDev.assets.character.w / 2) {
                score += 0.5;

                pillar.hasScored = true;
            }

        });

    }

    function printScore () {

        flappyDev.game.ctx.fillStyle = 'rgba(255,255,255,.6)';
        flappyDev.game.ctx.font = 'bold 20px press_start_2pregular';
        flappyDev.game.ctx.textBaseline = 'bottom';


        flappyDev.game.ctx.fillText(score, 25, 40);

    }

    function printEndScore () {

        window.setTimeout(function () {
            flappyDev.game.ctx.fillStyle = 'white';
            flappyDev.game.ctx.font = 'bold 30px press_start_2pregular';
            flappyDev.game.ctx.textBaseline = 'bottom';
            flappyDev.game.ctx.fillText('GAME OVER', 50, 100);

            flappyDev.game.ctx.fillText('Score: ' + score, 50, 150);
            flappyDev.game.ctx.fillText('Best: ' + hiscore, 50, 200);

            flappyDev.game.ctx.beginPath();
            flappyDev.game.ctx.rect(125, 250, 250, 60);
            flappyDev.game.ctx.fillStyle = 'red';
            flappyDev.game.ctx.fill();
            flappyDev.game.ctx.lineWidth = 4;
            flappyDev.game.ctx.strokeStyle = 'white';
            flappyDev.game.ctx.stroke();

            flappyDev.game.ctx.font = 'bold 20px press_start_2pregular';
            flappyDev.game.ctx.fillStyle = 'white';
            flappyDev.game.ctx.fillText('Try again!', 146, 290);
        }, 800);

    }

    function animateForeground () {

        flappyDev.assets.foreground.forEach(function (foreground) {

            foreground.move(2.2).left();

            if (foreground.hasPassed(0)) {
                foreground.x = foreground.w - 3;
            }

        });

    }

    function isOutOfBounds () {

        if (flappyDev.assets.character.isOutOfBounds(flappyDev.width, flappyDev.height - 55)) {
            endGame();
        }

    }

    function isCollision () {

        flappyDev.assets.pillars.forEach(function (p) {
            if (flappyDev.assets.character.isCollision(p.x, p.y, p.w, p.h)) {
                endGame();
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

    function endGame () {

        flappyDev.ended = true;

        if (window.localStorage.getItem('flappyHiScore')) {

            if (window.localStorage.getItem('flappyHiScore') < score) {
                window.localStorage.setItem('flappyHiScore', score);
                hiScoreContainer.innerHTML = score;
            }

        } else {
            window.localStorage.setItem('flappyHiScore', score);
            hiScoreContainer.innerHTML = score;
        }

    }

})();



