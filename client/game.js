/*
-------------------------------------------------------------------------------
KOTKI NA PŁOTKI - MUZYCZNA GRA WEBOWA

Version: 0.1
Date:   14.09.2011
Author:  Pawel Cyrta

Changelog:
  14.09.2011
              Stworzenie struktury gry,

  15.09.2011

  16.09.2011

-------------------------------------------------------------------------------
*/

_g.module(
	'game.main'
)
.requires(
  'g.game',
  'g.debug' // <- Add/Remove this
)
.defines(function(){

  MyGame = _g.Game.extend({


    loaderBgrndImage: new _g.Image( './assets/images/g-loader-bgrnd.png' ),
    loaderSpriteImage: new _g.Image( './assets/images/g-loader-sprite.png' ),
    homePageBgrndImage: new _g.Image( './assets/images/g-homepage-bgrnd.png' ),
    homePageSpriteImage: new _g.Image( './assets/images/g-homepage-sprite.png' ),
    playgroundImage: new _g.Image( './assets/images/g-playground-bgrnd.png' ),
    playgroundImage: new _g.Image( './assets/images/g-playground-sprite.png' ),


    init: function() {
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
      //var x = ig.system.width/2, y = ig.system.height/2;
    }
 });


 // Start the Game with 60fps, a resolution of 320x240, scaled
 // up by a factor of 2
 //g.main( '#canvas', MyGame, 60, 512, 384, 2 );

});
