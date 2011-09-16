

  _g.module(
      'g.main'
  )
  .requires(
      'dom.ready',
      'g.loader',
      'g.system'
     // 'g.input',
     // 'g.sound'
  )
  .defines(function(){

      // code for this module
    /**
     *  @param {String}  canvasID
     *  @param {_g.Game} gameClass
     *  @param {Number}  fps
     *  @param {Number}  width
     *  @param {Number}  height
     *  @param {Number}  scale
     *  @param {Object}  loader
     */
    _g.main = function (canvasId, gameClass,
                        fps, width, height, scale, loaderClass)
    {
      _g.log("main(): Enter");

        _g.system = new _g.System(canvasId, fps, width, height, scale || 1);

        _g.input = new _g.Input();
      /*  _g.soundManager = new ig.SoundManager();
        _g.music = new _g.Music();
      */
        _g.ready = true;

        var loader = new (loaderClass || _g.Loader) (gameClass || _g.Game, _g.resources);
        loader.load();

      _g.log("main(): Exit");
    };
  });
