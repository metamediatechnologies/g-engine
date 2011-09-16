// ./game/splashes.js
ig.baked = true;
ig.module('game.splashes').requires('impact.entity', 'impact.image', 'impact.font').defines(function () {
    LevelUpEntity = ig.Entity.extend({
        gravityFactor: 0,
        maxVel: {
            x: 0,
            y: 400
        },
        image: new ig.Image(MEDIAURL + 'splash_level.png'),
        timer: null,
        alpha: 1,
        alphaStep: 0.97,
        callback: null,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.pos.x = ig.system.width / 2 - 211;
            this.pos.y = ig.system.height / 2 - 76;
            this.timer = new ig.Timer(3);
            this.accel.y = -100;
        },
        update: function () {
            this.parent();
            if (this.timer.delta() > 0) {
                this.kill();
                this.callback();
            } else {
                this.alpha = this.alpha * this.alphaStep;
            }
        },
        draw: function () {
            a = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.alpha;
            this.image.draw(this.pos.x, this.pos.y);
            ig.system.context.globalAlpha = a;
        }
    });
    FloatingText = ig.Entity.extend({
        maxVel: {
            x: 0,
            y: 400
        },
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        gravityFactor: 0,
        text: null,
        timeout: 4,
        timeoutTimer: null,
        alpha: 1,
        alphaStep: 0.975,
        align: ig.Font.ALIGN.CENTER,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.timeoutTimer = new ig.Timer(this.timeout);
            this.accel.y = -100;
        },
        update: function () {
            this.parent();
            if (this.timeoutTimer.delta() > 0) {
                this.kill();
            } else {
                this.alpha = this.alpha * this.alphaStep;
            }
        },
        draw: function () {
            a = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.alpha;
            this.font.draw(this.text, this.pos.x, this.pos.y, this.align);
            ig.system.context.globalAlpha = a;
        }
    });
});

// ./game/explosion.js
ig.baked = true;
ig.module('game.explosion').requires('impact.entity', 'impact.animation').defines(function () {
    ExplosionEntity = ig.Entity.extend({
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'explosion.png', 93.76, 101),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.pos.x = x - 47;
            this.pos.y = y - 50;
            this.addAnim('dflt', 0.02, createSequence(0, 37));
            playSound('snd_explosion');
        },
        update: function () {
            this.parent();
            if (this.currentAnim.loopCount) {
                this.kill();
            }
        }
    });
    BigExplosionEntity = ig.Entity.extend({
        size: {
            x: 250,
            y: 250
        },
        offset: {
            x: 25,
            y: 25
        },
        checkAgainst: ig.Entity.TYPE.B,
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'explosion_big.png', 300, 300),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.pos.x = x - 150;
            this.pos.y = y - 150;
            this.addAnim('dflt', 0.04, createSequence(0, 15));
            playSound('snd_big_explosion');
        },
        update: function () {
            this.parent();
            if (this.currentAnim.loopCount) {
                this.kill();
            }
        },
        check: function (other) {
            other.receiveDamage(100, this);
        }
    });
    PuffEntity = ig.Entity.extend({
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'puff.png', 32, 32),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.pos.x = x - 16;
            this.pos.y = y - 16;
            this.addAnim('dflt', 0.1, [0, 1, 2, 3]);
        },
        update: function () {
            this.parent();
            if (this.currentAnim.loopCount) {
                this.kill();
            }
        }
    });
});

// ./game/intro_splash.js
ig.baked = true;
ig.module('game.intro_splash').requires('impact.game', 'impact.entity', 'impact.font', 'impact.image').defines(function () {
    SplashEntity = ig.Entity.extend({
        image: null,
        alpha: 0,
        alphaDelta: 0.01,
        next: null,
        imageSize: {
            x: 0,
            y: 0
        },
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        update: function () {
            this.alpha = this.alpha + this.alphaDelta;
            if (this.alpha > 0.999) {
                this.alphaDelta = -0.02;
            } else if (this.alphaDelta < 0 && this.alpha < 0.1) {
                this.kill();
            }
        },
        draw: function () {
            a = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.alpha;
            this.image.draw(ig.system.width / 2 - this.imageSize.x / 2, ig.system.height / 2 - this.imageSize.y / 2);
            ig.system.context.globalAlpha = a;
        },
        kill: function () {
            this.parent();
            ig.game.nextSplash(this.next);
        }
    });
    ISplashHM = SplashEntity.extend({
        image: new ig.Image(MEDIAURL + 'haronmedia.jpg'),
        next: "ISplashJS",
        imageSize: {
            x: 309,
            y: 200
        },
        draw: function () {
            a = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.alpha;
            this.image.draw(ig.system.width / 2 - this.imageSize.x / 2, ig.system.height / 2 - this.imageSize.y / 2);
            this.font.draw("PRESENTS...", ig.system.width / 2, ig.system.height / 2 + 100, ig.Font.ALIGN.CENTER);
            ig.system.context.globalAlpha = a;
        }
    });
    ISplashJS = SplashEntity.extend({
        image: new ig.Image(MEDIAURL + 'joyandstick.jpg'),
        next: "ISplashTitle",
        imageSize: {
            x: 195,
            y: 240
        },
        draw: function () {
            a = ig.system.context.globalAlpha;
            ig.system.context.globalAlpha = this.alpha;
            this.image.draw(ig.system.width / 2 - this.imageSize.x / 2, ig.system.height / 2 - this.imageSize.y / 2);
            this.font.draw("IN COOPERATION WITH", ig.system.width / 2, ig.system.height / 2 - 150, ig.Font.ALIGN.CENTER);
            ig.system.context.globalAlpha = a;
        }
    });
    ISplashTitle = SplashEntity.extend({
        image: new ig.Image(MEDIAURL + 'title.jpg'),
        next: null,
        imageSize: {
            x: 760,
            y: 506
        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            musicManager.play('music-menu');
        }
    });
    LoaderSplashGame = ig.Game.extend({
        clearColor: '#000',
        gravity: 0,
        entity: null,
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        init: function () {
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            playSound('snd_intro');
        },
        update: function () {
            if (!this.entity) {
                this.nextSplash("ISplashHM");
            }
            if (ig.input.pressed('click')) {
                musicManager.play('music-menu');
                screenMenu();
            }
            this.parent();
        },
        nextSplash: function (splash) {
            if (splash) {
                this.entity = this.spawnEntity(splash, 0, 0);
            } else {
                screenMenu();
            }
        },
        draw: function () {
            this.parent();
            this.font.draw("CLICK HERE TO SKIP", ig.system.width / 2, 480, ig.Font.ALIGN.CENTER);
        }
    });
    ig.Loader = ig.Loader.extend({
        draw: function () {
            this._drawStatus += (this.status - this._drawStatus) / 5;
            x = ig.system.width / 2 - 160;
            y = ig.system.height / 2 - 160;
            w = this._drawStatus * 320;
            ig.system.context.drawImage(loader_image, 0, 0, 320, 180, x, y, 320, 180);
            ig.system.context.fillStyle = '#fff';
            ig.system.context.strokeStyle = '#fff';
            y += 161.5;
            ig.system.context.strokeRect(x, y + 32, 320, 8);
            ig.system.context.fillRect(x + 2, y + 34, w, 4);
        }
    });
    loader_image = new Image();
    loader_image.src = MEDIAURL + 'loader.jpg';
});

