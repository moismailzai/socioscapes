/*jslint node: true */
/*global module, require*/
'use strict';
var menuClass = socioscapes.fn.menuClass,
    menuConfig = socioscapes.fn.menuConfig,
    menuData = socioscapes.fn.menuData,
    menuGeom = socioscapes.fn.menuGeom,
    menuRequire = socioscapes.fn.menuRequire,
    newDispatcherCallback = socioscapes.fn.newDispatcherCallback;
socioscapes.fn.coreExtend(
    [
        { path: 'coreSchema', extension: {}
        },
        { path: 'coreSchema/schema', extension: { "scape": {
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
                                "menu": menuData,
                                "value": {}
                            },
                            "geom": {
                                "menu": menuGeom,
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
                                "value": {}
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
                                "value": []
                            },
                            "type": "view.state.scape.sociJson"
                        }
                    ]
                }
            ],
            "type": "scape.sociJson"
        }}}
    ]
);
socioscapes.fn.coreExtend(
    [
        { path: 'coreSchema/classes', extension:
            [
                'scape',
                'state',
                'layer',
                'view'
            ]},
        { path: 'coreSchema/types', extension:
            [
                'scape.sociJson',
                'state.scape.sociJson',
                'layer.state.scape.sociJson',
                'view.state.scape.sociJson'
            ]},
        { path: 'coreSchema/index', extension:
            {
                "scape": socioscapes.fn.coreSchema.schema.scape,
                "state": socioscapes.fn.coreSchema.schema.scape.state[0],
                "layer": socioscapes.fn.coreSchema.schema.scape.state[0].layer[0],
                "view": socioscapes.fn.coreSchema.schema.scape.state[0].view[0]
            }},
        { path: 'newScapeSchema', extension:
            function newScapeSchema(type) {
                var callback = newDispatcherCallback(arguments),
                    isClass,
                    isType,
                    myObject = false,
                    myTypes  = socioscapes.fn.coreSchema.types,
                    myClasses  = socioscapes.fn.coreSchema.classes,
                    index = socioscapes.fn.coreSchema.index;
                isType = (myTypes.indexOf(type) > -1) ? type.split('.')[0]:false;
                isClass = (myClasses.indexOf(type) > -1) ? type:false;
                if (isType || isClass) {
                    myObject = index[isType || isClass];
                }
                callback(myObject);
                return myObject;
            }
        }
    ]
);