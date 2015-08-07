(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.socioscapes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This internal method tests if a name used for a socioscapes scape, state, layer, or view adheres to naming
 * restrictions.
 *
 * @function isValidName
 * @memberof! socioscapes
 * @param {string} name - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
function isValidName(name) {
    var callback = newDispatcherCallback(arguments),
        isValid = false,
        isReserved = [
            'help',
            // below are reserved JS words and properties
            'abstract',
            'arguments',
            'Array',
            'boolean',
            'break',
            'byte',
            'case',
            'catch',
            'char',
            'class',
            'const',
            'continue',
            'debugger',
            'Date',
            'default',
            'delete',
            'do',
            'double',
            'else',
            'enum',
            'eval',
            'export',
            'extends',
            'false',
            'final',
            'finally',
            'float',
            'for',
            'function',
            'goto',
            'hasOwnProperty',
            'if',
            'implements',
            'import',
            'in',
            'instanceof',
            'int',
            'interface',
            'isFinite',
            'isNaN',
            'isPrototypeOf',
            'Infinity',
            'length',
            'let',
            'long',
            'native',
            'Math',
            'name',
            'new',
            'NaN',
            'Number',
            'null',
            'Object',
            'package',
            'private',
            'protected',
            'prototype',
            'public',
            'return',
            'short',
            'static',
            'super',
            'switch',
            'synchronized',
            'String',
            'this',
            'throw',
            'throws',
            'toString',
            'transient',
            'true',
            'try',
            'typeof',
            'undefined',
            'valueOf',
            'var',
            'void',
            'volatile',
            'while',
            'with',
            'yield'
        ];
    if (name && typeof name === 'string') {
        if (/^[-A-Z0-9]+$/i.test(name)) {
            if (isReserved.indexOf(name) === -1) {
                isValid = true;
            } else {
                console.log('Sorry, "' + name + '" is not a valid name because it is a reserved word. The full list of reserved words is: ' + isReserved);
            }
        } else {
            console.log('Sorry, that is not a valid name. Valid names can only contain letters (a to Z), numbers (0-9), or dashes (-).');
        }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidName;
},{"./../construct/newDispatcherCallback.js":5}],2:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 *
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.includes('scape.sociJson')) {
        isValid = true
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;
},{"./../construct/newDispatcherCallback.js":5}],3:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols.
 *
 * @function isValidUrl
 * @memberof! socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @param [callback] - If the url passes validation, this optional callback can be used to do a server-side check for a
 * resource at that location (allowing you to bypass javascript CORS restrictions).
 * @returns {Boolean}
 */