// ./game/newgame_splash.js
ig.baked = true;
ig.module('game.newgame_splash').requires('impact.game', 'impact.entity', 'impact.font', 'impact.image').defines(function () {
    TypewriterText = ig.Entity.extend({
        gravityFactor: 0,
        text: [],
        deltaY: 30,
        speed: 0.05,
        tpos: {
            line: 0,
            chr: 0
        },
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        timer: null,
        sndTimer: 0,
        idle: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.timer = new ig.Timer(this.speed);
        },
        update: function () {
            if (!this.idle) {
                this.parent();
                if (this.timer.delta() > 0) {
                    this.timer.reset();
                    this.tpos.chr++;
                    if (this.tpos.chr > this.text[this.tpos.line].length) {
                        this.tpos.chr = 0;
                        this.tpos.line++;
                    }
                }
                if (this.tpos.line > this.text.length - 1) {
                    if (blast.debug) console.log("TypewriterText in idle.");
                    this.idle = true;
                }
            }
        },
        draw: function () {
            y = 0;
            for (var line = 0; line < this.text.length; line++) {
                t = this.text[line];
                if (line == this.tpos.line) {
                    t = this.text[line].substr(0, this.tpos.chr);
                } else if (line > this.tpos.line) {
                    break;
                }
                this.font.draw(t, this.pos.x, this.pos.y + (line * this.deltaY), ig.Font.ALIGN.LEFT);
            }
        }
    });
    IntroText = TypewriterText.extend({
        image: new ig.Image(MEDIAURL + 'intro.jpg'),
        text: ["ONE DAY, IN THE BASEMENT LABORATORY", "OF DR. BLAST A TERRIBLE ACCIDENT HAPPENED!", "", "AN EXPERIMENT GONE WRONG RELEASED HUNDREDS", "OF EVIL GEOMETRIX!", "", "HELP DR. BLAST CLEAN UP THE MESS AND DESTROY", "THE EVIL GEOMETRIX ONCE AND FOR ALL!", "", "PRESS SPACE TO START THE GAME..."],
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.pos.x = 80;
            this.pos.y = 90;
        },
        draw: function () {
            this.image.draw(0, 0);
            this.parent();
        }
    });
    IntroSplashGame = ig.Game.extend({
        clearColor: '#000',
        gravity: 0,
        it: null,
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        init: function () {
            ig.input.bind(ig.KEY.SPACE, 'space');
            it = this.spawnEntity(IntroText, 0, 0);
        },
        update: function () {
            this.parent();
            if (ig.input.pressed('space') || ig.input.pressed('click')) {
                ig.game.startGame();
            }
        },
        draw: function () {
            this.parent();
            this.font.draw("CLICK HERE OR PRESS SPACE TO SKIP", ig.system.width / 2, 490, ig.Font.ALIGN.CENTER);
        },
        startGame: function () {
            ig.system.setGame(BlastGame);
        }
    });
});

// ./game/stage_splashes.js
ig.baked = true;
ig.module('game.stage_splashes').defines(function () {
    STAGE_SPLASHES = {
        "stage-2": ["BLAST!", "", "THIS WAS TOO EASY. THERE WERE ONLY A FEW GEOMETRIX AROUND", "BUT YOU KNOW THERE HAS TO BE MORE.", "", "OF COURSE. A CURSORY GLANCE TOWARD THE HALLWAY", "REVEALS THE TRUTH! THEY HAVE SPREAD TO THE REST", "OF THE HOUSE!", "", "CLICK HERE TO CONTINUE TO THE HALLWAY..."],
        "stage-3": ["PHEW!", "", "NOT AS EASY AS THE BASEMENT, RIGHT? BUT THE BATTLE IS FAR", "FROM OVER! THE MORE YOU KILL THEM THE MORE THEY SPAWN AND", "LIKE PLAGUE THREATEN TO OVERCOME BOTH DR. BLAST AND HIS HOUSE.", "", "THE NOISE FROM THE KITCHEN SUGGESTS THEY'RE", "REGROUPING THERE. QUICKLY, GET READY AND", "PROTECT THE FOOD!", "", "CLICK HERE TO CONTINUE TO THE KITCHEN..."],
        "stage-4": ["AS TIME PASSES BOTH YOU AND DR. BLAST ARE GETTING TIRED.", "", "THE BATTLE IS NOT YET OVER, BUT YOU'RE GETTING THERE.", "WITH THREE ROOMS ALREADY CLEANED OUT, ONLY A FEW MORE REMAIN", "BEFORE YOU CAN CLAIM VICTORY AND SAVE THE HOUSE!", "", "SLOWLY YOU BEGIN TO THINK THAT THERE IS MORE AT", "STAKE THAN JUST THE GOOD DOCTOR'S HOUSE. THE", "GEOMETRIX ARE SPREADING LIKE VERMIN AND MAY EVEN", "POSE A THREAT TO THE WORLD ITSELF! SURELY SAVING", "THE WORLD IS TOO MUCH TO THINK ABOUT RIGHT NOW?", "", "LET'S CLEAN OUT THE HOUSE FIRST.", "CLICK HERE TO CONTINUE..."],
        "stage-5": ["THAT'S IT, THAT'S THE SPIRIT!", "", "FOUR DOWN AND ONE MORE TO GO, RIGHT? THE GEOMETRIX ARE NOT", "SHOWING ANY SIGNS OF RETREAT, THERE IS MORE OF THEM EVERY", "SECOND, BUT THEY HAVE NOWHERE ELSE TO ESCAPE. YOU HAVE PINNED", "THEM DOWN IN THE ATTIC.", "", "EQUIPPED WITH POWERFUL GAUSS BALL, FIREBALL AND", "SPIKED SHIELDS YOU TAKE A DEEP BREATH AND CLIMB", "THE STAIRS...", "", "CLICK HERE TO CONTINUE TO THE ATTIC..."],
        "stage-6": ["ALAS! YOU HAVE SUCCEEDED!", "", "YOUR PERSISTENCE AND AIMING SKILLS HELPED DR. BLAST", "CLEAN UP THE MESS AND DESTROY ALL THE ROGUE GEOMETRIX!", "GAME OVER, ISN'T IT? OR SO IT APPEARS...", "", "WHILE THE GOOD DOCTOR'S HOUSE IS NOW SAFE, THE", "DANGER STILL REMAINS. A FEW OF THE GEOMETRIX", "MANAGED TO OPEN AN INTERDIMENSIONAL PORTAL AND", "ESCAPE, SPAWNING THEMSELVES INTO A FORMIDABLE", "ARMY THAT ONLY DR. BLAST, WITH YOUR HELP, CAN", "ATTEMPT TO VANQUISH!", "", "PREPARE YOURSELF FOR THE ENDLESS BATTLE.", "CLICK HERE TO BEGIN..."]
    };
});

