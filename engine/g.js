

  /**
   *
   * Global namespace object. Entry point to Game Engine
   */

  var _g = _g || {};
  _g = {
        version: '0.1',
        global: window,
        doc = global.document;

        game: null,
        modules: {},
        resources: [],

        ready: false,
        baked: false,

        nocache: '',
        ua: {},

        _current: null,
        _loadQueue: [],
        _waitForOnload: 0,



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

        _loadScript: function (name, requiredFrom) {
            _g.modules[name] = {
                name: name,
                requires: [],
                loaded: false,
                body: null
            };

            _g._waitForOnload++;

            var path = 'lib/' + name.replace(/\./g, '/') + '.js' + _g.nocache;
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
            _g.$('head')[0].appendChild(script);
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
                if (!document.body) {
                    return setTimeout(_g._DOMReady, 13);
                }
                _g.modules['dom.ready'].loaded = true;
                _g._waitForOnload--;
                _g._execModules();
            }
            return 0;
        },

        _boot: function () {
            if (document.location.href.match(/\?nocache/)) {
                _g.setNocache(true);
            }
            _g.ua.iPhone = /iPhone/i.test(nav_gator.userAgent);
            _g.ua.iPhone4 = (_g.ua.iPhone && window.devicePixelRatio == 2);
            _g.ua.iPad = /iPad/i.test(nav_gator.userAgent);
            _g.ua.android = /android/i.test(nav_gator.userAgent);
            _g.ua.iOS = _g.ua.iPhone || _g.ua.iPad;
            _g.ua.mobile = _g.ua.iOS || _g.ua.android;
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
            if (document.readyState === 'complete') {
                _g._DOMReady();
            } else {
                document.addEventListener('DOMContentLoaded', _g._DOMReady, false);
                window.addEventListener('load', _g._DOMReady, false);
            }
        },
  };




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
          this[p] = ig.copy(this[p]);
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



