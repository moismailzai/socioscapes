/*jslint node: true */
/*global module, require, document, window, google, gapi*/
'use strict';
var version = '0.7.0-0',
    chroma = require('chroma-js'),
    geostats = require('./../lib/geostats.min.js'),
    newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./../fetch/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    menuStore = require('./../menu/menuStore.js'),
    schema = require('./../core/schema.js'),
    fetchScapeSchema = require('./../fetch/fetchScapeSchema.js'),
    newScapeObject = require('./../construct/newScapeObject.js'),
    newScapeMenu = require('./../construct/newScapeMenu.js'),
    extender = require('./../core/extender');
/**
 * @global
 * @namespace socioscapes
 * @param {string} [scapeName=scape0] - The name of an existing scape object to load.
 * creates 'scape0'
 * @return {Object} The socioscapes API interface, which is a @ScapeMenu object.
 */
function socioscapes(scapeName) { // when socioscapes is called, fetch the scape specified (or fetch / create a default scape) and return api menus for it
    var myScape = fetchScape(scapeName || 'scape0') || newScapeObject('scape0', null, 'scape');
    return newScapeMenu(myScape, socioscapes.prototype);
}

// lets steal some structure from jQuery and setup socioscapes.prototype to act as a central methods repository, this
// way external socioscapes extensions will have access to internal socioscapes methods via the prototype
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    chroma: chroma,
    geostats: geostats,
    extender: extender,
    fetchFromScape: fetchFromScape,
    fetchGlobal: fetchGlobal,
    fetchGoogleAuth: fetchGoogleAuth,
    fetchGoogleBq: fetchGoogleBq,
    fetchGoogleGeocode: fetchGoogleGeocode,
    fetchScape: fetchScape,
    fetchScapeSchema: fetchScapeSchema,
    fetchWfs: fetchWfs,
    isValidName: isValidName,
    isValidObject: isValidObject,
    isValidUrl: isValidUrl,
    menuClass: menuClass,
    menuConfig: menuConfig,
    menuRequire: menuRequire,
    menuStore: menuStore,
    newCallback: newCallback,
    newDispatcher: newDispatcher,
    newEvent: newEvent,
    newGlobal: newGlobal,
    newScapeMenu: newScapeMenu,
    newScapeObject: newScapeObject,
    schema: schema,
    version: version
};
module.exports = socioscapes;