// ./game/weapons.js
ig.baked = true;
ig.module('game.weapons').requires('impact.entity', 'impact.image', 'impact.animation').defines(function () {
    WeaponEntity = ig.Entity.extend({
        className: 'WeaponEntity',
        size: {
            x: 24,
            y: 24
        },
        vel: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 800,
            y: 800
        },
        gravityFactor: 0,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.NONE,
        zIndex: 900,
        weaponVelocity: -400,
        recharge: 0,
        fired: false,
        fire: function () {
            this.pos.y = this.pos.y - 80;
            this.vel.y = this.weaponVelocity;
            this.fired = true;
        },
        canFire: function () {
            return !this.fired;
        }
    });
    StoneWeapon = WeaponEntity.extend({
        className: 'StoneWeapon',
        icon: new ig.Image(MEDIAURL + 'icon_stone.png'),
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        bounciness: 1.0,
        image: new ig.Image(MEDIAURL + 'weapon_stone.png'),
        fire: function () {
            this.parent();
            playSound('snd_fireball');
        },
        update: function () {
            if (this.pos.y < 1) {
                this.kill();
            } else if (!this.standing && this.pos.y > blast.groundY - 24) {
                this.gravityFactor = 4;
                this.bounciness = 0.5;
                this.pos.y = blast.groundY - 24;
                this.vel.y = -this.vel.y * this.bounciness;
                if (this.vel.y < -10) {
                    playSound('snd_thud');
                } else if (this.vel.y > -10) {
                    this.standing = 0;
                    this.vel.y = 0;
                }
            } else if (this.standing) {
                this.gravityFactor = 0;
                this.bounciness = 0;
            }
            this.parent();
        },
        draw: function () {
            this.image.draw(this.pos.x, this.pos.y);
        },
        check: function (other) {
            if (this.fired) {
                if (other instanceof StoneEntity) {
                    ig.game.spawnEntity(PuffEntity, this.pos.x, this.pos.y);
                    other.receiveDamage(100, this);
                } else if (other instanceof PlayerEntity) {
                    this.fired = false;
                }
                ig.game.player.restoreWeapon(this.className);
            }
        },
        collideWith: function (other, axis) {
            if (axis == 'y') {
                playSound('snd_thud');
            }
        }
    });
    FireballWeapon = WeaponEntity.extend({
        className: 'FireballWeapon',
        icon: new ig.Image(MEDIAURL + 'icon_fireball.png'),
        recharge: 33.3,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'weapon_fireball.png', 31, 46),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.addAnim('dflt', 0.1, [1, 2]);
        },
        fire: function () {
            this.parent();
            this.currentAnim = this.anims.dflt.rewind();
            playSound('snd_fireball');
        },
        update: function () {
            if (this.pos.y < 1) {
                ig.game.player.restoreWeapon(this.className);
            }
            this.parent();
        },
        check: function (other) {
            if (this.fired && other instanceof StoneEntity) {
                ig.game.spawnEntity(BigExplosionEntity, this.pos.x + 32, this.pos.y);
                ig.game.player.restoreWeapon(this.className);
            }
        }
    });
    GaussWeapon = WeaponEntity.extend({
        className: 'GaussWeapon',
        collides: ig.Entity.COLLIDES.PASSIVE,
        bounciness: 1.0,
        icon: new ig.Image(MEDIAURL + 'icon_gauss.png'),
        recharge: 20,
        weaponVelocity: -800,
        image: new ig.Image(MEDIAURL + 'weapon_gauss.png'),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.timer = new ig.Timer(5);
        },
        fire: function () {
            this.parent();
            playSound('snd_gauss');
        },
        update: function () {
            if (this.pos.y > blast.groundY - 24) {
                this.vel.y = -this.vel.y;
                this.pos.y = blast.groundY - 24;
            }
            if (this.timer.delta() > 0) {
                ig.game.player.restoreWeapon(this.className);
            }
            this.parent();
        },
        draw: function () {
            this.image.draw(this.pos.x, this.pos.y);
        },
        check: function (other) {
            if (this.fired && other instanceof StoneEntity) {
                other.receiveDamage(100, this);
                if (other.className == ig.game.level.activeStoneClass) {
                    a = (Math.random() * 240) - 60;
                    if (a > 60) {
                        a += 60;
                    }
                    rad = (a * Math.PI) / 180;
                    this.vel.x = this.weaponVelocity * Math.cos(rad);
                    this.vel.y = this.weaponVelocity * Math.sin(rad);
                }
            }
        },
        collideWith: function () {
            playSound('snd_gauss');
        }
    });
});

// ./game/player.js
ig.baked = true;
ig.module('game.player').requires('impact.entity', 'impact.image', 'impact.animation').defines(function () {
    SpikesEntity = ig.Entity.extend({
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        size: {
            x: 174,
            y: 100
        },
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'spiked_shield.png', 174, 100),
        spawning: true,
        ending: false,
        timer: null,
        caller: null,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.updatePosition(x);
            this.addAnim('spawning', 0.1, createSequence(0, 11));
            this.addAnim('ending', 0.5, [12, 13]);
            this.addAnim('dflt', 1, [12]);
            this.timer = new ig.Timer(blast.levels.spikes_timeout);
            playSound('snd_spiked');
        },
        update: function () {
            if (this.spawning && this.currentAnim.loopCount) {
                this.spawning = false;
                this.currentAnim = this.anims.dflt.rewind();
            } else if (this.timer.delta() > 0) {
                if (this.ending) {
                    this.caller.removeSpikes();
                    this.kill();
                } else {
                    this.ending = true;
                    this.timer = new ig.Timer(5);
                    this.currentAnim = this.anims.ending.rewind();
                }
            }
            this.parent();
        },
        updatePosition: function (x) {
            this.pos.x = x - 87;
        },
        check: function (other) {
            other.receiveDamage(100, this);
        }
    });
    InvulnEntity = ig.Entity.extend({
        gravityFactor: 0,
        timeout: 0,
        caller: null,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.timer = new ig.Timer(this.timeout);
        },
        update: function () {
            if (this.timer.delta() > 0) {
                this.caller.removeInvuln();
                this.kill();
            }
            this.parent();
        }
    });
    HitStars = ig.Entity.extend({
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'hitstars.png', 77, 26),
        init: function (x, y, settings) {
            y = y - 26;
            this.parent(x, y, settings);
            this.addAnim('dflt', 0.2, [0, 1]);
        }
    });
    SpawnPuffEntity = ig.Entity.extend({
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'player_spawn.png', 128, 128),
        zIndex: 2000,
        init: function (x, y, settings) {
            x = x - 32;
            y = y - 32;
            this.parent(x, y, settings);
            this.addAnim('dflt', 0.1, createSequence(0, 7));
        },
        update: function () {
            if (this.currentAnim.frame > 6) {
                this.kill();
            }
            this.parent();
        }
    });
    WeaponSpawnPuffEntity = ig.Entity.extend({
        gravityFactor: 0,
        zIndex: 2000,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'puff_weapon.png', 32, 32),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('dflt', 0.1, createSequence(0, 7));
        },
        update: function () {
            if (this.currentAnim.frame > 6) {
                this.kill();
            }
            this.parent();
        }
    });
    DeadPlayer = ig.Entity.extend({
        gravityFactor: 0,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'player.png', 77, 128),
        graveImage: new ig.Image(MEDIAURL + 'grave.png'),
        hasGrave: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('death', 0.3, [5, 0]);
            musicManager.stop();
            playSound('snd_death');
        },
        update: function () {
            this.parent();
            if (this.currentAnim.loopCount > 3) {
                this.hasGrave = true;
                ig.game.playerKilled();
            }
        },
        draw: function () {
            if (this.hasGrave) {
                this.graveImage.draw(this.pos.x, this.pos.y);
            } else {
                this.parent();
            }
        },
        restoreWeapon: function () {}
    });
    PlayerEntity = ig.Entity.extend({
        type: ig.Entity.TYPE.A,
        size: {
            x: 77,
            y: 80
        },
        offset: {
            x: 0,
            y: 10
        },
        maxVel: {
            x: blast.player.speed,
            y: 0
        },
        gravityFactor: 0,
        health: blast.player.health,
        speed: blast.player.speed,
        collides: ig.Entity.COLLIDES.PASSIVE,
        bounciness: 1,
        spikes: null,
        invuln: null,
        hitStars: null,
        weapon: null,
        weaponIcon: null,
        oldWeapon: null,
        ammo: 0,
        weaponOffset: 0,
        zIndex: 1000,
        puffSpawn: true,
        animSheet: new ig.AnimationSheet(MEDIAURL + 'player.png', 77, 128),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('dflt', 0.075, [2, 3, 4]);
            this.addAnim('firing', 0.075, [0, 1]);
            this.pos.y = blast.player.posY;
            this.pos.x = ig.system.width / 2 - 32;
            playSound('snd_spawnplayer');
        },
        receiveDamage: function (damage, other) {
            if (!this.invuln && !this.spikes) {
                playSound('snd_ouch');
                ig.game.spawnEntity(PuffEntity, other.pos.x + 30, other.pos.y + 30);
                this.hitStars = ig.game.spawnEntity(HitStars, this.pos.x, this.pos.y);
                ig.game.spawnEntity(FloatingText, this.pos.x, this.pos.y, {
                    text: "OUCH!"
                });
                this.invuln = ig.game.spawnEntity(InvulnEntity, 0, 0, {
                    timeout: 3,
                    caller: this
                });
                this.parent(damage, other);
            }
        },
        update: function () {
            if (this.puffSpawn) {
                this.puffSpawn = false;
                ig.game.spawnEntity(SpawnPuffEntity, this.pos.x, this.pos.y);
            }
            if (this.spikes) {
                this.spikes.updatePosition(this.pos.x + 38.5);
            }
            if (this.hitStars) {
                this.hitStars.pos.x = this.pos.x;
                if (!this.invuln) {
                    this.hitStars.kill();
                    this.hitStars = null;
                }
            }
            if (ig.input.state('left')) {
                this.vel.x = -this.speed;
            } else if (ig.input.state('right')) {
                this.vel.x = this.speed;
            } else {
                this.vel.x = 0;
            }
            if (this.vel.x > 0) {
                this.currentAnim.flip.x = true;
                this.weaponOffset = 40;
            } else if (this.vel.x < 0) {
                this.currentAnim.flip.x = false;
                this.weaponOffset = 0;
            } else {
                this.currentAnim.rewind();
            }
            if (this.weapon) {
                if (this.weapon.canFire()) {
                    this.weapon.pos.x = this.pos.x + this.weaponOffset;
                    if (ig.input.pressed('fire')) {
                        if (this.ammo) {
                            this.ammo -= this.weapon.recharge;
                            this.weapon.fire();
                            this.currentAnim = this.anims.firing.rewind();
                        } else {
                            this.weapon.kill();
                            this.weapon = null;
                            this.ammo = 0;
                        }
                    }
                }
            }
            this.parent();
        },
        raiseSpikes: function () {
            if (this.spikes) {
                this.spikes.kill();
                this.spikes = null;
                if (this.invuln) this.invuln.kill();
                this.invuln = null;
            }
            this.spikes = ig.game.spawnEntity(SpikesEntity, this.pos.x + 38, this.pos.y, {
                caller: this
            });
            this.invuln = ig.game.spawnEntity(InvulnEntity, 0, 0, {
                timeout: blast.levels.spikes_timeout,
                caller: this
            });
        },
        gainHealth: function (amount) {
            this.health += amount;
            this.health = this.health.limit(0, blast.player.health);
            ig.game.spawnEntity(FloatingText, this.pos.x, this.pos.y, {
                text: "HEALTH +" + amount
            });
        },
        kill: function () {
            this.parent();
            ig.game.player = ig.game.spawnEntity(DeadPlayer, this.pos.x, this.pos.y);
        },
        switchWeapon: function (weapon, game) {
            if (!game) game = ig.game;
            if (weapon == this.oldWeapon) {
                this.ammo += this.weapon.recharge;
                this.ammo = this.ammo.limit(0, 100);
            } else {
                this.ammo = 100;
                this.oldWeapon = weapon;
            }
            if (this.weapon) {
                this.weapon.kill();
            }
            this.weapon = game.spawnEntity(weapon, this.pos.x + this.weaponOffset, this.pos.y + 43);
            ig.game.spawnEntity(WeaponSpawnPuffEntity, this.pos.x + this.weaponOffset, this.pos.y + 43);
            this.weaponIcon = this.weapon.icon;
            game.sortEntities();
            this.currentAnim = this.anims.dflt.rewind();
        },
        restoreWeapon: function (weapon) {
            if (this.ammo < 10) {
                this.switchWeapon("StoneWeapon");
            } else {
                if (this.weapon) {
                    this.weapon.kill();
                }
                this.weapon = ig.game.spawnEntity(weapon, this.pos.x + this.weaponOffset, this.pos.y + 43);
                ig.game.spawnEntity(WeaponSpawnPuffEntity, this.pos.x + this.weaponOffset, this.pos.y + 43);
                ig.game.sortEntities();
            }
            this.currentAnim = this.anims.dflt.rewind();
            playSound('snd_weapon_respawn');
        },
        removeSpikes: function () {
            this.spikes = null;
            this.removeInvuln();
        },
        removeInvuln: function () {
            this.invuln = null;
        }
    });
});

