
  _g.module(
      'g.background-map'
    )
    .requires(
      'g.map',
      'g.image'
    )
    defines(function () {
        _g.BackgroundMap = _g.Map.extend({
            tiles: null,
            scroll: {
                x: 0,
                y: 0
            },

            distance: 1,
            repeat: false,
            tilesetName: '',
            preRender: false,
            preRenderedChunks: null,
            chunkSize: 512,
            debugChunks: false,
            anims: {},


            init: function (tilesize, data, tileset) {
                this.parent(tilesize, data);
                this.setTileset(tileset);
            },

            setTileset: function (tileset) {
                this.tilesetName = tileset instanceof _g.Image ? tileset.path : tileset;
                this.tiles = new _g.Image(this.tilesetName);
                this.preRenderedChunks = null;
            },

            setScreenPos: function (x, y) {
                this.scroll.x = x / this.distance;
                this.scroll.y = y / this.distance;
            },

            preRenderMapToChunks: function () {
                var totalWidth = this.width * this.tilesize * _g.system.scale,
                    totalHeight = this.height * this.tilesize * _g.system.scale;
                var chunkCols = (totalWidth / this.chunkSize).ceil(),
                    chunkRows = (totalHeight / this.chunkSize).ceil();
                this.preRenderedChunks = [];
                for (var y = 0; y < chunkRows; y++) {
                    this.preRenderedChunks[y] = [];
                    for (var x = 0; x < chunkCols; x++) {
                        var chunkWidth = (x == chunkCols - 1) ? totalWidth - x * this.chunkSize : this.chunkSize;
                        var chunkHeight = (y == chunkRows - 1) ? totalHeight - y * this.chunkSize : this.chunkSize;
                        this.preRenderedChunks[y][x] = this.preRenderChunk(x, y, chunkWidth, chunkHeight);
                    }
                }
            },

            preRenderChunk: function (cx, cy, w, h) {
                var tw = w / this.tilesize / _g.system.scale + 1;
                th = h / this.tilesize / _g.system.scale + 1;
                var nx = (cx * this.chunkSize / _g.system.scale) % this.tilesize,
                    ny = (cy * this.chunkSize / _g.system.scale) % this.tilesize;
                var tx = (cx * this.chunkSize / this.tilesize / _g.system.scale).floor(),
                    ty = (cy * this.chunkSize / this.tilesize / _g.system.scale).floor();
                var chunk = _g.$new('canvas');
                chunk.width = w;
                chunk.height = h;
                var oldContext = _g.system.context;
                _g.system.context = chunk.getContext("2d");
                for (var x = 0; x < tw; x++) {
                    for (var y = 0; y < th; y++) {
                        if (x + tx < this.width && y + ty < this.height) {
                            var tile = this.data[y + ty][x + tx];
                            if (tile) {
                                this.tiles.drawTile(x * this.tilesize - nx, y * this.tilesize - ny, tile - 1, this.tilesize);
                            }
                        }
                    }
                }
                _g.system.context = oldContext;
                return chunk;
            },

            draw: function () {
                if (!this.tiles.loaded) {
                    return;
                }
                if (this.preRender) {
                    this.drawPreRendered();
                } else {
                    this.drawTiled();
                }
            },

            drawPreRendered: function () {
                if (!this.preRenderedChunks) {
                    this.preRenderMapToChunks();
                }
                var dx = _g.system.getDrawPos(this.scroll.x),
                    dy = _g.system.getDrawPos(this.scroll.y);
                if (this.repeat) {
                    dx %= this.width * this.tilesize * _g.system.scale;
                    dy %= this.height * this.tilesize * _g.system.scale;
                }
                var minChunkX = Math.max((dx / this.chunkSize).floor(), 0),
                    minChunkY = Math.max((dy / this.chunkSize).floor(), 0),
                    maxChunkX = ((dx + _g.system.realWidth) / this.chunkSize).ceil(),
                    maxChunkY = ((dy + _g.system.realHeight) / this.chunkSize).ceil(),
                    maxRealChunkX = this.preRenderedChunks[0].length,
                    maxRealChunkY = this.preRenderedChunks.length;
                if (!this.repeat) {
                    maxChunkX = Math.min(maxChunkX, maxRealChunkX);
                    maxChunkY = Math.min(maxChunkY, maxRealChunkY);
                }
                var nudgeY = 0;
                for (var cy = minChunkY; cy < maxChunkY; cy++) {
                    var nudgeX = 0;
                    for (var cx = minChunkX; cx < maxChunkX; cx++) {
                        var chunk = this.preRenderedChunks[cy % maxRealChunkY][cx % maxRealChunkX];
                        var x = -dx + cx * this.chunkSize - nudgeX;
                        var y = -dy + cy * this.chunkSize - nudgeY;
                        _g.system.context.drawImage(chunk, x, y);
                        if (this.debugChunks) {
                            _g.system.context.strokeStyle = '#f0f';
                            _g.system.context.strokeRect(x, y, this.chunkSize, this.chunkSize);
                        }
                        if (this.repeat && chunk.width < this.chunkSize && x + chunk.width < _g.system.realWidth) {
                            nudgeX = this.chunkSize - chunk.width;
                            maxChunkX++;
                        }
                    }
                    if (this.repeat && chunk.height < this.chunkSize && y + chunk.height < _g.system.realHeight) {
                        nudgeY = this.chunkSize - chunk.height;
                        maxChunkY++;
                    }
                }
            },

            drawTiled: function () {
                var tile = 0,
                    anim = null,
                    tileOffsetX = (this.scroll.x / this.tilesize).toInt(),
                    tileOffsetY = (this.scroll.y / this.tilesize).toInt(),
                    pxOffsetX = this.scroll.x % this.tilesize,
                    pxOffsetY = this.scroll.y % this.tilesize,
                    pxMinX = -pxOffsetX - this.tilesize,
                    pxMinY = -pxOffsetY - this.tilesize,
                    pxMaxX = _g.system.width + this.tilesize - pxOffsetX,
                    pxMaxY = _g.system.height + this.tilesize - pxOffsetY;
                for (var mapY = -1, pxY = pxMinY; pxY < pxMaxY; mapY++, pxY += this.tilesize) {
                    var tileY = mapY + tileOffsetY;
                    if (tileY >= this.height || tileY < 0) {
                        if (!this.repeat) {
                            continue;
                        }
                        tileY = tileY % this.height + (tileY < 0 ? this.height : 0);
                    }
                    for (var mapX = -1, pxX = pxMinX; pxX < pxMaxX; mapX++, pxX += this.tilesize) {
                        var tileX = mapX + tileOffsetX;
                        if (tileX >= this.width || tileX < 0) {
                            if (!this.repeat) {
                                continue;
                            }
                            tileX = tileX % this.width + (tileX < 0 ? this.width : 0);
                        }
                        if ((tile = this.data[tileY][tileX])) {
                            if ((anim = this.anims[tile - 1])) {
                                anim.draw(pxX, pxY);
                            } else {
                                this.tiles.drawTile(pxX, pxY, tile - 1, this.tilesize);
                            }
                        }
                    }
                }
            }
        });
    });
