ig.module(
      'g.game'
  )
  .requires(
      'g.engine',
      /*'g.entity',*/
      /*'g.background-map'*/
  )
  .defines(function(){

      // code for this module
    _g.Game = ig.Class.extend({
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

  });