// ./game/stone.js
ig.baked = true;
ig.module('game.stone').requires('impact.entity', 'impact.image', 'impact.animation').defines(function () {
    StoneEntity = ig.Entity.extend({
        className: 'StoneEntity',
        size: {
            x: 43,
            y: 34
        },
        offset: {
            x: 21,
            y: 7
        },
        maxVel: {
            x: 600,
            y: 600
        },
        type: ig.Entity.TYPE.B,
        health: 90,
        gravityFactor: 0,
        checkAgainst: ig.Entity.TYPE.A,
        spawning: true,
        speedFactor: 1,
        zIndex: 100,
        origin: {
            x: 0,
            y: blast.stone.originY
        },
        angularPos: 0,
        angularDir: 1,
        angularSpeed: 0,
        angularOffset: 0,
        angularTickFactor: 0,
        attacking: false,
        banished: false,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('spawning', 0.1, createSequence(0, 17));
            this.addAnim('dflt', 0.1, [18, 19, 20, 19]);
            this.addAnim('active', 0.1, [21, 22, 23, 22]);
            this.addAnim('attacking', 1, [24]);
            this.initSpawn();
        },
        initSpawn: function () {
            this.angularOffset = Math.random() * Math.PI * 2;
            this.angularSpeed = this.angularOffset;
            this.angularDir = (Math.random() > 0.5) ? 1 : -1;
            this.angularSpeed = this.angularTickFactor * this.angularDir;
            this.vel = {
                x: 0,
                y: 0
            };
            this.accel = {
                x: 0,
                y: 0
            };
            this.spawning = true;
            this.attacking = false;
            this.currentAnim = this.anims.spawning.rewind();
        },
        slowDown: function (factor) {
            this.speedFactor = factor;
        },
        speedUp: function () {
            this.speedFactor = 1;
        },
        update: function () {
            this.parent();
            if (!this.attacking) {
                this.angularPos += ig.system.tick * this.angularSpeed * this.speedFactor;
                this.origin.x = ig.system.width / 2 - (Math.cos(this.angularOffset + this.angularPos / 5) * ((ig.system.width * 0.9) / 2)) - 32;
                this.pos.x = this.origin.x + blast.stone.radiusY * Math.cos(this.angularPos);
                this.pos.y = this.origin.y + blast.stone.radiusY * Math.sin(this.angularPos);
            } else if (this.attacking || this.banished) {
                if (this.pos.x > ig.system.width || this.pos.x < -102 || this.pos.y > ig.system.height) {
                    this.banished = false;
                    this.initSpawn();
                }
            }
            if (!this.spawning) {
                if (!this.attacking) {
                    this.currentAnim = ig.game.level.activeStoneClass == this.className ? this.anims.active : this.anims.dflt;
                }
            }
            if (this.spawning && this.currentAnim.loopCount) {
                this.spawning = false;
                this.currentAnim = this.anims.dflt.rewind();
                this.currentAnim.gotoRandomFrame();
            }
        },
        receiveDamage: function (damage, other) {
            if (!this.spawning && ig.game.stoneKillable(this.className)) {
                this.parent(damage, other);
                return;
            } else if (other instanceof SpikesEntity) {
                this.banish();
            } else if (other instanceof StoneWeapon) {
                playSound('snd_thud');
            }
        },
        kill: function () {
            this.parent();
            ig.game.stoneKilled(this.className, this.pos.x, this.pos.y);
            ig.game.spawnEntity(ExplosionEntity, this.pos.x + 30, this.pos.y + 30);
        },
        attack: function () {
            if (!this.attacking && !this.spawning) {
                playSound('snd_attack');
                this.attacking = true;
                this.currentAnim = this.anims.attacking.rewind();
                a = this.angleTo(ig.game.player);
                cos = Math.cos(a);
                sin = Math.sin(a);
                this.accel.x = 200 * cos;
                this.accel.y = 200 * sin;
                this.vel.x = 100 * cos;
                this.vel.y = 100 * sin;
            }
        },
        banish: function () {
            if (!this.banished) {
                playSound('snd_thud');
                this.banished = true;
                this.vel.y = 0;
                this.vel.x = 600 * ((this.vel.x > 0) ? -1 : 1);
            }
        },
        check: function (other) {
            if (other instanceof PlayerEntity) {
                other.receiveDamage(30, this);
            }
        }
    });
    SquareStone = StoneEntity.extend({
        className: 'SquareStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_square.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_square.png')
    });
    CircleStone = StoneEntity.extend({
        className: 'CircleStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_circle.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_circle.png')
    });
    TriangleStone = StoneEntity.extend({
        className: 'TriangleStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_triangle.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_triangle.png')
    });
    PentaStone = StoneEntity.extend({
        className: 'PentaStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_penta.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_penta.png')
    });
    SextaStone = StoneEntity.extend({
        className: 'SextaStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_sexta.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_sexta.png')
    });
    UnknownStone = StoneEntity.extend({
        className: 'UnknownStone',
        animSheet: new ig.AnimationSheet(MEDIAURL + 'enemy_unknown.png', 102, 57),
        icon: new ig.Image(MEDIAURL + 'icon_unknown.png'),
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('spawning', 0.1, createSequence(0, 17));
            this.addAnim('active', 0.1, [18, 19, 20, 19]);
            this.addAnim('dflt', 0.1, [18, 19, 20, 19]);
        },
    });
});

