
  _g.module(
      'g.map'
    )
    .defines(function () {

      /** @constructor
       *  @extends {_g.Class}
       */
        _g.Map = _g.Class.extend({
            tilesize: 8,
            width: 1,
            height: 1,
            data: [
                []
            ],

            /**
             *  @param {Number}
             *  @param {Array[Array]}
             */
            init: function (tilesize, data) {
                this.tilesize = tilesize;
                this.data = data;
                this.height = data.length;
                this.width = data[0].length;
            },

            /**
             *  @param {Number}
             *  @param {Number}
             */
            getTile: function (x, y) {
                var tx = (x / this.tilesize).floor();
                var ty = (y / this.tilesize).floor();
                if ((tx >= 0 && tx < this.width) && (ty >= 0 && ty < this.height)) {
                    return this.data[ty][tx];
                } else {
                    return 0;
                }
            },

            /**
             *  @param {Number}
             *  @param {Number}
             *  @param {}
             */
            setTile: function (x, y, tile) {
                var tx = (x / this.tilesize).floor();
                var ty = (y / this.tilesize).floor();
                if ((tx >= 0 && tx < this.width) && (ty >= 0 && ty < this.height)) {
                    this.data[ty][tx] = tile;
                }
            }
        });
});
