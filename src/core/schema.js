/*jslint node: true */
/*global module, require, this*/
'use strict';
var myVersion = '0.1',
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    menuStore = require('./../menu/menuStore.js'),
    myScapeSchema = {
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
                                "version": myVersion
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
    },
    myScapeSchemaAlias = {
        "bq": fetchGoogleBq,
        "wfs": fetchWfs
    },
    myScapeSchemaIndex = {
        "scape": {
            "class": "scape", "type": "scape.sociJson", "schema": myScapeSchema.scape
        },
        "state": {
            "class": "state", "type": "state.scape.sociJson", "schema": myScapeSchema.scape.state[0]
        },
        "layer": {
            "class": "layer", "type": "layer.state.scape.sociJson" , "schema": myScapeSchema.scape.state[0].layer[0]
        },
        "view": {
            "class": "view", "type": "view.state.scape.sociJson", "schema": myScapeSchema.scape.state[0].view[0]
        }
    };
/**
 * This method creates socioscape schema objects.
 *
 * @memberof socioscapes
 * @return {Object} - A {@link socioscapes} schema object.
 */
function schema() {
    return {
        "structure": myScapeSchema,
        "alias" : myScapeSchemaAlias,
        "index" : myScapeSchemaIndex
    };
}
module.exports = schema();