
  _g.module(
      'g.animation'
    )
    .requires(
      'g.timer',
      'g.image'
    )
    .defines(function () {

        /** @constructor */
        _g.AnimationSheet = _g.Class.extend({
            width: 8,
            height: 8,
            image: null,

            init: function (path, width, height) {
                this.width = width;
                this.height = height;
                this.image = new _g.Image(path);
            }
        });

        /** @constructor */
        _g.Animation = _g.Class.extend({
            sheet: null,
            timer: null,
            sequence: [],
            flip: {
                x: false,
                y: false
            },
            frame: 0,
            tile: 0,
            loopCount: 0,
            alpha: 1,

            init: function (sheet, frameTime, sequence, stop) {
                this.sheet = sheet;
                this.timer = new _g.Timer();
                this.frameTime = frameTime;
                this.sequence = sequence;
                this.stop = !! stop;
            },

            rewind: function () {
                this.timer.reset();
                this.loopCount = 0;
                this.tile = this.sequence[0];
                return this;
            },

            gotoFrame: function (f) {
                this.timer.set(this.frameTime * -f);
                this.update();
            },

            gotoRandomFrame: function () {
                this.gotoFrame((Math.random() * this.sequence.length).floor())
            },

            update: function () {
                var frameTotal = (this.timer.delta() / this.frameTime).floor();
                this.loopCount = (frameTotal / this.sequence.length).floor();
                if (this.stop && this.loopCount > 0) {
                    this.frame = this.sequence.length - 1;
                } else {
                    this.frame = frameTotal % this.sequence.length;
                }
                this.tile = this.sequence[this.frame];
            },

            draw: function (targetX, targetY) {
                if (targetX > _g.system.width || targetY > _g.system.height || targetX + this.sheet.width < 0 || targetY + this.sheet.height < 0) {
                    return;
                }
                _g.system.context.globalAlpha = this.alpha;
                this.sheet.image.drawTile(targetX, targetY, this.tile, this.sheet.width, this.sheet.height, this.flip.x, this.flip.y, this.alpha);
                _g.system.context.globalAlpha = 1;
            }
        });
    });
