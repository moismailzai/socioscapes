/*jslint node: true */
/*global module, require, this*/
'use strict';
/**
 * This method creates socioscape ScapeSchema objects.
 *
 * @function newSchema
 * @return {Object} - A socioscapes ScapeSchema object.
 */
function newSchema() {
    var fetchGoogleBq = newSchema.prototype.fetchGoogleBq,
        fetchWfs = newSchema.prototype.fetchWfs,
        menuClass = newSchema.prototype.menuClass,
        menuRequire = newSchema.prototype.menuRequire,
        menuStore = newSchema.prototype.menuStore,
        menuConfig = newSchema.prototype.menuConfig,
        myVersion = newSchema.prototype.version;
    //
    var ScapeSchema = function() {
        this.structure = {
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
        };
        this.alias = {
            "bq": fetchGoogleBq,
            "wfs": fetchWfs
        };
        this.index = {
            "scape": {
                "class": "scape", "type": "scape.sociJson", "schema": this.structure.scape
            },
            "state": {
                "class": "state", "type": "state.scape.sociJson", "schema": this.structure.scape.state[0]
            },
            "layer": {
                "class": "layer", "type": "layer.state.scape.sociJson" , "schema": this.structure.scape.state[0].layer[0]
            },
            "view": {
                "class": "view", "type": "view.state.scape.sociJson", "schema": this.structure.scape.state[0].view[0]
            }
        };
    };
    return new ScapeSchema();
}
module.exports = newSchema;