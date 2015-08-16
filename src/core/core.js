/*jslint node: true */
/*global module, require*/
'use strict';
var socioscapes,
    chroma = require('chroma-js'),
    geostats = require('./../lib/geostats.min.js'),
    version = '0.5.6',
    extend = require('./extend.js'),
    newCallback = require('./../construct/newCallback.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newEvent = require('./../construct/newEvent.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchGoogleGeocode = require('./../fetch/fetchGoogleGeocode.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuStore = require('./../menu/menuStore.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    newGlobal = require('./../construct/newGlobal.js');
/**
 * The socioscapes structure is inspired by the jQuery team's module management system. To extend socioscapes, you
 * simply need to call 'socioscapes.extend' and provide an array of entries that are composed of an object with
 * '.path' (a string), and '.extension' (a value) members. The '.path' tells the API where to store your extension. The
 * path for most modules will be the root path, which is socioscapes.fn. The name of your module should be prefixed such
 * that existing elements can access it. For instance, if you have created a new module that retrieves data from a
 * MySql server, you'd want to use the 'fetch' prefix (eg. 'fetchMysql'). This convention not only allows for a clean
 * ecosystem, under the hood socioscapes will ensure that your module is integrated with all other modules which accept
 * data fetchers.
 * */
socioscapes = function(name) {
    return socioscapes.fn.init(name);
};
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    extend: extend,
    chroma: chroma,
    geostats: geostats,
    newEvent: newEvent,
    fetchFromScape: fetchFromScape,
    fetchGlobal: fetchGlobal,
    fetchGoogleAuth: fetchGoogleAuth,
    fetchGoogleBq: fetchGoogleBq,
    fetchGoogleGeocode: fetchGoogleGeocode,
    fetchScape: fetchScape,
    fetchWfs: fetchWfs,
    init: function() {  },
    isValidObject: isValidObject,
    isValidName: isValidName,
    isValidUrl: isValidUrl,
    menuClass: menuClass,
    menuConfig: menuConfig,
    menuStore: menuStore,
    menuRequire: menuRequire,
    newCallback: newCallback,
    newDispatcher: newDispatcher,
    newGlobal: newGlobal,
    version: version
};
socioscapes.fn.newGlobal('socioscapes', socioscapes, true);
module.exports = socioscapes;