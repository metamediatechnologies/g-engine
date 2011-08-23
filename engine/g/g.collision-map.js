

  _g.module(
      'g.collision-map'
    )
    .requires(
      'g.map'
    ).defines(function () {

        _g.CollisionMap = _g.Map.extend({
            firstSolidTile: 1,
            lastSolidTile: 255,

            init: function (tilesize, data) {
                this.parent(tilesize, data);
            },

            trace: function (x, y, vx, vy, objectWidth, objectHe_ght) {
                var res = {
                    collision: {
                        x: false,
                        y: false
                    },
                    pos: {
                        x: x,
                        y: y
                    },
                    tile: {
                        x: 0,
                        y: 0
                    }
                };

                var steps = (Math.max(Math.abs(vx), Math.abs(vy)) / this.tilesize).ceil();
                if (steps > 1) {
                    var sx = vx / steps;
                    var sy = vy / steps;
                    for (var i = 0; i < steps && (sx || sy); i++) {
                        this._traceStep(res, x, y, sx, sy, objectWidth, objectHeight);
                        x = res.pos.x;
                        y = res.pos.y;
                        if (res.collision.x) {
                            sx = 0;
                        }
                        if (res.collision.y) {
                            sy = 0;
                        }
                    }
                } else {
                    this._traceStep(res, x, y, vx, vy, objectWidth, objectHeight);
                }
                return res;
            },

            _traceStep: function (res, x, y, vx, vy, width, height) {
                res.pos.x += vx;
                res.pos.y += vy;
                if (vx) {
                    var pxOffsetX = (vx > 0 ? width : 0);
                    var tileOffsetX = (vx < 0 ? this.tilesize : 0);
                    var firstTileY = (y / this.tilesize).floor();
                    var lastTileY = ((y + height) / this.tilesize).ceil();
                    var tileX = ((x + vx + pxOffsetX) / this.tilesize).floor();
                    if (lastTileY >= 0 && firstTileY < this.height && tileX >= 0 && tileX < this.width) {
                        for (var tileY = firstTileY; tileY < lastTileY; tileY++) {
                            var t = this.data[tileY] && this.data[tileY][tileX];
                            if (t >= this.firstSolidTile && t <= this.lastSolidTile) {
                                res.collision.x = true;
                                res.tile.x = t;
                                res.pos.x = tileX * this.tilesize - pxOffsetX + tileOffsetX;
                                break;
                            }
                        }
                    }
                }
                if (vy) {
                    var pxOffsetY = (vy > 0 ? height : 0);
                    var tileOffsetY = (vy < 0 ? this.tilesize : 0);
                    var firstTileX = (res.pos.x / this.tilesize).floor();
                    var lastTileX = ((res.pos.x + width) / this.tilesize).ceil();
                    var tileY = ((y + vy + pxOffsetY) / this.tilesize).floor();
                    if (lastTileX >= 0 && firstTileX < this.width && tileY >= 0 && tileY < this.height) {
                        for (var tileX = firstTileX; tileX < lastTileX; tileX++) {
                            var t = this.data[tileY] && this.data[tileY][tileX];
                            if (t >= this.firstSolidTile && t <= this.lastSolidTile) {
                                res.collision.y = true;
                                res.tile.y = t;
                                res.pos.y = tileY * this.tilesize - pxOffsetY + tileOffsetY;
                                break;
                            }
                        }
                    }
                }
            }
        });

        _g.CollisionMap.staticNoCollision = {
            trace: function (x, y, vx, vy) {
                return {
                    collision: {
                        x: false,
                        y: false
                    },
                    pos: {
                        x: x + vx,
                        y: y + vy
                    },
                    tile: {
                        x: 0,
                        y: 0
                    }
                };
            }
        };
    });
