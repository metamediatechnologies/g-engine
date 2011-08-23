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
      _g.Game = _g.Class.extend({
          clearColor: '#000000',
          gravity: 0,
          screen: {
              x: 0,
              y: 0
          },

          backgroundMaps: [],
          backgroundAnims: {},


      start: function() {
            this.running = true;
      },
      stop: function() {
          this.running = false;
      },
      pause: function() {
      },

      _tick: function () {
              this.update();
              this.draw();
      }



    });
  });




