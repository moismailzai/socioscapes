/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var menuClass = socioscapes.fn.menuClass,
    menuConfig = socioscapes.fn.menuConfig,
    menuStore = socioscapes.fn.menuStore,
    menuRequire = socioscapes.fn.menuRequire,
    newCallback = socioscapes.fn.newCallback;
socioscapes.fn.extend([
        {
            path: 'schema',
            silent: true,
            extension: {}
        },
        {
            path: 'schema/structure',
            silent: true,
            extension:
                { "scape": {
                    "children": [
                        {
                            "class": "[state]"
                        }
                    ],
                    "class": "scape",
                    "menu": menuClass,
                    "name": "scape",
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
                    "type": "scape.sociJson" }
                }
        }]);

socioscapes.fn.extend([
    {
        path: 'schema/alias',
        silent: true,
        extension:
            {
                "bq": socioscapes.fn.fetchGoogleBq,
                "wfs": socioscapes.fn.fetchWfs
            }
    },
    {
        path: 'schema/index',
        silent: true,
        extension:
            {
                "scape": { "class": "scape", "type": "scape.sociJson", "schema": socioscapes.fn.schema.structure.scape},
                "state": { "class": "state", "type": "state.scape.sociJson", "schema": socioscapes.fn.schema.structure.scape.state[0]},
                "layer": { "class": "layer", "type": "layer.state.scape.sociJson" , "schema": socioscapes.fn.schema.structure.scape.state[0].layer[0]},
                "view": { "class": "view", "type": "view.state.scape.sociJson", "schema": socioscapes.fn.schema.structure.scape.state[0].view[0]}
            }
    },
    {
        path: 'fetchScapeSchema',
        silent: true,
        extension:
            function fetchScapeSchema(type) {
                var callback = newCallback(arguments),
                    myObject,
                    index = socioscapes.fn.schema.index;
                type = (type.indexOf('.') > -1) ? type.split('.')[0]:type;
                if (type) {
                    myObject = index[type].schema;
                }
                callback(myObject);
                return myObject;
            }
    }
]);