// ./game/items.js
ig.baked = true;
ig.module('game.items').requires('impact.entity', 'impact.image').defines(function () {
    ItemEntity = ig.Entity.extend({
        gravityFactor: 0,
        size: {
            x: 32,
            y: 32
        },
        maxVel: {
            x: 0,
            y: 300
        },
        checkAgainst: ig.Entity.TYPE.A,
        picked: false,
        image: null,
        callbackEntity: null,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.gravityFactor = 5;
            this.vel.y = -300;
        },
        update: function () {
            if (this.pos.y > ig.system.height) {
                this.kill();
            }
            this.parent();
        },
        draw: function () {
            this.image.draw(this.pos.x, this.pos.y);
        },
        check: function (other) {
            if (other instanceof PlayerEntity && !this.picked) {
                this.picked = true;
                this.gravityFactor = 10;
                this.vel.y = -300;
                this.canCheck(other);
                playSound('snd_health');
            }
        },
        canCheck: function (other) {
            ig.game.begetItem(this.icon, this.callbackEntity);
        }
    });
    HealthItem = ItemEntity.extend({
        image: new ig.Image(MEDIAURL + 'item_health.png'),
        icon: null,
        canCheck: function (other) {
            other.gainHealth(30);
        }
    });
    TimeItemEffect = ig.Entity.extend({
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            stones = ig.game.getEntitiesByType('StoneEntity');
            for (i = 0; i < stones.length; i++) {
                stones[i].slowDown(0.3);
            }
            this.effectTimer = new ig.Timer(10);
            playSound('snd_clock');
        },
        update: function () {
            if (this.effectTimer.delta() > 0) {
                stones = ig.game.getEntitiesByType('StoneEntity');
                for (i = 0; i < stones.length; i++) {
                    stones[i].speedUp();
                }
                this.kill();
                ig.game.timeEffect = null;
            }
        },
        kill: function () {
            this.parent();
        }
    });
    TimeItem = ItemEntity.extend({
        image: new ig.Image(MEDIAURL + 'item_time.png'),
        icon: new ig.Image(MEDIAURL + 'icon_time.png'),
        canCheck: function (other) {
            if (ig.game.timeEffect) {
                ig.game.timeEffect.kill();
            }
            ig.game.timeEffect = ig.game.spawnEntity(TimeItemEffect, 0, 0);
        }
    });
    SpikesItem = ItemEntity.extend({
        image: new ig.Image(MEDIAURL + 'item_spikes.png'),
        icon: new ig.Image(MEDIAURL + 'icon_spikes.png'),
        canCheck: function (other) {
            other.raiseSpikes();
        }
    });
    FireballItem = ItemEntity.extend({
        image: new ig.Image(MEDIAURL + 'item_fireball.png'),
        icon: new ig.Image(MEDIAURL + 'icon_fireball.png'),
        canCheck: function (other) {
            ig.game.player.switchWeapon("FireballWeapon");
        }
    });
    GaussItem = ItemEntity.extend({
        image: new ig.Image(MEDIAURL + 'item_gauss.png'),
        icon: new ig.Image(MEDIAURL + 'icon_gauss.png'),
        canCheck: function (other) {
            ig.game.player.switchWeapon("GaussWeapon");
        }
    });
});

// ./game/hints.js
ig.baked = true;
ig.module('game.hints').requires('impact.entity', 'impact.image', 'game.newgame_splash').defines(function () {
    HintEntity = ig.Entity.extend({
        gravityFactor: 0,
        text: [],
        icon: null,
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            ig.game.spawnEntity(TypewriterText, x + 128, y, {
                text: this.text
            });
        },
        draw: function () {
            this.icon.draw(this.pos.x, this.pos.y);
        }
    });
    HINTS = {
        "stage-2": {
            icon: new ig.Image(MEDIAURL + 'item_spikes.png'),
            text: ["COLLECT SPIKED SPHERES TO RAISE SHIELDS AROUND", "DR. BLAST. THE SHIELDS WILL PROTECT HIM FOR A", "WHILE AGAINST ALL ATTACKING GEOMETRIX."]
        },
        "stage-3": {
            icon: new ig.Image(MEDIAURL + 'item_fireball.png'),
            text: ["COLLECT AND SHOOT FIREBALLS FOR MAXIMUM DAMAGE.", "FIREBALL EXPLOSION YIELDS DAMAGE TO THE", "GEOMETRIX WITHIN IT'S SPLASH RADIUS."]
        },
        "stage-4": {
            icon: new ig.Image(MEDIAURL + 'item_gauss.png'),
            text: ["WHEN LAUNCHED, GAUSS BALLS PASS THROUGH ALL", "THE GEOMETRIX AND HIT ONLY YELLOW GLOWING ONES,", "BOUNCING TOWARD OTHERS FOR THE CONTINUOUS", "RAMPAGE THAT LASTS FOR A FEW SECONDS."]
        }
    };
});

