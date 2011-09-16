/*
-------------------------------------------------------------------------------
  Web game
-------------------------------------------------------------------------------
*/


_g.ASSETSURL = "./assets";
_g.INTROTIMEOUT = 1000;

_g.module(
	'game.main'
)
.requires(
  'g.game',
  'g.debug' // <- Add/Remove this
)
.defines(function(){




  ObjectEntity = _g.Entity.extend({

    init: function() {
    }
  });


  EnemyEntity = _g.Entity.extend({
    init: function() {
    }
  });


  PlayerEntity = _g.Entity.extend({
    init: function() {
    }
  });

/*----------------------------------------------------------------------------*/

  //MyGameLoader

/*----------------------------------------------------------------------------*/

  MyGameMenu = _g.Game.extend({

      menuBackground: new _g.Image( _g.ASSETSURL +'/images/g-homepage-bgrnd.png' ),
      menuSprite: new _g.Image( _g.ASSETSURL +'/images/g-homepage-sprite.png' ),

      init: function() {
        //podlozyc tlo
        var bg = new _g.Background(0, 0, 0, 0, this.menuBackground );
        this.backgrounds.push( bg );
        //podlozyc animacje


         _g.input.bind(_g.KEY.MOUSE1, 'click');
      },

      update: function() {

        //sprawdzic czy myszka lapie przyciski
        //jesli tak to ustawic stan

        //jesli start gry to przelaczyc na obiekt jej
        if (_g.input.pressed('click')) {
            _g.input.unbind(_g.KEY.MOUSE1);
            _g.system.setGame(MyGameIntro);
        }
        this.parent();
      },

      draw: function() {
        this.parent();
        //jesli stan to wyrysowac
      }

  });

/*----------------------------------------------------------------------------*/

  MyGameIntro = _g.Game.extend({
      timeoutOn: false,

      loaderBgrndImage: new _g.Image( _g.ASSETSURL + '/images/g-loader-bgrnd.png' ),
      loaderSpriteImage: new _g.Image( _g.ASSETSURL + '/images/g-loader-sprite.png' ),

      init: function() {
        //podlozyc tlo
        var bg = new _g.Background(0, 0, 0, 0, this.loaderBgrndImage );
        this.backgrounds.push( bg );
        //podlozyc animacje
      },

      update: function() {
        if (this.timeoutOn === false) {
          setTimeout(function() {
              _g.system.setGame(MyGame);
          }, _g.INTROTIMEOUT);
          this.timeoutOn = true;
        }

        this.parent();
      },

      draw: function() {
        this.parent();
        //jesli stan to wyrysowac
      }

  });


/*----------------------------------------------------------------------------*/

  MyGame = _g.Game.extend({
     //clearColor: '#FFF',

    playgroundBgrndImage: new _g.Image( './assets/images/g-playground-bgrnd.png' ),
    playgroundSpriteImage: new _g.Image( './assets/images/g-playground-sprite.png' ),


    init: function() {

      //var bgmap = new _g.BackgroundMap( , [0,1,2,3,4,5,6], this.homePageBgrndImage );
      var bg = new _g.Background(0, 0, 0, 0, this.playgroundBgrndImage );
      this.backgrounds.push( bg );

      //this.backgroundMaps.push(this.homePageBgrndImage);
    },

    loadLevel: function() {
    },


    update: function() {
  		// Update all entities and backgroundMaps
  		this.parent();

  		// Add your own, additional update code here
  	},

  	draw: function() {
  		// Draw all entities and backgroundMaps
  		this.parent();

  		// Add your own drawing code here
      var x = _g.system.width/2, y = _g.system.height/2;

    }
 });

  _g.startGame = function(elem, fps, width, height) {

      _g.main(elem, MyGameMenu, fps, width, height, 1);
  }

});
