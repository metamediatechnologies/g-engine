
  _g.module(
      'g.timer'
    )
    .defines(function () {

        /** @constructor
         *  @extends {_g.Class}
         */
        _g.Timer = _g.Class.extend({
            target: 0,
            base: 0,
            last: 0,

            /** @param {Number} */
            init: function (seconds) {
                this.base = _g.Timer.time;
                this.last = _g.Timer.time;
                this.target = seconds || 0;
            },

            /** @param {Number} */
            set: function (seconds) {
                this.target = seconds || 0;
                this.base = _g.Timer.time;
            },

            reset: function () {
                this.base = _g.Timer.time;
            },


            tick: function () {
                var delta = _g.Timer.time - this.last;
                this.last = _g.Timer.time;
                return delta;
            },

            delta: function () {
                return _g.Timer.time - this.base - this.target;
            }
        });

        _g.Timer._last = 0;
        _g.Timer.time = 0;
        _g.Timer.timeScale = 1;
        _g.Timer.maxStep = 0.05;

        _g.Timer.step = function () {
           // if ( _g.Timer.time === 0)
           //   _g.log("Timer.step: Starting to walk...");

            var current = Date.now();
            var delta = (current - _g.Timer._last) / 1000;
            _g.Timer.time += Math.min(delta, _g.Timer.maxStep) * _g.Timer.timeScale;
            _g.Timer._last = current;
        };
    });
