

  /**
   *
   * Global namespace object. Entry point to Game Engine
   */

  //var _g = _g || {};
  var _g = {
        /** @type {String} */
        version: '0.1',
        /** @type {Object} */
        global: window,
        /** @type {Object} */
        doc: window.document,


        /** @type {_g.Game} */
        game: null,
        /** @type {Object} */
        modules: {},
        /** @type {Array} */
        resources: [],
        /** @type {Boolean} */
        ready: false,
        /** @type {Boolean} */
        baked: false,

        /** @type {String} */
        nocache: '',
        /** @type {Object} */
        ua: {},

        /** @type {Object} */
        _current: null,
        /** @type {Array} */
        _loadQueue: [],
        /** @type {Number} */
        _waitForOnload: 0,

        /* to be able work without jQuery */
        $: function (selector) {
            return selector.charAt(0) == '#' ? _g.doc.getElementById(selector.substr(1)) : _g.doc.getElementsByTagName(selector)[0];
        },
        $new: function (name) {
            return _g.doc.createElement(name);
        },
        /* deep copy */
        copy: function (object) {
            if (!object || typeof (object) != 'object' || object instanceof _g.Class) {
                return object;
            } else if (object instanceof Array) {
                var c = [];
                for (var i = 0, l = object.length; i < l; i++) {
                    c[i] = _g.copy(object[i]);
                }
                return c;
            } else {
                var c = {};
                for (var i in object) {
                    c[i] = _g.copy(object[i]);
                }
                return c;
            }
        },


        module: function (name) {
            if (_g._current) {
                throw ("Module '" + _g._current.name + "' defines nothing");
            }
            _g._current = {
                name: name,
                requires: [],
                loaded: false,
                body: null
            };
            _g.modules[name] = _g._current;
            _g._loadQueue.push(_g._current);
            _g._initDOMReady();
            return _g;
        },

        requires: function () {
            _g._current.requires = Array.prototype.slice.call(arguments);
            return _g;
        },

        defines: function (body) {
            name = _g._current.name;
            _g._current.body = body;
            _g._current = null;
            _g._execModules();
        },



        addResource: function (resource) {
          _g.resources.push(resource);
        },

        setNocache: function (set) {
            _g.nocache = set ? '?' + Math.random().toString().substr(2) : '';
        },
        /** @param {String}
         *  @param
         */
        _loadScript: function (name, requiredFrom) {
            _g.modules[name] = {
                name: name,
                requires: [],
                loaded: false,
                body: null
            };

            _g._waitForOnload++;

            //var path = 'lib/' + name.replace(/\./g, '/') + '.js' + _g.nocache;
            var path = 'lib/' + name + '.js' + _g.nocache;
           //var path = '../engine/' + name + '.js' + _g.nocache;
            var script = _g.$new('script');
            script.type = 'text/javascript';
            script.src = path;
            script.onload = function () {
                _g._waitForOnload--;
                _g._execModules();
            };
            script.onerror = function () {
                throw ('Failed to load module ' + name + ' at ' + path + ' ' + 'required from ' + requiredFrom);
            };
            //_g.$('head')[0].appendChild(script);
            _g.$('head').appendChild(script);
        },

        _execModules: function () {
            var modulesLoaded = false;
            for (var i = 0; i < _g._loadQueue.length; i++) {
                var m = _g._loadQueue[i];
                var dependenciesLoaded = true;
                for (var j = 0; j < m.requires.length; j++) {
                    var name = m.requires[j];
                    if (!_g.modules[name]) {
                        dependenciesLoaded = false;
                        _g._loadScript(name, m.name);
                    } else if (!_g.modules[name].loaded) {
                        dependenciesLoaded = false;
                    }
                }
                if (dependenciesLoaded && m.body) {
                    _g._loadQueue.splice(i, 1);
                    m.loaded = true;
                    m.body();
                    modulesLoaded = true;
                    i--;
                }
            }
            if (modulesLoaded) {
                _g._execModules();
            } else if (!_g.baked && _g._waitForOnload == 0 && _g._loadQueue.length != 0) {
                var unresolved = [];
                for (var i = 0; i < _g._loadQueue.length; i++) {
                    unresolved.push(_g._loadQueue[i].name);
                }
                throw ('Unresolved (circular?) dependencies: ' + unresolved.join(', '));
            }
        },

        _DOMReady: function () {
            if (!_g.modules['dom.ready'].loaded) {
                if (!_g.doc.body) {
                    return setTimeout(_g._DOMReady, 13);
                }
                _g.modules['dom.ready'].loaded = true;
                _g._waitForOnload--;
                _g._execModules();
            }
            return 0;
        },

        _isCanvas: function() {
          var elem = _g.doc.createElement( 'canvas' );
          return !!(elem.getContext && elem.getContext('2d'));
        },

        _boot: function () {
            if (_g.doc.location.href.match(/\?nocache/)) {
                _g.setNocache(true);
            }
            _g.ua.iPhone = /iPhone/i.test(navigator.userAgent);
            _g.ua.iPhone4 = (_g.ua.iPhone && window.devicePixelRatio == 2);
            _g.ua.iPad = /iPad/i.test(navigator.userAgent);
            _g.ua.android = /android/i.test(navigator.userAgent);
            _g.ua.iOS = _g.ua.iPhone || _g.ua.iPad;
            _g.ua.mobile = _g.ua.iOS || _g.ua.android;

            _g.ua.desktop = ! _g.ua.mobile;
            _g.ua.webkit = /(webkit)[ \/]([\w.]+)/i.test(navigator.userAgent);
            _g.ua.opera =  /(opera)(?:.*version)?[ \/]([\w.]+)/i.test(navigator.userAgent);
            _g.ua.msie = /(msie) ([\w.]+)/i.test(navigator.userAgent);
            _g.ua.mozilla = /(mozilla)(?:.*? rv:([\w.]+))?/i.test(navigator.userAgent);
            _g.ua.chrome = /(chrome)[ \/]([\w.]+)/i.test(navigator.userAgent);
            //is HTML5 canvas available?
            //else prepare flashCanvas as
        },


        _initDOMReady: function () {
            if (_g.modules['dom.ready']) {
                return;
            }
            _g._boot();
            _g.modules['dom.ready'] = {
                requires: [],
                loaded: false,
                body: null
            };
            _g._waitForOnload++;
            if (_g.doc.readyState === 'complete') {
                _g._DOMReady();
            } else {
                _g.doc.addEventListener('DOMContentLoaded', _g._DOMReady, false);
                window.addEventListener('load', _g._DOMReady, false);
            }
        }
  };


  /** @param {String} */
  _g.log = function(txt) {
    if( typeof console !== "undefined") {
      console.log(txt);
    }
  };


  var initializing = false,
      fnTest = /xyz/.test(function () { xyz(); }) ? /\bparent\b/ : /.*/;

  /** @construcor */
  _g.Class = function () {};
  _g.Class.extend = function (prop) {
    var parent = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      if (typeof (prop[name]) == "function"
            && typeof (parent[name]) == "function"
            && fnTest.test(prop[name]))
      {
                prototype[name] = (function (name, fn) {
                    return function () {
                        var tmp = this.parent;
                        this.parent = parent[name];
                        var ret = fn.apply(this, arguments);
                        this.parent = tmp;
                        return ret;
                    };
                })(name, prop[name])
      } else {
                prototype[name] = prop[name];
      }
    }

    function Class() {
      if (!initializing) {
        if (this.staticInstantiate) {
          var obj = this.staticInstantiate.apply(this, arguments);
          if (obj) {
            return obj;
          }
        }
        for (p in this) {
          this[p] = _g.copy(this[p]);
        }
        if (this.init) {
          this.init.apply(this, arguments);
        }
      }
      return this;
    }

    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };



