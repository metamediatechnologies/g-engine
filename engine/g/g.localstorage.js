/**
 *  @impact-storage.js
 *  @author: Jordan Santell
 *  @date: May, 2011
 *  @copyright (c) 2011 Jordan Santell, under The MIT License (see LICENSE)
 *
 *  ImpactStorage is a plugin for HTML5/js game framework ImpactJS, giving
 *  developers an easy-to-use interface to localStorage for their projects.
 *
 *  https://github.com/jsantell/ImpactStorage
 *  http://impactjs.com/forums/code/localstorage-plugin
 */

/*
 *
High Score
    this.storage = new ig.Storage();

    // Initialize high score as 0 if 'highScore' does not exist
    this.storage.initUnset('highScore', 0);
    *
During the update loop that determines whether or not the current score should override the score in localStorage:
    var player = this.getEntitiesByType(EntityPlayer)[0];

    //   Updates the value of 'highScore' if and only
    //   if player.score > this.storage.get('highScore')

    this.storage.setHighest('highScore',player.score);
    *
    *
storing json objects
*
    this.storage = new ig.Storage();

    //   Player's velocity is an object stored as
    //   vel: {x: 200, y: 100}
    //   And that data is now being stored with key playerVel in localStorage

    var player = this.getEntitiesByType(EntityPlayer)[0];
    this.storage.set('playerVel',player.vel)

    // And let's output it for fun
    alert("Player's x velocity: "+this.storage.get('playerVel').x);
    alert("Player's y velocity: "+this.storage.get('playerVel').y);
    *

this.storage = new ig.Storage();



 5 different achievement badges
badges:    {
    1:    {
        id: 'badge1',
        title" 'Badge 1',
        description: 'Badge 1 Description'
    },
    2:    {
        id: 'badge2',
        title" 'Badge 2',
        description: 'Badge 2 Description'
    },

    //and so forth
}
this.storage.set('badges', {});
this.storage.append('badges', badge1);
this.storage.append('badges', badge2);
this.storage.append('badges', badge3);
this.storage.append('badges', badge4);
this.storage.append('badges', badge5);
*
* var getBadge1 = this.storage.getById('badge1');
* var badge1Name = this.storage.get('badges').1.title;
*/

ig.module(
	'plugins.impact-storage'
)
.requires(
	'impact.game'
)
.defines(function(){

ig.Storage = ig.Class.extend({

    // Makes ImpactStorage a singleton
    staticInstantiate: function(i)  {

        if(ig.Storage.instance==null)
            return null;
        else
            return ig.Storage.instance;
    },


    init: function()    {

    },


    isCapable: function()   {

        if(typeof(localStorage) == 'undefined')
            return false
        else
            return true
    },


    isSet: function(key)   {

        if(this.get(key)==null)
            return false;
        else
            return true;
    },


    // Iff a key is uninitialized, set key to value
    initUnset: function(key, value) {

        if(this.get(key) == null)
            this.set(key, value);
    },


    // Returns a string or an object stored at key
    get: function(key)  {

        try {
            return JSON.parse(localStorage.getItem(key));
        } catch(e)  {
            return localStorage.getItem(key);
        }
    },


    getInt: function(key)   {

        return parseInt(localStorage.getItem(key));
    },


    getFloat: function(key) {

        return parseFloat(localStorage.getItem(key));
    },


    getBool: function(key)  {
        if(localStorage.getItem(key)=='true' || localStorage.getItem(key)=='1')
            return true;
        else if(localStorage.getItem(key)=='false' || localStorage.getItem(key)=='0')
            return false;
        else
            return null;
    },


    key: function(n)    {

        return localStorage.key(n);
    },


    set: function(key, value)    {

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(e)  {
            if(e == QUOTA_EXCEEDED_ERR)
                console.log('localStorage quota exceeded');
        }
    },


    // Sets key to value, iff stored value is smaller
    setHighest: function(key, value)    {

        if(value > this.getFloat(key))
            this.set(key, value);
    },


    remove: function(key)   {

        localStorage.removeItem(key);
    },


    /**
     *  Note, .clear() will clear all local storage data from that origin,
     *  Calling .clear() from www.yourdomain.com/impactgame1 will also clear it from
     *  www.yourdomain.com/impactgame2.
     */
    clear: function()   {

        localStorage.clear();
    }


});

});
