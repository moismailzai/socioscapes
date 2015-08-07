/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    fetchWfs = require('./../fetch/fetchWfs.js');
/**
 * This internal method tests if a name used for a socioscapes scape, state, layer, or view adheres to naming
 * restrictions.
 *
 * @returns {Boolean}
 */
function newScapeConfig(type) {
    var callback = newDispatcherCallback(arguments),
        myObject = false,
        myTypes  = [
            'scape.sociJson',
            'state.scape.sociJson',
            'layer.state.scape.sociJson',
            'view.state.scape.sociJson'
        ],
        myNames  = [
            'scape',
            'state',
            'layer',
            'view'
        ],
        mySchema = {
            "scape": {
                "children": [
                    {
                        "container": "states",
                        "item": "state0",
                        "name": "state",
                        "type": "state.scape.sociJson"
                    }
                ],
                "hasChildren": true,
                "name": "scape",
                "type": "scape.sociJson",
                "states": {
                    "state0": {
                        "container": "states",
                        "children": [
                            {
                                "container": "layers",
                                "item": "layer0",
                                "name": "layer",
                                "type": "layer.state.scape.sociJson"
                            },
                            {
                                "container": "views",
                                "item": "view0",
                                "name": "view",
                                "type": "view.state.scape.sociJson"
                            }
                        ],
                        "layers": {
                            "layer0": {
                                "container": "layers",
                                "children": [
                                    {
                                        "container": "data",
                                        "name": "data"
                                    },
                                    {
                                        "container": "geom",
                                        "name": "geom"
                                    }
                                ],
                                "data": {
                                    "children": [],
                                    "isMenuItem": true,
                                    "menu": function(command, config, myContainer) {
                                        var callback = newDispatcherCallback(arguments),
                                            that = this,
                                            myCommand = {};
                                        myCommand.bq = fetchGoogleBq;
                                        if (myCommand[command]) {
                                            this.dispatcher({
                                                    myFunction: myCommand[command],
                                                    myArguments: [config]
                                                },
                                                function (result) {
                                                    if (result) {
                                                        console.log('Data fetch complete.');
                                                        for (var prop in result) {
                                                            if (result.hasOwnProperty(prop)) {
                                                                myContainer[prop] = result[prop];
                                                            }
                                                        }
                                                    }
                                                });
                                        } else {
                                            console.log('Sorry, "' + command + '" is not a valid fetch function.')
                                        }
                                        callback(this);
                                        return this;
                                    },
                                    "name": "data",
                                    "parent": "layer",
                                    "type": "data.layer.state.scape.sociJson",
                                    "value": {}
                                },
                                "geom": {
                                    "children": [],
                                    "isMenuItem": true,
                                    "menu": function(command, config, myContainer) {
                                        var callback = newDispatcherCallback(arguments),
                                            that = this,
                                            myCommand = {};
                                        myCommand.wfs = fetchWfs;
                                        if (myCommand[command]) {
                                            this.dispatcher({
                                                    myFunction: myCommand[command],
                                                    myArguments: [config]
                                                },
                                                function (result) {
                                                    if (result) {
                                                        console.log('Geometry fetch complete.');
                                                        for (var prop in result) {
                                                            if (result.hasOwnProperty(prop)) {
                                                                myContainer[prop] = result[prop];
                                                            }
                                                        }
                                                    }
                                                });
                                        } else {
                                            console.log('Sorry, "' + command + '" is not a valid fetch function.')
                                        }
                                        callback(this);
                                        return this;
                                    },
                                    "name": "geom",
                                    "parent": "layer",
                                    "type": "geom.layer.state.scape.sociJson",
                                    "value": {}
                                },
                                "name": "layer",
                                "parent": "state",
                                "type": "layer.state.scape.sociJson"
                            }
                        },
                        "name": "state",
                        "parent": "scape",
                        "type": "state.scape.sociJson",
                        "views": {
                            "view0": {
                                "config": {
                                    "children": [],
                                    "isMenuItem": true,
                                    "name": "config",
                                    "parent": "view",
                                    "type": "config.view.state.scape.sociJson",
                                    "value": {}
                                },
                                "container": "views",
                                "children": [
                                    {
                                        "container": "config",
                                        "name": "config"
                                    },
                                    {
                                        "container": "require",
                                        "name": "require"
                                    }
                                ],
                                "name": "view",
                                "parent": "state",
                                "require": {
                                    "children": [],
                                    "isMenuItem": true,
                                    "name": "require",
                                    "parent": "view",
                                    "type": "require.view.state.scape.sociJson",
                                    "value": []
                                },
                                "type": "view.state.scape.sociJson"
                            }
                        }
                    }
                }
            }
        },
        schemaMap = {
            scape: mySchema.scape,
            state: mySchema.scape.states.state0,
            layer: mySchema.scape.states.state0.layers.layer0,
            view: mySchema.scape.states.state0.views.view0
        };
    type =  ( (myTypes.indexOf(type) > -1) ? type.split('.')[0]:false ) ||
            ( (myNames.indexOf(type) > -1) ? type:false );
    if (type) {
        myObject = schemaMap[type];
    }
    callback(myObject);
    return myObject;
}
module.exports = newScapeConfig;