// ./game/gamescreens.js
ig.baked = true;
ig.module('game.gamescreens').defines(function () {
    GAMESCREENS = {
        intro: {
            callParent: 1,
            update: function () {},
            draw: function () {}
        },
        stage_intro: {
            callParent: 1,
            update: function () {
                if (this.level.stageintro.idle && ig.input.pressed('click')) {
                    this.nextLevel();
                }
            },
            draw: function () {
                this.backdrops[this.level.stage + 1].draw(0, 0);
                this.splash_endstage_bg.draw(16, 16);
                for (i = 0; i < this.entities.length; i++) {
                    this.entities[i].draw();
                }
            }
        },
        play: {
            callParent: 1,
            update: function () {
                if (this.stoneQueue.length) {
                    if (this.stoneQueueTimer.delta() > 0) {
                        this.stoneQueueTimer.reset();
                        e = this.stoneQueue.shift();
                        this.spawnEntity(e, 0, 0, {
                            angularTickFactor: this.level.angularTickFactor
                        });
                    }
                }
                if (this.level.attackTimer.delta() > 0) {
                    this.attack();
                    this.level.attackTimer.reset();
                }
                if (ig.input.pressed('pause')) {
                    this.switchGameScreen("paused");
                }
                if (blast.debug && ig.input.pressed('level')) {
                    this.endlevel = true;
                }
                if (this.endlevel && !this.getEntitiesByType('ExplosionEntity').length) {
                    this.endlevel = false;
                    playSound('snd_endlevel');
                    reportProgress(this.level);
                    this.spawnEntity(LevelUpEntity, 0, 0, {
                        callback: function () {
                            if (ig.game.level.last) {
                                playSound('snd_stage');
                                promptWallpost(ig.game.level.stage + 1);
                                musicManager.stop();
                                ig.game.switchGameScreen("endstage");
                            } else {
                                ig.game.nextLevel();
                            }
                        }
                    });
                }
                if (!this.level.started) {
                    this.level.started = true;
                    this.player = this.spawnEntity(PlayerEntity);
                    this.player.health = this.level.storedHealth;
                    this.player.switchWeapon('StoneWeapon', this);
                    this.spawnEntity(FloatingText, ig.system.width / 2, ig.system.height / 2, {
                        timeout: 6,
                        alphaStep: 0.97,
                        align: ig.Font.ALIGN.CENTER,
                        text: "LEVEL: " + this.level.number
                    });
                    this.sortEntities();
                }
            },
            draw: function () {
                this.backdrops[this.level.stage].draw(0, 0);
                for (i = 0; i < this.entities.length; i++) {
                    this.entities[i].draw();
                }
                ig.system.context.fillStyle = "rgba(0, 0, 0, 0.4)";
                ig.system.context.fillRect(0, 0, ig.system.width, 32);
                x = 10;
                if (this.stoneIcon) {
                    this.stoneIcon.draw(x, 0);
                }
                x = 100;
                if (this.player) {
                    this.ico_health.draw(x, 10);
                    ig.system.context.fillStyle = "rgba(0, 0, 0, 1.0)";
                    ig.system.context.fillRect(x + 38.5, 10.5, 103, 13);
                    w = this.player.health / blast.player.health * 100;
                    this.ico_healthbar.draw(x + 40, 12, 0, 0, w, 10);
                }
                x = 250;
                if (this.itemImage) {
                    this.itemImage.draw(x, 0);
                }
                x = 300;
                if (this.player && this.player.ammo) {
                    this.player.weaponIcon.draw(x, 0);
                    ig.system.context.fillStyle = "#fff";
                    ig.system.context.strokeStyle = "#fff";
                    ig.system.context.strokeRect(x + 38.5, 10.5, 102, 13);
                    ig.system.context.fillRect(x + 39.5, 11.5, this.player.ammo, 11);
                }
                x = 520;
                this.ico_level.draw(x, 0);
                this.font.draw(this.level.number, x + 32, 10);
                x = 600;
                this.ico_score.draw(x, 0);
                this.font.draw(this.score, x + 30, 10, ig.Font.ALIGN.LEFT);
            }
        },
        paused: {
            callParent: 0,
            update: function () {
                if (ig.input.pressed('pause')) {
                    this.switchGameScreen("play");
                }
                if (ig.input.pressed('escape')) {
                    screenMenu(true);
                }
            },
            draw: function () {
                GAMESCREENS.play.draw.call(this);
                ig.system.context.fillStyle = "rgba(0, 0, 0, 0.8)";
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
                this.splash_paused.draw(ig.system.width / 2 - 250, ig.system.height / 2 - 120);
                this.font.draw("PRESS P TO CONTINUE...", ig.system.width / 2, ig.system.height / 2 + 150, ig.Font.ALIGN.CENTER);
                this.font.draw("PRESS ESCAPE FOR MENU...", ig.system.width / 2, ig.system.height / 2 + 180, ig.Font.ALIGN.CENTER);
            }
        },
        endstage: {
            callParent: 0,
            update: function () {
                if (ig.input.pressed('click')) {
                    this.enterStage(this.level.stage + 1);
                }
            },
            draw: function () {
                GAMESCREENS.play.draw.call(this);
                ig.system.context.fillStyle = "rgba(0, 0, 0, 0.9)";
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
                x = 50;
                y = 300;
                this.splash_endstage.draw(x + 64, 32);
                hs = "stage-" + (ig.game.level.stage + 1);
                if (hs in HINTS) {
                    this.font.draw("NEW ITEMS AVAILABLE:", x + 96, y - 60, ig.Font.ALIGN.LEFT);
                    HINTS[hs].icon.draw(x, y);
                    for (var i = 0; i < HINTS[hs].text.length; i++) {
                        this.font.draw(HINTS[hs].text[i], x + 96, y + (i * 30));
                    }
                }
                this.font.draw("CLICK HERE TO CONTINUE...", x + 96, 450, ig.Font.ALIGN.LEFT);
            }
        },
        gameover: {
            callParent: 0,
            update: function () {
                if (ig.input.pressed('space')) {
                    screenHighScore(true);
                }
            },
            draw: function () {
                GAMESCREENS.play.draw.call(this);
                ig.system.context.fillStyle = "rgba(0, 0, 0, 0.8)";
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
                this.splash_gameover.draw(ig.system.width / 2 - 190, ig.system.height / 2 - 200);
                this.font.draw("PRESS SPACE TO CONTINUE...", ig.system.width / 2, ig.system.height / 2 + 175, ig.Font.ALIGN.CENTER);
            }
        }
    };
});

// ./game/progress.js
ig.baked = true;
ig.module('game.progress').defines(function () {
    reportProgress = function (level, died) {
        report = {
            _auth: _AUTH,
            level: level.number,
            score: level.score,
            last: (level.last) ? 1 : 0,
            died: (typeof (died) == 'undefined') ? 0 : 1
        };
        $.ajax({
            url: URL_PROGRESS,
            type: "POST",
            dataType: "json",
            data: report
        });
    }
    showHighScores = function (element) {
        $.ajax({
            url: URL_HIGHSCORES + "?_auth=" + _AUTH,
            type: "GET",
            dataType: "html",
            context: $(element),
            success: function (response) {
                $(this).empty().append(response);
            }
        });
    }
    promptWallpost = function (stage) {}
});

// ./game/screens.js
ig.baked = true;
ig.module('game.screens').defines(function () {
    beginAll = function () {
        switchTo("#screen_game");
        ig.main('#canvas', LoaderSplashGame, 30, 760, 506, 1);
    }
    innerSwitchTo = function (scr) {
        $(".inner_screen").hide();
        $(scr).show();
    }
    switchTo = function (scr) {
        cb = Math.random();
        $(".screen").hide();
        $(scr).fadeIn(1000, function () {
            if (scr == "#screen_game") {
                $("#canvas").focus();
            }
        });
    }
    screenHelp = function () {
        innerSwitchTo("#inner_help_1");
        switchTo("#screen_help");
    }
    screenPayment = function () {
        switchTo("#screen_payment");
        ig.system.stopRunLoop.call(ig.system);
        $("#menu_back").hide();
    }
    screenMenu = function (paused) {
        switchTo("#screen_menu");
        ig.system.stopRunLoop.call(ig.system);
        if (paused) {
            $("#menu_back").show();
        }
    }
    screenNewGame = function () {
        blast.levels.start = 1;
        blast.player.score = 0;
        switchTo("#screen_game");
        ig.system.startRunLoop.call(ig.system);
        if (blast.intro) {
            ig.system.setGame(IntroSplashGame);
        } else {
            ig.system.setGame(BlastGame);
        }
        $("#hints").fadeIn(1000);
        $("#menu_back").show();
    }
    screenGame = function () {
        switchTo("#screen_game");
        ig.system.startRunLoop.call(ig.system);
    }
    screenContinue = function () {
        switchTo("#screen_game");
        ig.system.startRunLoop.call(ig.system);
        ig.system.setGame(BlastGame);
        $("#menu_back").unbind('click').click(screenBack);
        $("#hints").fadeIn(1000);
    }
    screenBack = function () {
        switchTo("#screen_game");
        ig.system.startRunLoop.call(ig.system);
    }
    screenHighScore = function (fromgame) {
        if (fromgame) {
            ig.system.stopRunLoop.call(ig.system);
        }
        $("#hscore_table").empty();
        switchTo("#screen_hscore");
        showHighScores("#hscore_table");
    }
});

