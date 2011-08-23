  _g.module(
        'g.game'
    )
    .requires(
        'g.main'
        /*'g.entity',*/
        /*'g.background-map'*/
    )
    .defines(function(){

        // code for this module

      /** @constructor
       *  @extends {_g.Class}
       */
      _g.Game = _g.Class.extend({
          clearColor: '#000000',
          gravity: 0,
          screen: {
              x: 0,
              y: 0
          },

          backgroundMaps: [],
          backgroundAnims: {},


          run: function () {
              this.update();
              this.draw();
          },
          /** Prepare entities for next draw iteration
           * (e.g. recalculate position)
           */
          update: function() {
            //_g.log("Game:update()");
          },
          /** Here we do essential graphical procedures */
          draw: function() {
            //_g.log("Game:draw()");
          }
      });
  });




