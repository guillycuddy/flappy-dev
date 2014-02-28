
// Flappy Engine
// Author:  @robertpiira
// Home:    github.com/robertpiira/flappyDev
// Thanks:  Johan G for the gravity


(function (win, doc, undefined) {
  'use strict';

  win.requestAnimFrame = (function () {
    return  win.requestAnimationFrame  ||
      win.webkitRequestAnimationFrame  ||
      win.mozRequestAnimationFrame
  })();

  win.cancelRequestAnimationFrame = (function () {
    return  win.cancelRequestAnimationFrame  ||
      win.webkitCancelRequestAnimationFrame  ||
      win.mozCancelRequestAnimationFrame
  })();

  var _game;

  var createCanvas = function () {
    var canvasEl = doc.createElement('canvas');

    canvasEl.style.position = 'absolute';

    return {
      canvas: canvasEl,
      ctx: canvasEl.getContext('2d')
    };
  };

  var createImage = function (src) {
    var img = new Image();

    img.src = src;

    return img;
  };

  var Asset = function (img, offset, gravityY) {
    this.el = img;
    this.offsetX = (offset && offset.x) ? offset.x : 0;
    this.offsetY = (offset && offset.y) ? offset.y : 0;
    this.scopeGravityY = gravityY;
    this.velocityY = 0;
    this.w = img.width;
    this.h = img.height;
    this.x = 0 + this.offsetX;
    this.y = 0 + this.offsetY;
  };

  Asset.prototype  = {

    reset: function () {
      this.x = 0 + this.offsetX;
      this.y = 0 + this.offsetY;
      this.velocityY = 0;
    },

    isCollision: function (x, y, w, h) {
      return  (this.x + this.w >= x) && (this.x <= x + w) &&
              (this.y + this.h >= y) && (this.y <= y + h);
    },

    isOutOfBounds: function (w, h) {
      return  (this.x <= 0) || (this.w + this.x >= w) ||
              (this.y <= 0) || (this.h + this.y >= h);
    },

    fall: function () {
      this.velocityY -= this.scopeGravityY;
      this.y += this.velocityY;
    },

    rise: function (value) {
      this.velocityY = -value;
    },

    callback: function (callback) {
      callback.call(this);
    },

    moveXRTL: function (speed, loop) {

      if (loop) {
        if (this.x <= -(this.w)) {
          this.x = 0 + this.w;
        }
      }

      this.x = this.x - speed || 0.5;
    }

  };

  win.FlappyEngine = function (container, options) {

    _game = this;

    var settings = options || {};
    var requestId;

    var loop = function () {
      requestId = win.requestAnimFrame(loop);
      if (_game.loadedAssets && _game.loadedAssets === _game.assetsLength) {
        _game.render();
      }
    };

    this.container = container;
    this.container.style.position = 'relative';
    this.width = container.getBoundingClientRect().width;
    this.height = container.getBoundingClientRect().height;
    this.background = createCanvas();
    this.background.canvas.width = this.width;
    this.background.canvas.height = this.height;
    this.foreground = createCanvas();
    this.foreground.canvas.width = this.width;
    this.foreground.canvas.height = this.height;
    this.game = createCanvas();
    this.game.canvas.width = this.width;
    this.game.canvas.height = this.height;
    this.paused = false;
    this.idle = true;
    this.on = false;
    this.level = 0;
    this.assets = {};
    this.gravityY = settings.gravityY || -0.19;

    this.container.appendChild(this.background.canvas);
    this.container.appendChild(this.game.canvas);
    this.container.appendChild(this.foreground.canvas);

    this.start = function () {

      if (!requestId) {
        loop();
      }

    };

    this.stop = function () {

      if (requestId) {
         win.cancelRequestAnimationFrame(requestId);
         requestId = undefined;
         this.on = false;
      }

    };

    this.preLoadAssets = function (assets) {

      var assetsRoot = assets.root || 'assets';

      this.loadedAssets = 0;
      this.assetsLength = assets.assets.length;

      if (this.assetsLength === 0) {
        throw Error('No assets available. No assets, no game.');
      }

      assets.assets.forEach(function (asset) {

        (function (asset) {

          createImage(assetsRoot + '/' + asset.src).addEventListener('load', function () {

            _game.assets[asset.name] = new Asset(this, asset.offset, _game.gravityY);
            _game.loadedAssets = _game.loadedAssets + 1;

          }, false);

        })(asset);

      });

    };

  }

  FlappyEngine.prototype = {

    play: function () {
      this.idle = false;
      this.on = true;
      this.paused = false;
    },

    render: function () {

      if (this.paused) { return; }

      this.clearCanvas();
      this.inLoop();

    },

    reset: function () {

      this.paused = false;
      this.on = false;
      this.level = 0;
      this.idle = true;

      for (var key in this.assets) {

        if (this.assets.hasOwnProperty(key)) {
          this.assets[key].reset();
        }

      }

    },

    togglePause: function () {

      this.paused = !this.paused;

    },

    getGameState: function () {

      return {
        paused: this.paused,
        on: this.on,
        level: this.level,
        idle: this.idle
      }

    },

    clicksOnContainer: function (callback) {

      this.container.addEventListener('click', function () {

        if (typeof callback === 'function') {
          callback.call(_game);
        }

      }, false);

    },

    inLoop: function (callback) {

      this.inLoopCallback = this.inLoopCallback || callback;

      if (!callback) {
        this.inLoopCallback.call(this);
      }

    },

    clearCanvas: function() {

      this.background.ctx.clearRect(0, 0, this.width, this.height);
      this.game.ctx.clearRect(0, 0, this.width, this.height);

    }

  };

})(window, document);





