
  _g.module(
      'g.core'
    )
    .requires(
      'g.timer',
      'g.image'
    )
    .defines(function () {
        _g.Core = _g.Class.extend({
            fps: 30,

            width: 320,
            height: 240,
            realWidth: 320,
            realHeight: 240,
            scale: 1,

            tick: 0,
            intervalId: 0,
            clock: null,

            newGameClass: null,
            running: false,
            delegate: null,


            canvas: null,
            context: null,
            smoothPositioning: true,

            init: function (canvasId, fps, width, height, scale) {
                this.fps = fps;
                this.width = width;
                this.height = height;
                this.scale = scale;
                this.realWidth = width * scale;
                this.realHeight = height * scale;
                this.clock = new _g.Timer();
                this.canvas = _g.$(canvasId);
                this.canvas.width = this.realWidth;
                this.canvas.height = this.realHeight;
                this.context = this.canvas.getContext('2d');
            },

            setGame: function (gameClass) {
                if (this.running) {
                    this.newGameClass = gameClass;
                } else {
                    this.setGameNow(gameClass);
                }
            },

            setGameNow: function (gameClass) {
                _g.game = new(gameClass)();
                _g.core.setDelegate(_g.game);
            },

            setDelegate: function (object) {
                if (typeof (object.run) == 'function') {
                    this.delegate = object;
                    this.startRunLoop();
                } else {
                    throw ('Core.setDelegate: No run() function in object');
                }
            },

            stopRunLoop: function () {
                clearInterval(this.intervalId);
                this.running = false;
            },

            startRunLoop: function () {
                this.stopRunLoop();
                this.intervalId = setInterval(this.run.bind(this), 1000 / this.fps);
                this.running = true;
            },

            clear: function (color) {
                this.context.fillStyle = color;
                this.context.fillRect(0, 0, this.realWidth, this.realHeight);
            },

            run: function () {
                _g.Timer.step();
                this.tick = this.clock.tick();
                this.delegate.run();
                _g.input.clearPressed();
                if (this.newGameClass) {
                    this.setGameNow(this.newGameClass);
                    this.newGameClass = null;
                }
            },
            getDrawPos: function (p) {
                return this.smoothPositioning ? (p * this.scale).round() : p.round() * this.scale;
            }
        });
    });