// ./game/utils.js
ig.baked = true;
ig.module('game.utils').defines(function () {
    createProbabilityMap = function (pmap) {
        a = [];
        for (e in pmap) {
            for (i = 0; i < pmap[e]; i++) {
                a.push(e);
            }
        }
        return a;
    }
    createSequence = function (start, stop) {
        a = []
        for (i = start; i <= stop; i++) {
            a.push(i);
        }
        return a;
    }
});

// ./game/init_ui.js
ig.baked = true;
ig.module('game.init_ui').requires('impact.image', 'game.screens').defines(function () {
    ROLLOVERS = [new ig.Image(MEDIAURL + 'menu_auth_h.png'), new ig.Image(MEDIAURL + 'menu_back_h.png'), new ig.Image(MEDIAURL + 'menu_credits_h.png'), new ig.Image(MEDIAURL + 'menu_full_h.png'), new ig.Image(MEDIAURL + 'menu_help_h.png'), new ig.Image(MEDIAURL + 'menu_hscores_h.png'), new ig.Image(MEDIAURL + 'menu_invite_h.png'), new ig.Image(MEDIAURL + 'menu_menu_h.png'), new ig.Image(MEDIAURL + 'menu_newgame_h.png'), new ig.Image(MEDIAURL + 'menu_quit_h.png')];
    init_ui = function () {
        $("#screen_preload").show();
        $(".backtomenu").click(function () {
            switchTo("#screen_menu");
        });
        $(".btn, .backtomenu").mouseover(function () {
            playSound('snd_beep');
        });
        $("#menu_new").click(screenNewGame);
        $("#menu_credits").click(function () {
            switchTo("#screen_credits");
        });
        $("#menu_help").click(screenHelp);
        $("#menu_hscore").click(screenHighScore);
        $("#menu_quit").click(function () {
            $.ajax({
                url: URL_QUIT,
                type: "POST",
                dataType: "json",
                timeout: 20000,
                success: function (response) {
                    top.location.href = URL_APP;
                }
            });
        });
        $("#pager_help_1").click(function () {
            innerSwitchTo("#inner_help_2");
        });
        $("#pager_help_2").click(function () {
            innerSwitchTo("#inner_help_1");
        });
        $(".buylink").click(function () {
            switchTo("#screen_payment");
        });
        $(".fullaccess").click(function () {
            top.location.href = URL_PAYMENT_DIALOG;
        });
        $(".invite, .invite_top").click(function () {
            FB.ui({
                title: "Invite friends to beat in Dr. Blast!",
                method: "apprequests",
                message: "Hey, why don't you try and beat my highscore in this awesome game?"
            });
        });
        if (blast.levels.start > 1) {
            $("#menu_back").click(screenContinue);
            $("#menu_back").show();
        } else {
            $("#menu_back").click(screenBack);
            $("#menu_back").hide();
        }
        $(".buylink").hide();
        $("#snd a").click(function () {
            toggleSound();
            snd = (SOUNDSTATE) ? "ON" : "OFF";
            $("#snd a span").html(snd);
            return false;
        });
        $("#regainfocus").click(function () {
            $("#canvas").show(function () {
                $("#canvas").focus();
            });
            $("#lostfocus").hide();
            ig.system.startRunLoop.call(ig.system);
        });
        $("#canvas").focusout(function () {
            if (blast.debug) console.log("Canvas lost focus.");
            ig.system.stopRunLoop.call(ig.system);
            $("#canvas").hide();
            $("#lostfocus").show();
        });
        $("#canvas").focusin(function () {
            if (blast.debug) console.log("Canvas gained focus.");
        });
        $("#canvas").click(function () {
            $("#canvas").focus();
        });
        beginAll();
    }
});