function isValidUrl(url) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (url) {
            if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
                isValid = true;
            } else {
                //console.log('Sorry, that is not a valid url. Currently, socioscapes supports the HTTP(S) and FTP(S) protocols. Valid URLS must begin with the protocol name followed by an address (eg. "ftp://socioscapes.com/myScape.json", "https://socioscapes.com/myScape.json").');
            }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidUrl;
},{"./../construct/newDispatcherCallback.js":5}],4:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
function newDispatcher() {
    var Dispatcher = function() {
        var _queue = [],
            _queuedItem,
            _servedItem,
            _lastResult,
            _status = true,
            _this,
            _that = this,
            itemServer = function(myItem, myThis, dispatcherCallback) {
                var args = [];
                for (; myItem.myFunction.length > myItem.myArguments.length; myItem.myArguments.push(null)) {}
                for (var i = 0; i < myItem.myArguments.length; i++) {
                    args.push(myItem.myArguments[i]);
                }
                args.push(dispatcherCallback);
                myItem.myFunction.apply(myThis, args);
            };
        this.dispatcher = function (config, callback) {
            if (config) {
                if (config.myFunction && typeof config.myFunction === 'function') {
                    callback = (callback && typeof callback === 'function') ? callback : function (result) { return result };
                    _queue.push({
                        myFunction: config.myFunction, // the function to be called
                        myArguments: config.myArguments, // its arguments
                        myThis: config.myThis, // [optional] arbitrary 'this' value
                        myReturn: config.myReturn, // [optional] arbitrary 'return' value
                        myCallback: callback // [optional] return to context that made this queue request (if callback is requested, the 'real' return value is sent to it but the fake return value is actually returned.
                    });
                    _that.dispatcher();
                }
            }
            if (!config && _status) {
                for (; _queue.length > 0 ;) {
                    if (_status === true) {
                        _status = false;
                        _queuedItem = _queue.shift();
                        _this = (_queuedItem.myThis) ? _queuedItem.myThis:_lastResult;
                        itemServer(_queuedItem, _this, function(result) {
                            if (typeof _queuedItem.myCallback === 'function') {
                                _queuedItem.myCallback(result);
                            }
                            if (_queuedItem.myReturn) {
                                _lastResult = _queuedItem.myReturn;
                            } else {
                                _lastResult = result;
                            }
                            _status = true;
                            _that.dispatcher();
                        });
                    }
                }
            }
        };
        Object.defineProperty(this.dispatcher, 'lastResult', {
            value: function() { return _lastResult }
        });
        Object.defineProperty(this.dispatcher, 'status', {
            value: function() { return _status }
        });
        Object.defineProperty(this.dispatcher, 'queue', {
            value: function() { return _queue }
        });
        Object.defineProperty(this, 'dispatcher', {
            configurable: false
        });
        return this.dispatcher;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;
},{}],5:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
function newDispatcherCallback(argumentsArray) {
    var myCallback;
    if (typeof argumentsArray[argumentsArray.length - 1] === 'function') {
       myCallback = argumentsArray[argumentsArray.length - 1];
    } else {
        myCallback = function(result) {
            return result;
        }
    }
    return myCallback;
}
module.exports = newDispatcherCallback;
},{}],6:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function newGlobal(name, object, overwrite) {
    var callback = newDispatcherCallback(arguments),
        myGlobal = false;
    if (fetchGlobal(name)) {
        if (overwrite) {
            window[name] = object;
            myGlobal = window[name];
        } else {
            console.log('Sorry, a global object called "' + name + '" already exists.');
        }
    } else {
        window[name] = object;
        myGlobal = window[name];
        console.log('Creating a new global object called "' + name + '".');
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGlobal.js":12}],7:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchScapeObject = require ('./../fetch/fetchScapeObject.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeObject = require('./../construct/newScapeObject.js');
/**
 * This
 *
 * @method newMenu
 * @memberof! socioscapes
 * @return
 */
function newScapeMenu(scapeObject) {
    var callback = newDispatcherCallback(arguments),
        myMenu = false,
        ScapeMenu = function(myObject) {
            var that = this,
                mySchema = myObject.meta.schema,
                myContainer = myObject[mySchema.container],
                myParent = myObject.meta.schema.parent,
                myType = mySchema.type,
                newMenu,
                newObject;
            Object.defineProperty(this, 'drop', {
                value: function() {
                    delete window[myObject];
                }
            });
            Object.defineProperty(this, 'test', {
                value: function(option, config) {
                    var myOption = {},
                        myConfig = config || "50";
                    myOption.bq = {
                        id: '2011_census_of_canada',
                        clientId: '424138972496-nlcip7t83lb1ll7go1hjoc77jgc689iq.apps.googleusercontent.com',
                        projectId: '424138972496',
                        queryString: "SELECT Geo_Code, Total FROM [2011_census_of_canada.british_columbia_da] WHERE (Characteristic CONTAINS 'Population in 2011' AND Total IS NOT NULL) GROUP BY Geo_Code, Total, LIMIT " + myConfig + ";"
                    };
                    myOption.wfs = "http://app.socioscapes.com:8080/geoserver/socioscapes/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=cmaname=%27Toronto%27";
                    return myOption[option];
                }
            });
            Object.defineProperty(this, 'meta', {
                value: function() {
                    return  myObject.meta;
                },
                configurable: false
            });
            Object.defineProperty(this, 'new', {
                value: function (name) {
                    name = name || mySchema.name + mySchema.parent.length;
                    myObject.dispatcher({
                            myFunction: newScapeObject,
                            myArguments: [name, myParent, myType]
                        },
                        function (result) {
                            if (result) {
                                newObject = result;
                                newMenu = new ScapeMenu(newObject);
                            }
                        });
                    return newMenu;
                }
            });
            Object.defineProperty(this, 'store', {
                value: ''
            });
            for (var i = 0; i < mySchema.children.length; i++) {
                (function(myChild) {
                    var initValue,
                        defaultName = myChild.item || myChild.container;
                    if (myObject.meta.schema[myChild.container].isMenuItem) { // todo. this should be simplified. right
                    // now, it uses an internal 'schema' map, defined in newScapeSchema, which tells it wether a given
                    // object should have a special menu functionality... it certainly works and allows arbitrary changes
                    // to the resulting menus without editing this file, but it's a bit confusing and can surely be
                    // simplified.
                        initValue = function(cmd, cfg) {
                            myObject.dispatcher({
                                myFunction: myObject.meta.schema[myChild.container].menu,
                                myArguments: [cmd, cfg, myObject[myChild.container]],
                                myThis: myObject
                            },function(result) {
                                if (result) {
                                    return result
                                }
                            });
                            return this
                        };
                    } else {
                        initValue = function(name) {
                            name = name || defaultName;
                            myObject.dispatcher({
                                myFunction: fetchScapeObject,
                                myArguments: [name, myObject]
                            },function(result) {
                                if (result) {
                                    newObject = result;
                                    newMenu = new ScapeMenu(newObject);
                                }
                            });
                            return newMenu;
                        };
                    }
                    Object.defineProperty(that, myChild.name, {
                        value: initValue
                    });
                })(mySchema.children[i]);
            }
            return this;
        };
    if (isValidObject(scapeObject)) {
        myMenu = new ScapeMenu(scapeObject);
    }
    callback(myMenu);
    return myMenu;
}
module.exports = newScapeMenu;
},{"./../bool/isValidObject.js":2,"./../construct/newDispatcherCallback.js":5,"./../construct/newGlobal.js":6,"./../construct/newScapeObject.js":8,"./../fetch/fetchScapeObject.js":15}],8:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeSchema = require('./newScapeSchema.js');
function newScapeObject(name, parent, type) {
    var callback = newDispatcherCallback(arguments),
        schema = newScapeSchema(type),
        myObject = false,
        ScapeObject = function(myName, myParent, mySchema) {
            var that = this,
                myDispatcher = (myParent) ? myParent.dispatcher:newDispatcher();
            Object.defineProperty(this, 'dispatcher', {
                value: myDispatcher
            });
            Object.defineProperty(this, 'meta', {
                value: {},
                enumerable: true
            });
            Object.defineProperty(this.meta, 'author', {
                value: '',
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(this.meta, 'schema', {
                value: mySchema
            });
            Object.defineProperty(this.meta.schema, 'parent', {
                value: myParent || false
            });
            Object.defineProperty(this.meta, 'name', {
                value: myName,
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(this.meta, 'summary', {
                value: '',
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(this.meta, 'type', {
                value: mySchema.type,
                enumerable: true
            });
            Object.defineProperty(this, 'setMeta', {
                value: function (property, value) {
                    if (typeof property === 'string' && typeof value === 'string') {
                        Object.defineProperty(that.meta, property, {
                            value: value,
                            configurable: true,
                            enumerable: true
                        });
                    }
                    return this;
                }
            });
            for (var i = 0; i < mySchema.children.length; i++) {
                if (!that[mySchema.children[i].container]) {
                    Object.defineProperty(that, mySchema.children[i].container, {
                        value: mySchema[mySchema.children[i].container].value || [],
                        enumerable: true
                    });
                }
                if  (mySchema.children[i].item) {
                    that[mySchema.children[i].container].push(new ScapeObject(
                        mySchema.children[i].item,
                        that,
                        newScapeSchema(mySchema.children[i].type)
                    ))
                }
            }
        };
    name = isValidName(name) ? name:false;
    parent = fetchScapeObject(parent);
    if (name) {
        if (parent) {
            if (schema) {
                if (fetchFromScape(name, 'name', parent[schema.container])) {
                    console.log('Fetching existing scape object "' + name + '".');
                    myObject = fetchFromScape(name, 'name', parent[schema.container]);
                } else {
                    console.log('Adding an object called "' + name + '" to the "' + parent.meta.name + '" container.');
                    myObject = new ScapeObject(name, parent, schema);
                    parent[schema.container].push(myObject);
                }
            }
        } else {
            if (fetchScapeObject(name)) {
                console.log('Fetching exisisting scape "' + name + '".');
                myObject = fetchScapeObject(name);
            } else {
                if (!fetchGlobal(name)) {
                    console.log('Creating a new scape called "' + name + '".');
                    myObject = new ScapeObject(name, null, schema);
                    newGlobal(name, myObject);
                } else {
                    console.log('Sorry, a global object external to socioscapes is already associated with that name.')
                }
            }
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = newScapeObject;
},{"./../bool/isValidName.js":1,"./../construct/newDispatcher.js":4,"./../construct/newDispatcherCallback.js":5,"./../construct/newGlobal.js":6,"./../fetch/fetchFromScape.js":11,"./../fetch/fetchGlobal.js":12,"./../fetch/fetchScapeObject.js":15,"./newScapeSchema.js":9}],9:[function(require,module,exports){
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
},{"./../fetch/fetchGoogleBq.js":14,"./../fetch/fetchScapeObject.js":15,"./../fetch/fetchWfs.js":16,"./newDispatcherCallback.js":5}],10:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeObject = require('./../construct/newScapeObject.js'),
    newScapeMenu = require('./../construct/newScapeMenu.js');
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * extendable environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2015 Misaqe Ismailzai
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at
 * the University of Toronto.
 */
if (!Number.isInteger) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
    Number.isInteger = function isInteger (nVal) {
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    };
}
function socioscapes(name) {
    var myScape,
        myMenu;
    name = (isValidName(name)) ? name:'scape0';
    myScape = (fetchScapeObject(name)) ? fetchScapeObject(name):newScapeObject(name, null, 'scape');
    if (myScape) {
        myMenu = newScapeMenu(myScape);
    }
    return myMenu;
}
module.exports = socioscapes;
},{"./../bool/isValidName.js":1,"./../construct/newGlobal.js":6,"./../construct/newScapeMenu.js":7,"./../construct/newScapeObject.js":8,"./../fetch/fetchScapeObject.js":15}],11:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function fetchFromScape(key, metaProperty, array) {
    var callback = newDispatcherCallback(arguments),
        myKey = false;
    if (array) {
        if (Number.isInteger(key)) {
            myKey = (array[key]) ? array[key]:false;
        } else if (isValidName(key)) {
            for (var i = 0; i < array.length; i++) {
                if (key === array[i].meta[metaProperty]) {
                    myKey = array[i];
                }
            }
        }
    }
    callback(myKey);
    return myKey;
}
module.exports = fetchFromScape;
},{"./../bool/isValidName.js":1,"./../construct/newDispatcherCallback.js":5}],12:[function(require,module,exports){
/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function fetchGlobal(name) {
    var callback = newDispatcherCallback(arguments),
        myGlobal = false;
    if (window[name] === undefined) {

    } else {
        myGlobal = window[name];
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = fetchGlobal;
},{"./../construct/newDispatcherCallback.js":5}],13:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This function requests authorization to use a Google API, and if received, loads that API client. For more information
 * on Google APIs, see {@link http://developers.google.com/api-client-library/javascript/reference/referencedocs}.
 *
 * @function fetchGoogleAuth
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for Google APIs.
 * @param {Object} config.auth - Configuration options for the auth request (eg. .client_id, .scope, .immediate)
 * @param {Object} config.client.name - The name of the Google API client to load.
 * @param {Object} config.client.version - The version of the Google API client to load.
 * @param {Function} callback - This is an optional callback that returns the result of the client load.
 * @return this {Object}
 */
function fetchGoogleAuth(config) {
    var callback = newDispatcherCallback(arguments);
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function (result) {
                callback(result);
                return result;
            });
        }
    });
}
module.exports = fetchGoogleAuth;
},{"./../construct/newDispatcherCallback.js":5}],14:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    bqSort = function (bq) {
        var callback = newDispatcherCallback(arguments),
            thisRow = {};
        if (!callback) {
            return;
        }
        callback = (typeof callback === 'function') ? callback : function () { };
        bq.result.rows.forEach(function (row) {
            for (var i = 0; i < row.f.length; i++) {
                thisRow[i] = row.f[i].v;
            }
            callback(thisRow);
        });
    };
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetchScapeObject.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
function fetchGoogleBq(config) {
    var callback = newDispatcherCallback(arguments),
        data = {},
        _clientId = config ? config.clientId:_clientId ,
        _dataId = config ? config.id:_dataId,
        _projectId = config ? config.projectId:_projectId,
        _queryString = config ? config.queryString:_queryString,
        _request,
        _totalRows,
        _values = [],
        _gapiConfig = {
            auth: {
                "client_id": _clientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': _projectId,
                'timeoutMs': '30000',
                'query': _queryString
            }
        };
    callback = (typeof callback === 'function') ? callback : function () { };
    if (config) {
        fetchGoogleAuth(_gapiConfig, function () {
            _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
            _request.execute(function (bqResult) {
                for (var i = 0; i < bqResult.schema.fields.length; i++){
                    data['column'+i] = bqResult.schema.fields[i].name
                }
                _totalRows = parseFloat(bqResult.result.totalRows);
                data.columns = bqResult.schema.fields.length;
                data.rows = _totalRows;
                bqSort(bqResult, function (sortedResult) {
                    _values.push(sortedResult);
                    if (_values.length === _totalRows) {
                        data.values = _values;
                        data.query = _queryString;
                        data.name = _dataId;
                        callback(data);
                        return data;
                    }
                });
            });
        });
    }
}
module.exports = fetchGoogleBq;
},{"./../construct/newDispatcherCallback.js":5,"./fetchGoogleAuth.js":13}],15:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchFromScape = require('./fetchFromScape.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This
 *
 * @method fetcher
 * @memberof! socioscapes
 * @return
 */
function fetchScapeObject(object, parent) {
    var callback = newDispatcherCallback(arguments),
        myParent = (isValidObject(parent)) ? parent:false, // is a valid parent object provided
        myGlobal = (parent) ? false:fetchGlobal(object),// if so, our object should be a prop and not a global
        myName = (isValidName(object)) ? object:false,
        myObject = (isValidObject(object)) ? object:false,
        myUrl = (isValidUrl(parent)) ? parent:false;
    if (myName) {
        if (myUrl) {
            // fetching code here
        }
        if (myParent) {
            if (myParent.states) {
                myObject = fetchFromScape(object, 'name', myParent.states);
            } else if (myParent.layers) {
                myObject = fetchFromScape(object, 'name', myParent.layers);
            } else if (myParent.views) {
                myObject = fetchFromScape(object, 'name', myParent.views);
            }
        }
        if (myGlobal) {
            myObject = (isValidObject(myGlobal)) ? myGlobal: false;
        }
    }
    callback(myObject);
    return(myObject);
}
module.exports = fetchScapeObject;
},{"./../bool/isValidName.js":1,"./../bool/isValidObject.js":2,"./../bool/isValidUrl.js":3,"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGlobal.js":12,"./fetchFromScape.js":11}],16:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson and returns the
 * queried url, the id parameter, and the fetched features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Web Feature Service fetchScapeObject.
 * @param {String} config.url - The Web Feature Service query url.
 * @param {String} config.id - The id property (these values are matched to the values of a corresponding data column).
 * @param {Object} callback - This is a mandatory callback that returns the results of the asynchronous fetchScapeObject.
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
function fetchWfs(url) {
    var callback = newDispatcherCallback(arguments),
        _xobj = new XMLHttpRequest(),
        geom;
    _xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    _xobj.open('GET', url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState == 4 && _xobj.status == "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = url;
            callback(geom);
            return geom;
        }
    };
    _xobj.send(null);
}
module.exports = fetchWfs;
},{"./../construct/newDispatcherCallback.js":5}]},{},[10])(10)
});


//# sourceMappingURL=socioscapes.js.map