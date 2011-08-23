
  _g.module(
      'g.image'
    )
    .defines(function () {

       /** @constructor
        *  @extends {_g.Class}
        */
        _g.Image = _g.Class.extend({

            /** @type {Image} */
            data: null,
            /** @type {Number} */
            width: 0,
            /** @type {Number} */
            height: 0,
            /** @type {Boolean} */
            loaded: false,
            /** @type {Boolean} */
            failed: false,
            /** @type {Function} */
            loadCallback: null,
            /** @type {String} */
            path: '',


            /** @param {String} */
            staticInstantiate: function (path) {
                return _g.Image.cache[path] || null;
            },

            /** @param {String} */
            init: function (path) {
                this.path = path;
                this.load();
            },
            /** @param {Function} */
            load: function (loadCallback) {
                if (this.loaded) {
                    if (loadCallback) {
                        loadCallback(this.path, true);
                    }
                    return;
                } else if (!this.loaded && _g.ready) {
                    this.loadCallback = loadCallback || null;
                    this.data = new Image();
                    this.data.onload = this.onload.bind(this);
                    this.data.onerror = this.onerror.bind(this);
                    this.data.src = this.path + _g.nocache;
                } else {
                    _g.addResource(this);
                }
                _g.Image.cache[this.path] = this;
            },

            reload: function () {
                this.loaded = false;
                this.data = new Image();
                this.data.onload = this.onload.bind(this);
                this.data.src = this.path + '?' + Math.random();
            },

            /** @param {Event} */
            onload: function (event) {
                this.width = this.data.width;
                this.height = this.data.height;
                if (_g.system.scale != 1) {
                    this.resize(_g.system.scale);
                }
                this.loaded = true;
                if (this.loadCallback) {
                    this.loadCallback(this.path, true);
                }
            },

            /** @param {Event} */
            onerror: function (event) {
                this.failed = true;
                if (this.loadCallback) {
                    this.loadCallback(this.path, false);
                }
            },
            /** @param {Number} */
            resize: function (scale) {
                var widthScaled = this.width * scale;
                var heightScaled = this.height * scale;
                var orig = _g.$new('canvas');
                orig.width = this.width;
                orig.height = this.height;
                var origCtx = orig.getContext('2d');
                origCtx.drawImage(this.data, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
                var origPixels = origCtx.getImageData(0, 0, this.width, this.height);
                var scaled = _g.$new('canvas');
                scaled.width = widthScaled;
                scaled.height = heightScaled;
                var scaledCtx = scaled.getContext('2d');
                var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);
                for (var y = 0; y < heightScaled; y++) {
                    for (var x = 0; x < widthScaled; x++) {
                        var index = ((y / scale).floor() * this.width + (x / scale).floor()) * 4;
                        var indexScaled = (y * widthScaled + x) * 4;
                        scaledPixels.data[indexScaled] = origPixels.data[index];
                        scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
                        scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
                        scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
                    }
                }
                scaledCtx.putImageData(scaledPixels, 0, 0);
                this.data = scaled;
            },

            /**
             *  @param {Number} targetX
             *  @param {Number} targetY
             *  @param {Number} sourceX
             *  @param {Number} sourceY
             *  @param {Number} width
             *  @param {Number} height
             */
            draw: function (targetX, targetY, sourceX, sourceY, width, height) {
                if (!this.loaded) {
                    return;
                }
                var scale = _g.system.scale;
                sourceX = sourceX ? sourceX * scale : 0;
                sourceY = sourceY ? sourceY * scale : 0;
                width = (width ? width : this.width) * scale;
                height = (height ? height : this.height) * scale;
                _g.system.context.drawImage(this.data, sourceX, sourceY, width, height, _g.system.getDrawPos(targetX), _g.system.getDrawPos(targetY), width, height);
            },
            /**
             *  @param {Number} targetX
             *  @param {Number} targetY
             *  @param {Number} tile
             *  @param {Number} tileWidth
             *  @param {Number} tileHeight
             *  @param {Number} flipX
             *  @param {Number} flipY
             */
            drawTile: function (targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY) {
                tileHeight = tileHeight ? tileHeight : tileWidth;
                if (!this.loaded || tileWidth > this.width || tileHeight > this.height) {
                    return;
                }
                var scale = _g.system.scale;
                var tileWidthScaled = tileWidth * scale;
                var tileHeightScaled = tileHeight * scale;
                var scaleX = flipX ? -1 : 1;
                var scaleY = flipY ? -1 : 1;
                if (flipX || flipY) {
                    _g.system.context.save();
                    _g.system.context.scale(scaleX, scaleY);
                }
                _g.system.context.drawImage(this.data, ((tile * tileWidth).floor() % this.width) * scale, ((tile * tileWidth / this.width).floor() * tileHeight) * scale, tileWidthScaled, tileHeightScaled, _g.system.getDrawPos(targetX) * scaleX - (flipX ? tileWidthScaled : 0), _g.system.getDrawPos(targetY) * scaleY - (flipY ? tileHeightScaled : 0), tileWidthScaled, tileHeightScaled);
                if (flipX || flipY) {
                    _g.system.context.restore();
                }
            }
        });

        _g.Image.cache = {};
        _g.Image.reloadCache = function () {
            for (path in _g.Image.cache) {
                _g.Image.cache[path].reload();
            }
        };
    });