// game/main.js
ig.baked = true;
ig.module('game.main').requires('impact.game', 'impact.font', 'impact.image', 'impact.animation', 'impact.timer', 'impact.entity', 'game.splashes', 'game.explosion', 'game.intro_splash', 'game.newgame_splash', 'game.stage_splashes', 'game.weapons', 'game.player', 'game.stone', 'game.items', 'game.hints', 'game.gamescreens', 'game.progress', 'game.screens', 'game.utils', 'game.init_ui').defines(function () {
    BorderEntity = ig.Entity.extend({
        gravityFactor: 0,
        collides: ig.Entity.COLLIDES.FIXED,
        draw: function () {}
    });
    BlastGame = ig.Game.extend({
        clearColor: null,
        gravity: 100,
        backdrops: [null, new ig.Image(MEDIAURL + 'backdrop-1.jpg'), new ig.Image(MEDIAURL + 'backdrop-2.jpg'), new ig.Image(MEDIAURL + 'backdrop-3.jpg'), new ig.Image(MEDIAURL + 'backdrop-4.jpg'), new ig.Image(MEDIAURL + 'backdrop-5.jpg'), new ig.Image(MEDIAURL + 'backdrop-6.jpg'), ],
        ico_health: new ig.Image(MEDIAURL + 'ico_health.png'),
        ico_healthbar: new ig.Image(MEDIAURL + 'healthbar.jpg'),
        ico_level: new ig.Image(MEDIAURL + 'icon_level.png'),
        ico_score: new ig.Image(MEDIAURL + 'icon_score.png'),
        splash_paused: new ig.Image(MEDIAURL + 'splash_paused.png'),
        splash_gameover: new ig.Image(MEDIAURL + 'splash_gameover.png'),
        splash_endstage: new ig.Image(MEDIAURL + 'splash_stage.png'),
        splash_endstage_bg: new ig.Image(MEDIAURL + 'stage_intro_bg.png'),
        font: new ig.Font(MEDIAURL + 'font_16.png'),
        font20: new ig.Font(MEDIAURL + 'font_20.png'),
        player: null,
        score: 0,
        score_doublekills: 0,
        score_multikills: 0,
        level: {
            number: 0,
            score: 0,
            angularTickFactor: 0,
            stonePool: [],
            activeStoneClass: null,
            itemsTimer: new ig.Timer(),
            attackTimer: new ig.Timer(),
            attackY: 0,
            stage: 0,
            newGame: true,
            last: false,
            endReached: false,
            stageintro: null,
            storedHealth: 100
        },
        endlevel: false,
        multikillEntity: null,
        multikillCount: 0,
        multikillTimer: new ig.Timer(),
        stoneIcon: null,
        stoneQueue: [],
        stoneQueueTimer: new ig.Timer(),
        itemImage: null,
        itemCallbackEntity: null,
        gameScreen: null,
        init: function () {
            this.bindKeys();
            this.level.number = blast.levels.start - 1;
            this.score = blast.player.score;
            this.nextLevel();
        },
        bindKeys: function () {
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.X, 'fire');
            ig.input.bind(ig.KEY.C, 'item');
            ig.input.bind(ig.KEY.P, 'pause');
            ig.input.bind(ig.KEY.ESC, 'escape');
            ig.input.bind(ig.KEY.SPACE, 'space');
            ig.input.bind(ig.KEY.MOUSE1, 'click');
            if (blast.debug) {
                ig.input.bind(ig.KEY.L, 'level');
            }
        },
        switchGameScreen: function (src) {
            this.gameScreen = GAMESCREENS[src];
        },
        update: function () {
            if (this.gameScreen.callParent == 1) this.parent();
            this.gameScreen.update.call(this);
            if (this.gameScreen.callParent == 2) this.parent();
        },
        draw: function () {
            this.gameScreen.draw.call(this);
        },
        attack: function () {
            stones = this.getEntitiesByType(StoneEntity);
            entity = null;
            for (var i = 0; i < stones.length; i++) {
                s = stones[i];
                if (s.pos.y <= this.level.attackY && s.pos.x > 0 && s.pos.x < ig.system.width) {
                    entity = stones[i];
                    break;
                }
            }
            if (entity) {
                entity.attack();
            }
        },
        stoneKillable: function (className) {
            return className == this.level.activeStoneClass;
        },
        stoneKilled: function (className, sx, sy) {
            scoreFactor = 1;
            if (this.multikillTimer.tick() < 1.0) {
                this.multikillCount++;
                if (this.multikillCount == 1) {
                    scoreFactor = 2;
                    this.doubleKill(scoreFactor);
                } else if (this.multikillCount == 2) {
                    scoreFactor = 4;
                    this.multiKill(scoreFactor);
                }
            } else {
                this.multikillCount = 0;
            }
            s = "+" + this.gainScore(scoreFactor);
            this.spawnEntity(FloatingText, sx, sy, {
                text: s
            });
            oldActiveStoneClass = this.level.activeStoneClass;
            stones = this.getEntitiesByType(StoneEntity);
            activeStones = this.getEntitiesByType(oldActiveStoneClass);
            if (!activeStones.length && stones.length) {
                this.level.activeStoneClass = stones.random().className;
                this.setStoneIcon();
                this.level.stonePool.erase(oldActiveStoneClass);
            }
            if (stones.length > 2 && this.level.stonePool.length > 1) {
                this.spawnStone();
            } else if (!stones.length) {
                this.endlevel = true;
            }
            if (this.level.itemsTimer.delta() > 0) {
                this.spawnItem(sx, sy);
                this.level.itemsTimer.reset();
            }
        },
        setStoneIcon: function () {
            eval("this.stoneIcon = " + this.level.activeStoneClass + ".prototype.icon;");
        },
        gainScore: function (scoreFactor) {
            score = this.level.number * blast.scoreBase * scoreFactor;
            this.score += score;
            this.level.score += score;
            return score;
        },
        doubleKill: function (scoreFactor) {
            if (this.multikillEntity) this.multikillEntity.kill();
            this.multikillEntity = this.spawnEntity(FloatingText, ig.system.width / 2, ig.system.height / 2, {
                text: "DOUBLEKILL: x" + scoreFactor
            });
            this.score_doublekills++;
        },
        multiKill: function (scoreFactor) {
            if (this.multikillEntity) this.multikillEntity.kill();
            this.multikillEntity = this.spawnEntity(FloatingText, ig.system.width / 2, ig.system.height / 2, {
                text: "MULTIKILL: x" + scoreFactor
            });
            this.score_multikills++;
        },
        spawnStone: function (stoneClass) {
            if (!stoneClass) {
                stoneClass = this.level.stonePool.random();
            }
            this.stoneQueue.push(stoneClass);
        },
        spawnItem: function (x, y) {
            item = this.level.itemPool.random();
            this.spawnEntity(item, x, y);
        },
        begetItem: function (image, callbackEntity) {
            this.itemImage = image;
            this.itemCallbackEntity = callbackEntity;
        },
        loseItem: function () {
            this.itemImage = null;
            this.itemCallbackEntity = null;
        },
        nextLevel: function () {
            this.level.number++;
            this.level.activeStoneClass = null;
            this.level.score = 0;
            lvl = this.level.number - 1;
            if (blast.limit_level && blast.limit_level <= this.level.number) {
                screenPayment();
                return;
            }
            if (this.player) {
                this.level.storedHealth = this.player.health;
            }
            ipf = (blast.levels.angularTickFactor.end - blast.levels.angularTickFactor.start) / blast.levels.end;
            this.level.angularTickFactor = blast.levels.angularTickFactor.start + ipf * lvl;
            ipf = (blast.levels.items.endTime - blast.levels.items.startTime) / blast.levels.end;
            val = (blast.levels.items.startTime + ipf * lvl).limit(blast.levels.items.endTime, blast.levels.items.startTime);
            this.level.itemsTimer = new ig.Timer(val);
            ipf = (blast.levels.attack.endTime - blast.levels.attack.startTime) / blast.levels.end;
            val = (blast.levels.attack.startTime + ipf * lvl).limit(blast.levels.attack.endLimit, blast.levels.attack.startTime);
            this.level.attackTimer = new ig.Timer(val);
            this.level.attackY = blast.levels.attack.thresholdY;
            if (this.level.number <= blast.levels.end) {
                if (this.level.number % blast.levels.stageChange == blast.levels.stageChange - 1) {
                    this.level.last = true;
                } else {
                    this.level.last = false;
                }
            }
            stage = ((this.level.number / blast.levels.stageChange).toInt() + 1).limit(1, this.backdrops.length - 1).toInt();
            if (this.level.stage != stage) {
                music = stage % 4;
                musicClip = "music-" + music;
                if (!music) musicClip = "music-intro";
                musicManager.play(musicClip);
            }
            this.level.stage = stage;
            this.level.newGame = false;
            this.level.itemPool = [];
            for (it in blast.levels.items.order) {
                if (blast.levels.items.order[it] <= this.level.number) {
                    this.level.itemPool.push(it);
                }
            }
            this.endlevel = false;
            this.score_multikills = 0;
            this.score_doublekills = 0;
            this.multikillCount = 0;
            this.entities = [];
            this.namedEntities = [];
            this.backgroundMaps = [];
            this.spawnEntity(BorderEntity, 0, 0, {
                size: {
                    x: ig.system.width,
                    y: 32
                }
            });
            this.spawnEntity(BorderEntity, ig.system.width, 0, {
                size: {
                    x: 32,
                    y: ig.system.height
                }
            });
            this.spawnEntity(BorderEntity, -32, 0, {
                size: {
                    x: 32,
                    y: ig.system.height
                }
            });
            ipf = (blast.levels.stones.end - blast.levels.stones.start) / blast.levels.end;
            N = ((blast.levels.stones.start + (ipf * lvl)).toInt()).limit(0, blast.levels.stones.limit);
            ipf = (blast.levels.stones.order.length - blast.levels.stones.orderStart) / blast.levels.end;
            poolSize = blast.levels.stones.orderStart + (ipf * lvl).toInt();
            this.level.stonePool = blast.levels.stones.order.slice(0, poolSize.limit(0, blast.levels.stones.order.length));
            for (var i = 0; i < N; i++) {
                className = this.level.stonePool.random();
                this.spawnStone(className);
            }
            this.level.activeStoneClass = className;
            this.level.started = false;
            this.setStoneIcon();
            this.sortEntities();
            this.stoneQueueTimer = new ig.Timer(1);
            this.switchGameScreen("play");
        },
        playerKilled: function () {
            reportProgress(this.level, true);
            this.switchGameScreen("gameover");
            blast.levels.start = 1;
            blast.player.score = 0;
        },
        enterStage: function (stage) {
            this.entities = [];
            this.namedEntities = [];
            this.backgroundMaps = [];
            sp = "stage-" + stage;
            this.switchGameScreen("stage_intro");
            this.level.stageintro = this.spawnEntity(TypewriterText, 32, 32, {
                text: STAGE_SPLASHES[sp]
            });
        }
    });
    init_ui();
    if (blast.startwith == "game") {
        ig.main('#canvas', BlastGame, 30, 760, 506, 1);
    }
});
