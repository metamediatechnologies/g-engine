

/*----------------------------------------------------------------------------*/
/*                       DEBUG MENU                                           */

// g.debug.menu

_g.module(
    'g.debug.menu'
)
.requires(
    'dom.ready',
    'g.system'
)
.defines(function () {


    _g.System.inject({
        run: function () {
            _g.debug.beforeRun();
            this.parent();
            _g.debug.afterRun();
        },
        setGameNow: function (gameClass) {
            this.parent(gameClass);
            _g.debug.ready();
        }
    });


    _g.Debug = _g.Class.extend({
        options: {},
        panels: {},
        numbers: {},
        container: null,
        panelMenu: null,
        activePanel: null,
        debugTime: 0,
        debugTickAvg: 0.016,
        debugRealTime: Date.now(),

        init: function () {
            var style = _g.$new('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = 'assets/g.debug.css';

            //is it on iframe ?
            //_g.$('body')[0].appendChild(style);
            _g.$('body').appendChild(style);

            this.container = _g.$new('div');
            this.container.className = 'g_debug';

            //is it on iframe ?
            //_g.$('body')[0].appendChild(this.container);
            _g.$('body').appendChild(this.container);

            this.panelMenu = _g.$new('div');
            this.panelMenu.innerHTML = '<div class="g_debug_head">Debug:</div>';
            this.panelMenu.className = 'g_debug_panel_menu';
            this.container.appendChild(this.panelMenu);
            this.numberContainer = _g.$new('div');
            this.numberContainer.className = 'g_debug_stats';
            this.panelMenu.appendChild(this.numberContainer);
            if (window.console && window.console.log) {
                _g.log = window.console.log.bind(window.console);
            }
            _g.show = this.showNumber.bind(this);
        },

        addNumber: function (name, width) {
            var number = _g.$new('span');
            this.numberContainer.appendChild(number);
            this.numberContainer.appendChild(document.createTextNode(name));
            this.numbers[name] = number;
        },

        showNumber: function (name, number, width) {
            if (!this.numbers[name]) {
                this.addNumber(name, width);
            }
            this.numbers[name].textContent = number;
        },
        addPanel: function (panelDef) {
            var panel = new(panelDef.type)(panelDef.name, panelDef.label);
            if (panelDef.options) {
                for (var i = 0; i < panelDef.options.length; i++) {
                    var opt = panelDef.options[i];
                    panel.addOption(new _g.DebugOption(opt.name, opt.object, opt.property));
                }
            }
            this.panels[panel.name] = panel;
            panel.container.style.display = 'none';
            this.container.appendChild(panel.container);
            var menuItem = _g.$new('div');
            menuItem.className = 'g_debug_menu_item';
            menuItem.textContent = panel.label;
            menuItem.addEventListener('click', (function (ev) {
                this.togglePanel(ev, panel);
            }).bind(this), false);
            panel.menuItem = menuItem;
            var inserted = false;
            for (var i = 1; i < this.panelMenu.childNodes.length; i++) {
                var cn = this.panelMenu.childNodes[i];
                if (cn.textContent > panel.label) {
                    this.panelMenu.insertBefore(menuItem, cn);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.panelMenu.appendChild(menuItem);
            }
        },
        togglePanel: function (ev, panel) {
            if (panel != this.activePanel && this.activePanel) {
                this.activePanel.toggle(false);
                this.activePanel.menuItem.className = 'g_debug_menu_item';
                this.activePanel = null;
            }
            var dsp = panel.container.style.display;
            var active = (dsp != 'block');
            panel.toggle(active);
            ev.target.className = 'g_debug_menu_item' + (active ? ' active' : '');
            if (active) {
                this.activePanel = panel;
            }
        },

        ready: function () {
            for (var p in this.panels) {
                this.panels[p].ready();
            }
        },

        beforeRun: function () {
            var timeBeforeRun = Date.now();
            this.debugTickAvg = this.debugTickAvg * 0.8 + (timeBeforeRun - this.debugRealTime) * 0.2;
            this.debugRealTime = timeBeforeRun;
            if (this.activePanel) {
                this.activePanel.beforeRun();
            }
        },

        afterRun: function () {
            var frameTime = Date.now() - this.debugRealTime;
            var nextFrameDue = (1000 / _g.system.fps) - frameTime;
            this.debugTime = this.debugTime * 0.8 + frameTime * 0.2;
            if (this.activePanel) {
                this.activePanel.afterRun();
            }
            this.showNumber('ms', this.debugTime.toFixed(2));
            this.showNumber('fps', Math.round(1000 / this.debugTickAvg));
            this.showNumber('draws', _g.Image.drawCount);
            if (_g.game && _g.game.entities) {
                this.showNumber('entities', _g.game.entities.length);
            }
            _g.Image.drawCount = 0;
        }
    });



    _g.DebugPanel = _g.Class.extend({
        active: false,
        container: null,
        options: [],
        panels: [],
        label: '',
        name: '',

        init: function (name, label) {
            this.name = name;
            this.label = label;
            this.container = _g.$new('div');
            this.container.className = 'g_debug_panel ' + this.name;
        },

        toggle: function (active) {
            this.active = active;
            this.container.style.display = active ? 'block' : 'none';
        },
        addPanel: function (panel) {
            this.panels.push(panel);
            this.container.appendChild(panel.container);
        },
        addOption: function (option) {
            this.options.push(option);
            this.container.appendChild(option.container);
        },
        ready: function () {},
        beforeRun: function () {},
        afterRun: function () {}
    });


    _g.DebugOption = _g.Class.extend({
        name: '',
        labelName: '',
        className: 'g_debug_option',
        label: null,
        mark: null,
        container: null,
        active: false,
        colors: {
            enabled: '#fff',
            disabled: '#444'
        },

        init: function (name, object, property) {
            this.name = name;
            this.object = object;
            this.property = property;
            this.active = this.object[this.property];
            this.container = _g.$new('div');
            this.container.className = 'g_debug_option';
            this.label = _g.$new('span');
            this.label.className = 'g_debug_label';
            this.label.textContent = this.name;
            this.mark = _g.$new('span');
            this.mark.className = 'g_debug_label_mark';
            this.container.appendChild(this.mark);
            this.container.appendChild(this.label);
            this.container.addEventListener('click', this.click.bind(this), false);
            this.setLabel();
        },
        setLabel: function () {
            this.mark.style.backgroundColor = this.active ? this.colors.enabled : this.colors.disabled;
        },
        click: function (ev) {
            this.active = !this.active;
            this.object[this.property] = this.active;
            this.setLabel();
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        }
    });
    _g.debug = new _g.Debug();
});


/*----------------------------------------------------------------------------*/
/*                       DEBUG ENTITIES PANEL                                 */

_g.module(
    'g.debug.entities-panel'
)
.requires(
    'g.debug.menu',
    'g.entity'
)
.defines(function () {

    _g.Entity.inject({
        colors: {
            names: '#fff',
            velocities: '#0f0',
            boxes: '#f00'
        },

        draw: function () {
            this.parent();
            if (_g.Entity._debugShowBoxes) {
                _g.system.context.strokeStyle = this.colors.boxes;
                _g.system.context.lineWidth = 1.0;
                _g.system.context.strokeRect(_g.system.getDrawPos(
                        this.pos.x.round() - _g.game.screen.x) - 0.5,
                        _g.system.getDrawPos(this.pos.y.round() - _g.game.screen.y) - 0.5,
                        this.size.x * _g.system.scale,
                        this.size.y * _g.system.scale);
            }
            if (_g.Entity._debugShowVelocities) {
                var x = this.pos.x + this.size.x / 2;
                var y = this.pos.y + this.size.y / 2;
                this._debugDrawLine(this.colors.velocities, x, y,
                                    x + this.vel.x, y + this.vel.y);
            }
            if (_g.Entity._debugShowNames) {
                if (this.name) {
                    _g.system.context.fillStyle = this.colors.names;
                    _g.system.context.fillText(this.name,
                            _g.system.getDrawPos(this.pos.x - _g.game.screen.x),
                            _g.system.getDrawPos(this.pos.y - _g.game.screen.y));
                }
                if (typeof (this.target) == 'object') {
                    for (var t in this.target) {
                        var ent = _g.game.getEntityByName(this.target[t]);
                        if (ent) {
                            this._debugDrawLine(this.colors.names,
                                                this.pos.x + this.size.x / 2,
                                                this.pos.y + this.size.y / 2,
                                                ent.pos.x + ent.size.x / 2,
                                                ent.pos.y + ent.size.y / 2);
                        }
                    }
                }
            }
        },
        _debugDrawLine: function (color, sx, sy, dx, dy) {
            _g.system.context.strokeStyle = color;
            _g.system.context.lineWidth = 1.0;
            _g.system.context.beginPath();
            _g.system.context.moveTo(_g.system.getDrawPos(sx - _g.game.screen.x),
                                     _g.system.getDrawPos(sy - _g.game.screen.y));
            _g.system.context.lineTo(_g.system.getDrawPos(dx - _g.game.screen.x),
                                     _g.system.getDrawPos(dy - _g.game.screen.y));
            _g.system.context.stroke();
            _g.system.context.closePath();
        }
    });
    _g.Entity._debugEnableChecks = true;
    _g.Entity._debugShowBoxes = false;
    _g.Entity._debugShowVelocities = false;
    _g.Entity._debugShowNames = false;
    _g.Entity.oldCheckPair = _g.Entity.checkPair;
    _g.Entity.checkPair = function (a, b) {
        if (!_g.Entity._debugEnableChecks) {
            return;
        }
        _g.Entity.oldCheckPair(a, b);
    };
    _g.debug.addPanel({
        type: _g.DebugPanel,
        name: 'entities',
        label: 'Entities',
        options: [{
            name: 'Checks & Collisions',
            object: _g.Entity,
            property: '_debugEnableChecks'
        }, {
            name: 'Show Collision Boxes',
            object: _g.Entity,
            property: '_debugShowBoxes'
        }, {
            name: 'Show Velocities',
            object: _g.Entity,
            property: '_debugShowVelocities'
        }, {
            name: 'Show Names & Targets',
            object: _g.Entity,
            property: '_debugShowNames'
        }]
    });
});


/*----------------------------------------------------------------------------*/
/*                           DEBUG MAPS PANEL                                 */

_g.module(
    'g.debug.maps-panel'
)
.requires(
    'g.debug.menu',
    'g.game',
    'g.background-map'
)
.defines(function () {

    _g.Game.inject({
        loadLevel: function (data) {
            this.parent(data);
            _g.debug.panels.maps.load(this);
        }
    });

    _g.DebugMapsPanel = _g.DebugPanel.extend({
        maps: [],
        mapScreens: [],

        init: function (name, label) {
            this.parent(name, label);
            this.load();
        },

        load: function (game) {
            this.options = [];
            this.panels = [];
            if (!game || !game.backgroundMaps.length) {
                this.container.innerHTML = '<em>No Maps Loaded</em>';
                return;
            }
            this.maps = game.backgroundMaps;
            this.mapScreens = [];
            this.container.innerHTML = '';
            for (var m = 0; m < this.maps.length; m++) {
                var map = this.maps[m];
                var subPanel = new _g.DebugPanel(m, 'Layer ' + m);
                var head = new _g.$new('strong');
                head.textContent = m + ': ' + map.tiles.path;
                subPanel.container.appendChild(head);
                subPanel.addOption(new _g.DebugOption('Enabled', map, 'enabled'));
                subPanel.addOption(new _g.DebugOption('Pre Rendered', map, 'preRender'));
                subPanel.addOption(new _g.DebugOption('Show Chunks', map, 'debugChunks'));
                this.generateMiniMap(subPanel, map, m);
                this.addPanel(subPanel);
            }
        },
        generateMiniMap: function (panel, map, id) {
            var s = _g.system.scale;
            var ts = _g.$new('canvas');
            var tsctx = ts.getContext('2d');
            var w = map.tiles.width * s;
            var h = map.tiles.height * s;
            var ws = w / map.tilesize;
            var hs = h / map.tilesize;
            tsctx.drawImage(map.tiles.data, 0, 0, w, h, 0, 0, ws, hs);
            var mapCanvas = _g.$new('canvas');
            mapCanvas.width = map.width * s;
            mapCanvas.height = map.height * s;
            var ctx = mapCanvas.getContext('2d');
            if (_g.game.clearColor) {
                ctx.fillStyle = _g.game.clearColor;
                ctx.fillRect(0, 0, w, h);
            }
            var tile = 0;
            for (var x = 0; x < map.width; x++) {
                for (var y = 0; y < map.height; y++) {
                    if ((tile = map.data[y][x])) {
                        ctx.drawImage(ts, Math.floor(((tile - 1) * s) % ws),
                                          Math.floor((tile - 1) * s / ws) * s,
                                          s, s, x * s, y * s, s, s);
                    }
                }
            }
            var mapContainer = _g.$new('div');
            mapContainer.className = 'g_debug_map_container';
            mapContainer.style.width = map.width * s + 'px';
            mapContainer.style.height = map.height * s + 'px';
            var mapScreen = _g.$new('div');
            mapScreen.className = 'g_debug_map_screen';
            mapScreen.style.width = ((_g.system.width / map.tilesize) * s - 2) + 'px';
            mapScreen.style.height = ((_g.system.height / map.tilesize) * s - 2) + 'px';
            this.mapScreens[id] = mapScreen;
            mapContainer.appendChild(mapCanvas);
            mapContainer.appendChild(mapScreen);
            panel.container.appendChild(mapContainer);
        },
        afterRun: function () {
            var s = _g.system.scale;
            for (var m = 0; m < this.maps.length; m++) {
                var map = this.maps[m];
                var screen = this.mapScreens[m];
                if (!map || !screen) {
                    continue;
                }
                var x = map.scroll.x / map.tilesize;
                var y = map.scroll.y / map.tilesize;
                if (map.repeat) {
                    x %= map.width;
                    y %= map.height;
                }
                screen.style.left = (x * s) + 'px';
                screen.style.top = (y * s) + 'px';
            }
        }
    });
    _g.debug.addPanel({
        type: _g.DebugMapsPanel,
        name: 'maps',
        label: 'Background Maps'
    });
});

/*----------------------------------------------------------------------------*/
/*                           DEBUG GRAPH PANEL                                */

_g.module(
    'g.debug.graph-panel'
)
.requires(
    'g.debug.menu',
    'g.system',
    'g.game',
    'g.image'
)
.defines(function () {

    _g.Game.inject({
        draw: function () {
            _g.graph.beginClock('draw');
            this.parent();
            _g.graph.endClock('draw');
        },
        update: function () {
            _g.graph.beginClock('update');
            this.parent();
            _g.graph.endClock('update');
        },
        checkEntities: function () {
            _g.graph.beginClock('checks');
            this.parent();
            _g.graph.endClock('checks');
        }
    });

    _g.DebugGraphPanel = _g.DebugPanel.extend({
        clocks: {},
        marks: [],
        textY: 0,
        height: 128,
        ms: 64,
        timeBeforeRun: 0,

        init: function (name, label) {
            this.parent(name, label);
            this.mark16ms = (this.height - (this.height / this.ms) * 16).round();
            this.mark33ms = (this.height - (this.height / this.ms) * 33).round();
            this.msHeight = this.height / this.ms;
            this.graph = _g.$new('canvas');
            this.graph.width = window.innerWidth;
            this.graph.height = this.height;
            this.container.appendChild(this.graph);
            this.ctx = this.graph.getContext('2d');
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(0, this.mark16ms, this.graph.width, 1);
            this.ctx.fillRect(0, this.mark33ms, this.graph.width, 1);
            this.addGraphMark('16ms', this.mark16ms);
            this.addGraphMark('33ms', this.mark33ms);
            this.addClock('draw', 'Draw', '#13baff');
            this.addClock('update', 'Entity Update', '#bb0fff');
            this.addClock('checks', 'Entity Checks & Collisions', '#a2e908');
            this.addClock('lag', 'System Lag', '#f26900');
            _g.mark = this.mark.bind(this);
            _g.graph = this;
        },

        addGraphMark: function (name, height) {
            var span = _g.$new('span');
            span.className = 'g_debug_graph_mark';
            span.textContent = name;
            span.style.top = height.round() + 'px';
            this.container.appendChild(span);
        },
        addClock: function (name, description, color) {
            var mark = _g.$new('span');
            mark.className = 'g_debug_legend_color';
            mark.style.backgroundColor = color;
            var number = _g.$new('span');
            number.className = 'g_debug_legend_number';
            number.appendChild(document.createTextNode('0'));
            var legend = _g.$new('span');
            legend.className = 'g_debug_legend';
            legend.appendChild(mark);
            legend.appendChild(document.createTextNode(description + ' ('));
            legend.appendChild(number);
            legend.appendChild(document.createTextNode('ms)'));
            this.container.appendChild(legend);
            this.clocks[name] = {
                description: description,
                color: color,
                current: 0,
                start: Date.now(),
                avg: 0,
                html: number
            };
        },
        beginClock: function (name, offset) {
            this.clocks[name].start = Date.now() + (offset || 0);
        },
        endClock: function (name) {
            var c = this.clocks[name];
            c.current = Math.round(Date.now() - c.start);
            c.avg = c.avg * 0.8 + c.current * 0.2;
        },
        mark: function (msg, color) {
            if (this.active) {
                this.marks.push({
                    msg: msg,
                    color: (color || '#fff')
                });
            }
        },
        beforeRun: function () {
            this.endClock('lag');
            this.timeBeforeRun = Date.now();
        },
        afterRun: function () {
            var frameTime = Date.now() - this.timeBeforeRun;
            var nextFrameDue = (1000 / _g.system.fps) - frameTime;
            this.beginClock('lag', Math.max(nextFrameDue, 0));
            var x = this.graph.width - 1;
            var y = this.height;
            this.ctx.drawImage(this.graph, -1, 0);
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(x, 0, 1, this.height);
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(x, this.mark16ms, 1, 1);
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(x, this.mark33ms, 1, 1);
            for (var ci in this.clocks) {
                var c = this.clocks[ci];
                c.html.textContent = c.avg.toFixed(2);
                if (c.color && c.current > 0) {
                    this.ctx.fillStyle = c.color;
                    var h = c.current * this.msHeight;
                    y -= h;
                    this.ctx.fillRect(x, y, 1, h);
                    c.current = 0;
                }
            }
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            this.ctx.globalAlpha = 0.5;
            for (var i = 0; i < this.marks.length; i++) {
                var m = this.marks[i];
                this.ctx.fillStyle = m.color;
                this.ctx.fillRect(x, 0, 1, this.height);
                if (m.msg) {
                    this.ctx.fillText(m.msg, x - 1, this.textY);
                    this.textY = (this.textY + 8) % 32;
                }
            }
            this.ctx.globalAlpha = 1;
            this.marks = [];
        }
    });
    _g.debug.addPanel({
        type: _g.DebugGraphPanel,
        name: 'graph',
        label: 'Performance'
    });
});


/*----------------------------------------------------------------------------*/
/*                            DEBUG COLLISION                                 */
/*
_g.module(
    'g.my-collision-debug-panel'
)
.requires(
    'g.debug.menu',
    'g.collision-map'
)
.defines(function(){

  // Overwrite the CollisionMap's trace method, to check for a custom flag
  _g.CollisionMap.inject({
    trace: function( x, y, vx, vy, objectWidth, objectHeight ) {
        if( _g.CollisionMap._enabled ) {
            // Just call the original trace method
            return this.parent( x, y, vx, vy, objectWidth, objectHeight );
        }
        else {
            // Return a dummy trace result, indicating that the object
            // did not collide
            return {
                collision: {x: false, y: false},
                pos: {x: x+vx, y: y+vy},
                tile: {x: 0, y: 0}
            };
        }
    }
});

// This is a 'static' property of ig.CollisionMap. It's not per instance.
_g.CollisionMap._enabled = true;


// Add a panel to the debug menu that allows us to toggle the _enabled flag
// for ig.CollisionMap
_g.debug.addPanel({
    type: _g.DebugPanel,
    name: 'collisionMap',
    label: 'Collision Map',

    // Toggle switches for this panel
    options: [
        {
            name: 'Enable Collisions',

            // When the toggle switch is clicked, it will flip the property
            // value for the given object.
            // In this case 'ig.CollisionMap._enabled'
            object: _g.CollisionMap,
            property: '_enabled'
        }
    ]
});

});

*/

/*----------------------------------------------------------------------------*/
/*                            DEBUG  Animation                                */


_g.module(
    'g.animation-debug-panel'
)
.requires(
    'g.debug.menu',
    'g.entity',
    //'g.sound',
    'g.game'
)
.defines(function(){

  // Overwrite the Game's loadLevel() method to call a custom method
  // on our panel, after the level is loaded
  _g.Game.inject({
      loadLevel: function( data ) {
          this.parent(data);

          // 'soundpanel' is the name we give this panel in the
          // call to ig.debug.addPanel()
          _g.debug.panels.animationpanel.load(this);
      }
  });

  // Overwrite the Entity's update() method, so we can disable updating
  // for a particular entity at a time
  _g.Entity.inject({
      _shouldUpdate: true,
      update: function() {
          if( this._shouldUpdate ) {
              this.parent();
          }
      }
  });

  AnimationDebugPanel = _g.DebugPanel.extend({

      init: function( name, label ) {
          // This creates the DIV container for this panel
          this.parent( name, label );

          // You may want to load and use jQuery here, instead of
          // dealing with the DOM directly...
          this.container.innerHTML =
              '<em>Entities not loaded yet.</em>';
      },

      load: function( game ) {
          // This function is called through the loadLevel() method
          // we injected into _g.Game

          // Clear this panel
          this.container.innerHTML = '';

          // Find all named entities and add an option to disable
          // the movement and animation update for it
          for( var i = 0; i < game.entities.length; i++ ) {
              var ent = game.entities[i];
              if( ent.name ) {
                  var opt = new ig.DebugOption( 'Entity ' + ent.name, ent, '_shouldUpdate' );
                  this.addOption( opt );
              }
          }

      },

      ready: function() {
          // This function is automatically called when a new Game is created.
          // _g.game is valid here!
      },

      beforeRun: function() {
          // This function is automatically called BEFORE each frame
          // is processed.
      },

      afterRun: function() {
          // This function is automatically called AFTER each frame
          // is processed.
      }
  });

  _g.debug.addPanel({
      type: AnimationDebugPanel,
      name: 'Animationpanel',
      label: 'Animation'
  });

  });

/*----------------------------------------------------------------------------*/
/*                            DEBUG SOUND                                     */

/// to come ...


/*----------------------------------------------------------------------------*/
/*                            DEBUG                                           */

_g.module(
    'g.debug'
)
.requires(
    'g.debug.entities-panel',
    'g.debug.maps-panel',
    'g.debug.graph-panel'
)
.defines(function () {
  // join all parts of debug console/panel
});
