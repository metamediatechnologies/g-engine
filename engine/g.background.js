


  _g.module(
      'g.background'
    )
    .requires(
      'g.image'
    )
    .defines(function () {

      /** @constructor
       *  @extends {_g.Map}
       */
        _g.Background = _g.Class.extend({
            image: null,
            coordinates: {
                      targetX: 0, targetY: 0,
                      sourceX: 0, sourceY: 0
                    },
            preRender: false,
            preRenderedChunks: null,
            chunkSize: 512,

            debugChunks: false,



            /**
             *  @param {Number} targetX
             *  @param {Number} targetY
             *  @param {Number} sourceX
             *  @param {Number} sourceY
             *  @param {_g.Image} sourceData
             */
            init: function (targetX, targetY, sourceX, sourceY, sourceData) {
                this.coordinates.targetX = targetX;
                this.coordinates.targetY = targetY;
                this.coordinates.sourceX = sourceX;
                this.coordinates.sourceY = sourceY;
                this.image = sourceData;
            },

            draw: function () {
                //_g.log("Background.draw");
                if ( typeof this.image === "undefined") {
                    return;
                }
                if (this.image.loaded) {
                  this.image.draw( this.coordinates.targetX, this.coordinates.targetY,
                     this.coordinates.sourceX, this.coordinates.sourceY,
                     this.image.width, this.image.height
                    );
                }
            }
        });
    });
