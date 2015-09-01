/*jslint node: true */
/*global module, require, document, window, google, gapi*/
'use strict';
var version = '0.6',
    chroma = require('chroma-js'),
    extend = require('./../core/extend'),
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
    geostats = require('./../lib/geostats.min.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuStore = require('./../menu/menuStore.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    socioscapes;
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
    chroma: chroma,
    extend: extend,
    version: version,
    geostats: geostats
};
socioscapes.fn.extend.prototype = socioscapes.fn;
socioscapes.fn.newCallback = newCallback;
socioscapes.fn.newCallback.prototype = socioscapes.fn;
socioscapes.fn.newEvent = newEvent;
socioscapes.fn.newEvent.prototype = socioscapes.fn;
socioscapes.fn.newDispatcher = newDispatcher;
socioscapes.fn.newDispatcher.prototype = socioscapes.fn;
socioscapes.fn.menuStore = menuStore;
socioscapes.fn.menuStore.prototype = socioscapes.fn;
socioscapes.fn.newGlobal= newGlobal;
socioscapes.fn.newGlobal.prototype = socioscapes.fn;
socioscapes.fn.menuRequire = menuRequire;
socioscapes.fn.menuRequire.prototype = socioscapes.fn;
socioscapes.fn.menuStore = menuStore;
socioscapes.fn.menuStore.prototype = socioscapes.fn;
socioscapes.fn.menuConfig = menuConfig;
socioscapes.fn.menuConfig.prototype = socioscapes.fn;
socioscapes.fn.menuClass = menuClass;
socioscapes.fn.menuClass.prototype = socioscapes.fn;
socioscapes.fn.isValidUrl = isValidUrl;
socioscapes.fn.isValidUrl = socioscapes.fn;
socioscapes.fn.isValidName = isValidName;
socioscapes.fn.isValidName.prototype = socioscapes.fn;
socioscapes.fn.isValidObject = isValidObject;
socioscapes.fn.isValidObject.prototype = socioscapes.fn;
socioscapes.fn.fetchWfs = fetchWfs;
socioscapes.fn.fetchWfs.prototype = socioscapes.fn;
socioscapes.fn.fetchScape = fetchScape;
socioscapes.fn.fetchScape.prototype = socioscapes.fn;
socioscapes.fn.fetchGoogleGeocode = fetchGoogleGeocode;
socioscapes.fn.fetchGoogleGeocode.prototype = socioscapes.fn;
socioscapes.fn.fetchGoogleBq = fetchGoogleBq;
socioscapes.fn.fetchGoogleBq.prototype = socioscapes.fn;
socioscapes.fn.fetchGoogleAuth = fetchGoogleAuth;
socioscapes.fn.fetchGoogleAuth.prototype = socioscapes.fn;
socioscapes.fn.fetchGlobal = fetchGlobal;
socioscapes.fn.fetchGlobal.prototype = socioscapes.fn;
socioscapes.fn.fetchFromScape = fetchFromScape;
socioscapes.fn.fetchFromScape.prototype = socioscapes.fn;
socioscapes.fn.schema = {
    structure: {
        "scape": {
            "children": [
                {
                    "class": "[state]"
                }
            ],
                "class": "scape",
                "menu": menuClass,
                "name": "scape0",
                "state": [
                {
                    "class": "state",
                    "children": [
                        {
                            "class": "[layer]"
                        },
                        {
                            "class": "[view]"
                        }
                    ],
                    "layer": [
                        {
                            "children": [
                                {
                                    "class": "data"
                                },
                                {
                                    "class": "geom"
                                }
                            ],
                            "class": "layer",
                            "data": {
                                "menu": menuStore,
                                "value": {}
                            },
                            "geom": {
                                "menu": menuStore,
                                "value": {}
                            },
                            "menu": menuClass,
                            "name": "layer0",
                            "parent": "state",
                            "type": "layer.state.scape.sociJson"
                        }
                    ],
                    "menu": menuClass,
                    "name": "state0",
                    "parent": "scape",
                    "type": "state.scape.sociJson",
                    "view": [
                        {
                            "config": {
                                "menu": menuConfig,
                                "value": {
                                    "breaks": 5, // number of groups the data should be classified into
                                    "classification": "jenks", // the classification formula to use for geostats
                                    "classes": [], // class cut-off values based on the classifictaion formula and number of breaks
                                    "colourScale": "YlOrRd", // the colorbrew colorscale to use for chroma
                                    "featureIdProperty": "dauid", // the feature's unique id, used to match geometery features with corresponding data values
                                    "layer": 0, // the name or array id to fetch data and geometry from
                                    "type": "", // the type of view
                                    "valueIdProperty": "total", // the primary property to use when visualizing data
                                    "version": socioscapes.fn.version
                                }
                            },
                            "children": [
                                {
                                    "class": "config"
                                },
                                {
                                    "class": "require"
                                }
                            ],
                            "class": "view",
                            "menu": menuClass,
                            "name": "view0",
                            "parent": "state",
                            "require": {
                                "menu": menuRequire,
                                "value": {
                                    "layers": {}, // a list of layer's in the state's layer array that store values for this view
                                    "modules": {} // a list of modules required for this view
                                }
                            },
                            "type": "view.state.scape.sociJson"
                        }
                    ]
                }
            ],
                "type": "scape.sociJson"
        }
    }
};
socioscapes.fn.schema.alias = {
    "bq": socioscapes.fn.fetchGoogleBq,
    "wfs": socioscapes.fn.fetchWfs
};
socioscapes.fn.schema.index = {
    "scape": { "class": "scape", "type": "scape.sociJson", "schema": socioscapes.fn.schema.structure.scape},
    "state": { "class": "state", "type": "state.scape.sociJson", "schema": socioscapes.fn.schema.structure.scape.state[0]},
    "layer": { "class": "layer", "type": "layer.state.scape.sociJson" , "schema": socioscapes.fn.schema.structure.scape.state[0].layer[0]},
    "view": { "class": "view", "type": "view.state.scape.sociJson", "schema": socioscapes.fn.schema.structure.scape.state[0].view[0]}
};
socioscapes.fn.fetchScapeSchema = require('./../fetch/fetchScapeSchema.js');
socioscapes.fn.fetchScapeSchema.prototype = socioscapes.fn;
socioscapes.fn.newScapeObject = require('./../construct/newScapeObject.js');
socioscapes.fn.newScapeObject.prototype = socioscapes.fn;
socioscapes.fn.newScapeMenu = require('./../construct/newScapeMenu.js');
socioscapes.fn.newScapeMenu.prototype = socioscapes.fn;
socioscapes.fn.init = require('./../core/init.js');
socioscapes.fn.init.prototype = socioscapes.fn;
module.exports = socioscapes;