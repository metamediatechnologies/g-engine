  _g.module(
      'g.system'
    )
    .requires(
      'g.timer',
      'g.image'
    )
    .defines(function () {

      /** @constructor
       *  @extends {_g.Class}
       */
      _g.System = _g.Class.extend({

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

            _loopStarted: false,

            init: function (canvasId, fps, width, height, scale) {
                this.fps =  fps || this.fps;
                this.width = width || this.width;
                this.height = height || this.height;
                this.scale =  scale || this.scale;
                this.realWidth = this.width * this.scale;
                this.realHeight = this.height * this.scale;

                this.clock = new _g.Timer();


              //Need to make fallback to flash
                canvasId = canvasId || "canvas";
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
                _g.system.setDelegate(_g.game);
            },

            setDelegate: function (object) {
                if (typeof (object.run) == 'function') {
                    this.delegate = object;
                    this.startRunLoop();
                } else {
                    throw ('System.setDelegate: No run() function in object');
                }
            },

            stopRunLoop: function () {
                clearInterval(this.intervalId);
                this.running = false;
                this._loopStarted = false;
                _g.log('System: Main loop stopped.');
            },

            startRunLoop: function () {
                this.stopRunLoop();
                this.intervalId = setInterval(this.run.bind(this), 1000 / this.fps);
                this.running = true;
                _g.log('System: Main loop started.');
            },

            clear: function (color) {
                this.context.fillStyle = color;
                this.context.fillRect(0, 0, this.realWidth, this.realHeight);
            },

            run: function () {
                if (!this._loopStarted) {
                  this._loopStarted = true;
                  _g.log('System.run: Just entered main loop for the first time.');
                }
                _g.Timer.step();
                this.tick = this.clock.tick();
                this.delegate.run();
                //_g.input.clearPressed();
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
