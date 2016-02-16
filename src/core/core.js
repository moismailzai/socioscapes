/*jslint node: true */
/*global module, require, document, window, google, gapi*/
'use strict';
var version = '0.6.5-0',
    externalDependencies = ['chroma','geostats'];

/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2016 Misaqe Ismailzai
 *
 * This software was originally conceived as partial fulfilment of the degree requirements for the Masters of Arts in
 * Sociology at the University of Toronto.
 * @global
 * @namespace
 * @param {string} [scapeName=scape0] - The name of an existing scape object to load.
 * creates 'scape0'
 * @return {Object} The socioscapes API interface, which is a @ScapeMenu object.
 */
function socioscapes(scapeName) { // when socioscapes is called, fetch the scape specified (or fetch / create a default scape) and return api menus for it
    var myScape = socioscapes.fn.fetchScape(scapeName || 'scape0') || socioscapes.fn.newScapeObject('scape0', null, 'scape');
    return socioscapes.fn.newScapeMenu(myScape);
}

// lets steal some structure from jQuery and setup socioscapes.prototype to act as a central methods repository, (use
// socioscapes.fn as an alias)
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    chroma: require('chroma-js'),
    geostats: require('./../lib/geostats.min.js'),
    extender: require('./../core/extender'),
    fetchFromScape: require('./../fetch/fetchFromScape.js'),
    fetchGlobal: require('./../fetch/fetchGlobal.js'),
    fetchGoogleAuth: require('./../fetch/fetchGoogleAuth.js'),
    fetchGoogleBq: require('./../fetch/fetchGoogleBq.js'),
    fetchGoogleGeocode: require('./../fetch/fetchGoogleGeocode.js'),
    fetchScape: require('./../fetch/fetchScape.js'),
    fetchScapeSchema: require('./../fetch/fetchScapeSchema.js'),
    fetchWfs: require('./../fetch/fetchWfs.js'),
    isValidName: require('./../bool/isValidName.js'),
    isValidObject: require('./../bool/isValidObject.js'),
    isValidUrl: require('./../bool/isValidUrl.js'),
    menuClass: require('./../menu/menuClass.js'),
    menuConfig: require('./../menu/menuConfig.js'),
    menuRequire: require('./../menu/menuRequire.js'),
    menuStore: require('./../menu/menuStore.js'),
    newCallback: require('./../construct/newCallback.js'),
    newDispatcher: require('./../construct/newDispatcher.js'),
    newEvent: require('./../construct/newEvent.js'),
    newGlobal: require('./../construct/newGlobal.js'),
    newScapeMenu: require('./../construct/newScapeMenu.js'),
    newScapeObject: require('./../construct/newScapeObject.js'),
    newSchema: require('./../construct/newSchema.js'),
    version: version
};

// lets give all our methods (except external dependencies) access to the method repository by setting their prototypes
// to the socioscapes prototype. this way, we can avoid circular dependency nightmares and facilitate extensions loading
// through prototype alteration (which is what the extender method does).
for (var myMethod in socioscapes.fn) {
    if (socioscapes.fn.hasOwnProperty(myMethod) && typeof socioscapes.fn[myMethod] === 'function' && externalDependencies.indexOf(myMethod) === -1) {
        socioscapes.fn[myMethod].prototype = socioscapes.fn;
    }
}

// finally lets initialize the base schema tree
socioscapes.fn.schema = socioscapes.fn.newSchema();

module.exports = socioscapes;