(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.socioscapes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function newDispatcher(myObject) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        myDispatcher;
    myDispatcher = function(myObject) {
        var _currentItem = {},
            _isReady = true,
            _queue = [];
        Object.defineProperty(myObject, 'dispatch', {
            get:function() {
                for (;_queue.length > 0 && _isReady === true;) {
                    _isReady = false;
                    _currentItem = _queue.shift();
                    _currentItem(function() {
                        _isReady = true;
                    });
                }
            },
            set:function(config) {
                if (config && typeof config.myFunction === 'function') {
                    var myQueueItem = function(callback) {
                        var myArguments = [];
                        for (var i = 0; i < config.myArguments.length; i++) {
                            myArguments.push(config.myArguments[i]);
                        }
                        myArguments.push(callback);
                        config.myFunction.apply(config.myThis, myArguments);
                        callback();
                    };
                    _queue.push(myQueueItem);
                    myObject.dispatch;
                }
            }
        });
    };
    if (!myObject) {
        console.log('Sorry, you did not provide an object to attach the dispatcher to.');
    } else if (myObject && myObject.dispatcher) {
        console.log('Sorry, a dispatcher already exists for this object.');
    } else {
        myDispatcher(myObject);
        callback(myObject);
        return(myObject);
    }
};
},{}],2:[function(require,module,exports){
isGlobal = require('./../core/isGlobal.js');
module.exports = function newGlobal(name, object) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        myGlobal = false;
    if (isGlobal(name)) {
        console.log('Sorry, a global object by that name already exists.');
    } else {
        window[name] = object;
        myGlobal = window[name];
    }
    callback(myGlobal);
    return myGlobal;
};
},{"./../core/isGlobal.js":7}],3:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var isValidName = require('./../core/isValidName.js'),
    isKey = require('./../core/isKey.js');
/**
 * This constructor method returns a new object of class {@linkcode MyLayer}.
 *
 * Requires the modules {@link https://github.com/gka/lChroma.js}, {@link https://github.com/simogeo/geostats}, and
 * {@linkcode module:myPolyfills}.
 *
 * @method newLayer
 * @memberof! socioscapes
 * @return {Object} MyLayer        MyLayer = function () {
 */
module.exports = function newLayer(name, layers, config) {
    var MyLayer,
        callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson.state';
    if (isValidName(name) && !isKey(name, 'name', layers)) {
        /**
         * Each MyLayer consists of the two store members {@linkcode MyLayer.data} and {@linkcode MyLayer.geom}, and the
         * configuration members {@linkcode MyLayer.breaks}, {@linkcode MyLayer.classes}, {@linkcode MyLayer.classification},
         * {@linkcode MyLayer.colourscale}, {@linkcode MyLayer.domain}, {@linkcode MyLayer.geostats}, and
         * {@linkcode MyLayer.status}.
         *
         * @namespace MyLayer
         */
        MyLayer = function () {
            var newEvent,
                _myBreaks = 5,
                _myClasses,
                _myClassification = 'getJenks',
                _myColourscaleName = "YlOrRd",
                _myColourScaleFunction,
                _myData,
                _myDomain,
                _myGeom,
                _myGeostats,
                _myLayerStatus = {},
                _myViews = {},
                _myStatus,
                _myStatusList,
                that = this;
            Object.defineProperty(_myLayerStatus, 'breaks', {
                value: false,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'classification', {
                value: true,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'colourscale', {
                value: true,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'data', {
                value: false,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'domain', {
                value: false,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'geom', {
                value: false,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'geostats', {
                value: false,
                configurable: true
            });
            Object.defineProperty(_myLayerStatus, 'readyGis', {
                value: false,
                configurable: true
            });
            /**
             * This function fires an arbitrary event. Socioscapes objects use it to help trigger view renders.
             *
             * @function newEvent
             * @memberof! socioscapes
             * @param {String} name - The name of the new event (this is what your event handler will listen for).
             * @param {String} message - The content of the event.
             * @return this {Object}
             */
            newEvent = function (name, message) {
                new CustomEvent(
                    name,
                    {
                        detail: {
                            message: message,
                            time: new Date()
                        },
                        bubbles: true,
                        cancelable: true
                    }
                );
            };
            /**
             * This method returns a boolean status for each configurable member of {@linkcode MyLayer}.
             *
             * @method status
             * @memberof! MyLayer
             */
                //TODO add better documentation for the event triggering system.
            Object.defineProperty(this, 'status', {
                value: function (name, state) {
                    if (!name) {
                        _myStatusList = '';
                        for (var _myLayerProperty in _myLayerStatus) {
                            if (_myLayerStatus.hasOwnProperty(_myLayerProperty)) {
                                _myStatus = _myLayerStatus[_myLayerProperty];
                                _myStatusList = _myStatusList.concat(_myLayerProperty + ' = ' + _myStatus + ', ');
                            }
                        } //TODO fix the trailing comma issue once I get the logic here working properly.
                        newEvent('statusEvent', 'statusReturn: The statuses of all properties in ' + that.constructor.name + ' are: ' + _myStatusList + '.');
                        return _myLayerStatus
                    }
                    if (typeof _myLayerStatus[name] === 'boolean' && !state) {
                        newEvent('statusEvent', 'statusReturn: The statuses of property ' + name + ' in layer ' + that.constructor.name + ' is: ' + _myLayerStatus[name] + '.');
                        return _myLayerStatus[name]
                    }
                    if (typeof _myLayerStatus[name] === 'boolean' && typeof state === 'boolean') {
                        delete _myLayerStatus[name];
                        Object.defineProperty(_myLayerStatus, name, {
                            value: state,
                            configurable: true
                        });
                        newEvent('statusEvent', 'statusSet: Set the state of property ' + name + ' in layer ' + that.constructor.name + ' to: ' + state + '.');
                        if (_myLayerStatus.breaks &&
                            _myLayerStatus.classification &&
                            _myLayerStatus.colourscale &&
                            _myLayerStatus.data &&
                            _myLayerStatus.geom) {
                            delete _myLayerStatus.readyGis;
                            Object.defineProperty(_myLayerStatus, 'statusGis', {
                                value: true,
                                configurable: true
                            });
                            newEvent('statusEvent', 'statusGis: The layer ' + that.attributes["name"].value + ' is ready to be mapped.');
                        }
                    }
                }
            });
            /**
             * This method sets the data store of the the associated {@linkcode MyLayer}. If the fetch is succesful,
             * MyLayer.status('data') and MyLayer.status('geostats') will both return true. If no parameters are provided,
             * the method returns the currently stored data values, if any exist.The method can take two parameters, the
             * first can be a string name for any valid socioscapes data fetcher, a function that returns a valid
             * {@linkcode socioscapes-data-object}, or a valid {@linkcode socioscapes-data-object}. The second parameter
             * should be an object that provides all necessary configuration options for the first.
             *
             * @example
             * // calls socioscapes.fetchGoogleBq and passes the 'config' object as parameter.
             * MyLayer.data('fetchGoogleBq', config)
             *
             * @example
             * // calls myFetchFunction and passes the 'config' object as parameter.
             * MyLayer.data(myFetchFunction, config)
             *
             * @example
             * // returns _myData.values
             * MyLayer.data()
             *
             * @method data
             * @memberof! MyLayer
             * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-data-object} and
             * status boolean (result, success).
             * @parameter {object} config - All arguments that the fetcher method requires.
             */
            Object.defineProperty(this, 'data', {
                value: function (fetcher, config) {
                    //set the statuses for data and geostats to false so that any dom components that react to a fully
                    //ready status state can do what they need to do when these objects are not ready (eg. go from a green
                    // 'ready' button to a faded red 'loading' button.
                    var _statusBackupData = _myLayerStatus.data,
                        _statusBackupGeostats = _myLayerStatus.geostats;
                    if (!fetcher || !config) {
                        return _myData.values;
                    }
                    if (fetcher && config && typeof fetcher === "function") {
                        that.status('data', false);
                        that.status('geostats', false);
                        fetcher(config, function (result) {
                            if (typeof result.values[0] !== 'number') {
                                alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                                that.status('data', _statusBackupData);
                                that.status('data', _statusBackupGeostats);
                                return
                            }
                            _myData = result;
                            _myGeostats = new Geostats(result.values);
                            that.status('data', true);
                            that.status('geostats', true);
                        });
                    } else if (fetcher && !config && typeof fetcher === "object") {
                        if (fetcher.url && fetcher.id && fetcher.values) {
                            if (typeof result.values[0] !== 'number') {
                                alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                                that.status('data', _statusBackupData);
                                that.status('data', _statusBackupGeostats);
                                return
                            }
                            that.status('data', false);
                            that.status('geostats', false);
                            _myData = fetcher;
                            _myGeostats = new Geostats(result.values);
                            that.status('data', true);
                            that.status('geostats', true);
                        }
                    } else if (fetcher && config && typeof fetcher === "string") {
                        if (typeof socioscapes[fetcher] === "function") {
                            that.status('data', false);
                            that.status('geostats', false);
                            socioscapes[fetcher](config, function (result) {
                                if (typeof result.values[0] !== 'number') {
                                    alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                                    that.status('data', _statusBackupData);
                                    that.status('data', _statusBackupGeostats);
                                    return
                                }
                                _myData = result;
                                _myGeostats = new Geostats(result.values);
                                that.status('data', true);
                                that.status('geostats', true);
                            });
                        }
                    } else {
                        that.status('data', _statusBackupData);
                        that.status('data', _statusBackupGeostats);
                    }
                }
            });
            /**
             * This method sets the geom store of {@linkcode MyLayer}. If the fetch is successful, MyLayer.status('geom')
             * will return true. If no parameters are provided, the method returns the currently stored geom features, if
             * any exist. The method can take two parameters, the first can be a string name for any valid socioscapes data
             * fetcher, a function that returns a valid {@linkcode socioscapes-geom-object}, or a valid
             * {@linkcode socioscapes-geom-object}. The second parameter should be an object that provides all necessary
             * configuration options for the first.
             *
             * @example
             * // Calls socioscapes.fetchWfs and passes the 'config' object as parameter.
             * MyLayer.geom(s.fetchWfs, config)
             *
             * @example
             * // calls myFetchFunction and passes the 'config' object as parameter.
             * MyLayer.geom(myFetchFunction, config)
             *
             * @example
             * // returns _myGeom.features
             * MyLayer.geom()
             *
             * @method geom
             * @memberof! MyLayer
             * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-geom-object} and a
             * status boolean (result, success).
             * @parameter {object} config - All arguments that the fetcher method requires.
             */
            Object.defineProperty(this, 'geom', {
                value: function (fetcher, config) {
                    var _statusBackup = _myLayerStatus.geom;
                    if (!fetcher || !config) {
                        return _myGeom.features;
                    }
                    if (fetcher && config && typeof fetcher === "function") {
                        that.status('geom', false);
                        fetcher(config, function (geom) {
                            _myGeom = geom;
                            that.status('geom', true);
                            that.status('geom', _statusBackup);
                        });
                    } else if (fetcher && !config && typeof fetcher === "object") {
                        if (fetcher.url && fetcher.id && fetcher.features) {
                            that.status('geom', false);
                            _myGeom = fetcher;
                            that.status('geom', true);
                        }
                    } else if (fetcher && config && typeof fetcher === "string") {
                        if (typeof socioscapes[fetcher] === "function") {
                            that.status('geom', false);
                            socioscapes[fetcher](config, function (geom) {
                                _myGeom = geom;
                                that.status('geom', true);
                            });
                        }
                    }
                }
            });
            /**
             * This method sets the number of breaks for the data in {@linkcode MyLayer}. This setting, along with
             * {@linkcode MyLayer.classification} and {@linkcode MyLayer.colourscale} constitute the core GIS visualization
             * settings. See {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/html/comp_class.html} for general
             * information about geospatial classification and groupings.
             *
             * @example
             * // sets three breaks
             * MyLayer.breaks(3)
             *
             * @method breaks
             * @memberof! MyLayer
             * @parameter {integer} breaks - The number of groups for the layer's symbology. Typically, this is set to < = 5.
             */
            Object.defineProperty(this, 'breaks', {
                value: function (breaks) {
                    if (!breaks) {
                        return _myBreaks;
                    }
                    if (Number.isInteger(breaks)) {
                        _myBreaks = breaks;
                        that.status('breaks', true);
                    }
                }
            });
            /**
             * This method is used to set a colour scale and to calculate colours for individual data points based on that
             * scale. socioscapes includes support for all valid colourbrew colour scales {@link http://colorbrewer2.org/}.
             * This setting, along with {@linkcode MyLayer.breaks} and {@linkcode MyLayer.classifications} constitute the
             * core GIS visualization settings. See {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/47_f.html} for
             * general information about geospatial visualization.
             *
             * @example
             * // returns the hexadecimal value for '100' given the ColourBrew spectrum 'YlOrRd' and five breaks.
             * MyLayer.breaks(5)
             * MyLayer.colourscale('SET', 'YlOrRd')
             * MyLayer.colourscale('GET HEX', 100)
             *
             * @example
             * // returns the current colourscale name
             * MyLayer.colourscale()
             *
             * @method colourscale
             * @memberof! MyLayer
             * @parameter {string} action - Can be 'SET', 'GET HEX', or 'GET INDEX'.
             * @parameter {number} value - Any value that falls within the bounds of {@linkcode MyLayer.data}.
             */
            Object.defineProperty(this, 'colourscale', {
                value: function (action, value) {
                    if (action === 'SET') {
                        that.status('colourscale', false);
                        _myColourscaleName = value;
                        that.status('colourscale', true);
                    }
                    if (action === 'GET HEX' && value) {
                        _myColourScaleFunction = chroma.scale(_myColourscaleName).domain(_myDomain).out('hex');
                        return _myColourScaleFunction(value);
                    }
                    if (action === 'GET INDEX' && value) {
                        _myColourScaleFunction = chroma.scale(_myColourscaleName).domain(_myDomain, _myBreaks).colors();
                        return _myColourScaleFunction(value);
                    }
                    return _myColourscaleName;
                }
            });
            /**
             * This method classifies {@linkcode MyLayer.data} based on a geostats classification function. See
             * {@link https://github.com/simogeo/geostats} for more on geostats classification functions and
             * {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/47_f.html} for general data classification guidelines.
             *
             * @example
             * // set classification to Jenks
             * MyLayer.classification('getEqInterval')
             *
             * @example
             * // set classification to standard deviation and change breaks to 3
             * MyLayer.classification('getStdDeviation', 3)
             *
             * @method classification
             * @memberof! MyLayer
             * @parameter {string} classification - Any valid geostats classification function.
             * @parameter {integer} [breaks] - The number of classifications for the layer symbology. Convention suggests
             * setting this to < = 5.
             */
            Object.defineProperty(this, 'classification', {
                value: function (classification, breaks) {
                    var i;
                    if (!classification) {
                        return _myClassification;
                    }
                    if (_myData && _myGeostats[classification]) {
                        console.log('yes');
                        that.status('breaks', false);
                        that.status('classification', false);
                        that.status('domain', false);
                        if (breaks) {
                            that.breaks(breaks);
                        }
                        _myDomain = [];
                        _myClassification = {};
                        _myClassification.name = classification;
                        _myClassification.classes = _myGeostats[classification](_myBreaks);
                        for (i = 0; i < _myBreaks; i++) {
                            _myDomain.push(parseFloat(_myClasses[i]));
                        }
                        that.status('breaks', true);
                        that.status('domain', true);
                        that.status('classification', true);
                    }
                }
            });
            /**
             * This method returns the data domain. The data domain stores the spread of the data and is used in many GIS
             * calculations.
             *
             * @method domain
             * @memberof! MyLayer
             */
            Object.defineProperty(this, 'domain', {
                value: function () {
                    return _myDomain;
                }
            });
            /**
             * This container stores the {@linkcode MyLayer} instance's geostats object. It is calculated each time
             * {@linkcode MyLayer.data} is successfully set. See {@link https://github.com/simogeo/geostats} for more on
             * geostats
             *
             * @member geostats
             * @memberof! MyLayer
             */
            Object.defineProperty(this, 'geostats', {
                value: _myGeostats
            });
            /**
             * This method gets or sets a new view based on {@linkcode MyLayer}'s {@linkcode MyLayer.data} and
             * {@linkcode MyLayer.geom} stores. Views associated with {@linkcode MyLayer} share the same
             * {@linkcode MyLayer.data} and {@linkcode MyLayer.geom} but can each visualize the values in those stores in
             * unique and complimentary ways.
             *
             * @member views
             * @memberof! MyLayer
             */
            Object.defineProperty(this, 'views', {
                value: function (viewName, viewFunction, viewConfig) {
                    if (!viewName) {
                        return _myViews;
                    }
                    if (viewName && !viewFunction) {
                        if (_myViews[viewName]) {
                            _myViews[viewName]();
                        } else {
                            return _myViews;
                        }
                    }
                    if (_myViews[viewName] && viewFunction === "DELETE") {
                        delete(_myViews[viewName]);
                        return _myViews;
                    }
                    Object.defineProperty(_myViews, viewName, {
                        value: viewFunction(viewConfig),
                        enumerable: true,
                        configurable: true
                    });
                }
            });
        };
        layers.push(new MyLayer);
    } else {
        console.log('Sorry, unable to create a new layer called "' + name + '" (does a scape by that name already exist?).');
    }
    callback(layers);
    return layers;
};
},{"./../core/isKey.js":8,"./../core/isValidName.js":9}],4:[function(require,module,exports){
/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
var newDispatcher = require ('./../construct/newDispatcher.js'),
    state = require ('./../core/state.js'),
    layer = require ('./../core/layer.js'), // shortcut to socioscapes('myScape').state(0).layer
    view = require ('./../core/view.js'), // shortcut to socioscapes('myScape').state(0).layer(0).view
    isValidName = require('./../core/isValidName.js'),
    isValidUrl = require('./../core/isValidUrl.js'),
    fetchLayer = require('./../fetch/fetchLayer.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchState = require('./../fetch/fetchState.js'),
    fetchView = require('./../fetch/fetchView.js'),
    newScape = require('./../construct/newScape.js'),
    newState = require('./../construct/newState.js'),
    storeScape = require('./../store/storeScape.js'),
    storeState = require('./../store/storeState.js'),
    removeState = require('./../remove/removeState.js');

/**
 *  This is the root socioscapes namespace and object. socioscapes is stateless and does not store any session
 *  variables within its members (each call to socioscapes generates the same generic object).
 *
 * Requires the modules {@link newDispatcher}, {@link state}, {@link layer}, {@link view}, {@link isValidName},
 * {@link isValidUrl}, {@link fetchLayer}, {@link fetchScape}, {@link fetchState}, {@link fetchView},
 * {@link newScape}, {@link newState}, s{@link storeScape}, {@link storeState}, and {@link removeState}.
 *
 * @namespace socioscapes
 * @requires newDispatcher
 * @requires state
 * @requires layer
 * @requires view
 * @requires isValidName
 * @requires isValidUrl
 * @requires fetchLayer
 * @requires fetchScape
 * @requires fetchState
 * @requires fetchView
 * @requires newScape
 * @requires newState
 * @requires storeScape
 * @requires storeState
 * @requires removeState
 */
module.exports = function newS(myScape) {
    var myS = {};
    Object.defineProperty(myS, '_myScape', {
        value: myScape
    });
    Object.defineProperty(myS, 'fetchScape', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: fetchScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'newScape', {
        value: function() {
            console.log(myScape);
            myScape.dispatch = {
                myThis: myS,
                myFunction: newScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'storeScape', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: storeScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'fetchState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: fetchState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'newState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: newState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'removeState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: removeState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'storeState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: storeState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'state', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: state,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'layer', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: layer,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'view', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: view,
                myArguments: arguments
            };
        }
    });
    return myS;
};
},{"./../construct/newDispatcher.js":1,"./../construct/newScape.js":5,"./../construct/newState.js":6,"./../core/isValidName.js":9,"./../core/isValidUrl.js":10,"./../core/layer.js":11,"./../core/state.js":13,"./../core/view.js":14,"./../fetch/fetchLayer.js":15,"./../fetch/fetchScape.js":16,"./../fetch/fetchState.js":17,"./../fetch/fetchView.js":18,"./../remove/removeState.js":19,"./../store/storeScape.js":20,"./../store/storeState.js":21}],5:[function(require,module,exports){
var isValidName = require('./../core/isValidName.js'),
    isGlobal = require('./../core/isGlobal.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newState = require('./../construct/newState.js');
module.exports = function newScape(name, config) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson',
        myScape = (isGlobal(name)) ? true:false;
    if (isValidName(name) && !myScape) {
        myScape = {};
        Object.defineProperty(myScape, 'meta', {
            value: {}
        });
        Object.defineProperty(myScape.meta, 'author', {
            get: function(){ return _author},
            set: function(author) {_author = author}
        });
        Object.defineProperty(myScape.meta, 'name', {
            get: function(){ return _name},
            set: function(name) {_name = name }
        });
        Object.defineProperty(myScape.meta, 'summary', {
            get: function(){ return _summary},
            set: function(summary) {_summary = summary}
        });
        Object.defineProperty(myScape.meta, 'type', {
            get: function(){ return _type},
            set: function(type) {_type = type}
        });
        Object.defineProperty(myScape.meta, 'source', {
            get: function(){ return _source},
            set: function(source) {_source = source}
        });
        Object.defineProperty(myScape, 'states', {
            value: []
        });
        newState('state0', myScape.states, function(myState){
            myScape.states.push(myState);
            newGlobal(name, myScape);
        });
    } else {
        console.log('Sorry, unable to create a new scape called "' + name + '" (does a scape by that name already exist?).')
    }
    callback(myScape);
    return myScape;
};
},{"./../construct/newGlobal.js":2,"./../construct/newState.js":6,"./../core/isGlobal.js":7,"./../core/isValidName.js":9}],6:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var isValidName = require('./../core/isValidName.js'),
    isKey = require('./../core/isKey.js'),
    newLayer = require('./../construct/newLayer.js');
/**
 * This constructor method returns an object of class {@linkcode MyState}.
 *
 * @method newState
 * @memberof! MyState
 * @return {Object} MySession
 */
module.exports = function newState(name, states, config) {
    var myState = {},
        callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson.state';
    if (isValidName(name) && !isKey(name, 'name', states)) {
        Object.defineProperty(myState, 'meta', {
            value: {}
        });
        Object.defineProperty(myState.meta, 'author', {
            get: function() { return _author },
            set: function(author) {_author = author}
        });
        Object.defineProperty(myState.meta, 'name', {
            get: function() { return _name },
            set: function(name) {_name = name }
        });
        Object.defineProperty(myState.meta, 'summary', {
            get: function() { return _summary },
            set: function(summary) {_summary = summary}
        });
        Object.defineProperty(myState.meta, 'type', {
            get: function() { return _type },
            set: function(type) {_type = type}
        });
        Object.defineProperty(myState, 'source', {
            get: function() { return _source },
            set: function(source) {_source = source}
        });
        Object.defineProperty(myState, 'layers', {
            value: []
        });
        newLayer('layer0', myState.layers, function(myLayer){
            myState.layers.push(myLayer);
        });
    } else {
        console.log('Sorry, unable to create a new state called "' + name + '" (does a state by that name already exist?).');
    }
    callback(myState);
    return myState;
};
},{"./../construct/newLayer.js":3,"./../core/isKey.js":8,"./../core/isValidName.js":9}],7:[function(require,module,exports){
module.exports = function isGlobal(name) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        global = false;
    if (window[name]) {
        global = true;
    }
    callback(global);
    return global;
};
},{}],8:[function(require,module,exports){
module.exports = function isKey(key, member, array) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    for (var i = 0; i < array.length; i++) {
        if (key === array[i][member]) {
            callback(true);
        }
    }
    callback(false);
};
},{}],9:[function(require,module,exports){
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
module.exports = function isValidName(name) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
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
    if (typeof name === 'string' && /^[-A-Z0-9]+$/i.test(name)) { // if 'name' is a string and matches the regex pattern
        if (isReserved.indexOf(name) === -1) {
            isValid = true;
        } else { // and doesn't match a reserved word, then it is valid
            console.log('Sorry, "' + name + '" is not a valid name because it is a reserved word. The full list of reserved words is: ' + isReserved);
        }
    } else {
        console.log('Sorry, that is not a valid name. Valid names can only contain letters (a to Z), numbers (0-9), or dashes (-).');
    }
    callback(isValid);
    return isValid;
};
},{}],10:[function(require,module,exports){
/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols. CORS prevents javascript
 * from fetching a resource that does not exist on the same domain, however, once-validated the url may be tested if a
 * callback is provided (presumably the callback would utilize a server-side script to test the url). If a callback is
 * not provided, isValidUrl returns its validation results as a boolean, otherwise it returns the results of the
 * callback. Since socioscapes methods and objects expect isValidUrl to return a boolean, you should ensure that your
 * callback returns one (non-boolean results are ignored).
 *
 * @function isValidUrl
 * @memberof! socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @param [callback] - If the url passes validation, this optional callback can be used to do a server-side check for a
 * resource at that location (allowing you to bypass javascript CORS restrictions).
 * @returns {Boolean}
 */
module.exports = function isValidUrl(url) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    // Regex taken almost verbatim from TLindig @ http://stackoverflow.com/a/18593669/4612922
    var isValid;
    if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
        isValid = true;
        if (callback) {
            callback(url, function(urlExists) {
                if (typeof urlExists === 'boolean') {
                    isValid = urlExists;
                } else {
                    console.log('Sorry, the callback did not produce a valid (boolean) result.');
                }
            });
        }
    } else {
        isValid = false;
        console.log('Sorry, that is not a valid url. Currently, socioscapes supports the HTTP(S) and FTP(S) protocols. Valid URLS must begin with the protocol name followed by an address (eg. "ftp://socioscapes.com/myScape.json", "https://socioscapes.com/myScape.json").');
    }
    callback(isValid);
    return isValid;
};
},{}],11:[function(require,module,exports){
/*jslint node: true */
/*global myLayer, module, google, require, define, define.amd*/
'use strict';
/**
 * This
 *
 * @method layer
 * @memberof! socioscapes
 * @return
 */
module.exports = function layer(myLayer) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        that = this;
    Object.defineProperty(this, 'newViewGmap', {
        value: function(myViewName) {
            if (!myLayer.views[myViewName]) {
                newViewGmap(myLayer, myViewName);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" already exists in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'newViewDatatable', {
        value: function(myViewName) {
            if (!myLayer.views[myViewName]) {
                newViewDatatable(myLayer, myViewName);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" already exists in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'removeView', {
        value: function(myViewName) {
            if (myLayer.views[myViewName]) {
                delete myLayer.views[myViewName];
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" does not exist in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'listViews', {
        value: myState.views
    });
    Object.defineProperty(this, 'views', {
        value: function(myViewName) {
            if (myLayer.views[myViewName]) {
                layer.call(that.views(myViewName), myLayer.views[myViewName]);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" does not exist in this layer.');
            }
        }
    });
    callback();
    return;
};
},{}],12:[function(require,module,exports){
/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
if (!Number.isInteger) {
    Number.isInteger = function isInteger (nVal) {
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    };
}
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
var newDispatcher = require ('./../construct/newDispatcher.js'),
    newS = require ('./../construct/newS'),
    fetchScape = require('./../fetch/fetchScape.js');

module.exports = function socioscapes(name) {
    var myScape = fetchScape(name) || {};
    newDispatcher(myScape);
    return newS(myScape);
};
},{"./../construct/newDispatcher.js":1,"./../construct/newS":4,"./../fetch/fetchScape.js":16}],13:[function(require,module,exports){
/*jslint node: true */
/*global myState, module, google, require, define, define.amd*/
'use strict';
var newLayer = require ('./../construct/newLayer.js'),
    layers = require ('./layer.js');
/**
 * This
 *
 * @method state
 * @memberof! socioscapes
 * @return
 */
module.exports = function state(myScape, myState) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        that = this;
    Object.defineProperty(this, 'newLayer', {
        value: function(myLayerName) {
            if (!myState.layers[myLayerName]) {
                newLayer(myState, myLayerName);
            } else {
                console.log('Sorry, a layer by the name of "' + myLayerName + '" already exists in this state.');
            }
        }
    });
    Object.defineProperty(this, 'removeLayer', {
        value: function(myLayerName) {
            if (myState.layers[myLayerName]) {
                delete myState.layers[myLayerName];
            } else {
                console.log('Sorry, a layer by the name of "' + myLayerName + '" does not exist in this state.');
            }
        }
    });
    Object.defineProperty(this, 'listLayers', {
        value: myState.layers
    });
    Object.defineProperty(this, 'layers', {
        value: function(myLayerName) {
            if (myState.layers[myLayerName]) {
                layers.call(that.layers(myLayerName), myState.layers[myLayerName]);
            } else {
                console.log('Sorry, a layer by the name of "' + myLayerName + '" does not exist in this state.');
            }
        }
    });
};
},{"./../construct/newLayer.js":3,"./layer.js":11}],14:[function(require,module,exports){
/*jslint node: true */
/*global myLayer, module, google, require, define, define.amd*/
'use strict';
var layers;
/**
 * This
 *
 * @method views
 * @memberof! socioscapes
 * @return
 */
module.exports = function view(myScape, myView) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        that = this;
    Object.defineProperty(this, 'newViewGmap', {
        value: function(myViewName) {
            if (!myLayer.views[myViewName]) {
                newViewGmap(myLayer, myViewName);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" already exists in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'newViewDatatable', {
        value: function(myViewName) {
            if (!myLayer.views[myViewName]) {
                newViewDatatable(myLayer, myViewName);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" already exists in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'removeView', {
        value: function(myViewName) {
            if (myLayer.views[myViewName]) {
                delete myLayer.views[myViewName];
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" does not exist in this layer.');
            }
        }
    });
    Object.defineProperty(this, 'listViews', {
        value: myState.views
    });
    Object.defineProperty(this, 'views', {
        value: function(myViewName) {
            if (myLayer.views[myViewName]) {
                layers.call(that.views(myViewName), myLayer.views[myViewName]);
            } else {
                console.log('Sorry, a view by the name of "' + myViewName + '" does not exist in this layer.');
            }
        }
    });
    callback();
    return;
};
},{}],15:[function(require,module,exports){
/*jslint node: true */
/*global myState, module, google, require, define, define.amd*/
'use strict';
var getState = require ('./../fetch/fetchState.js');
/**
 * This
 *
 * @method getLayer
 * @memberof! socioscapes
 * @return
 */
// TODO fetchLayer(argument1, argument2, argument3) error checks isValidName(argument1) and isValidUrl(argument2)
module.exports = function getLayer(scape, state, layer) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        i,
        myLayer,
        myState;
    layer = layer || 0;
    state = state || 0;
    myState = getState(scape, state);
    if (!myState){ // if myState returns false then either scape or state are invalid or do not exist
        return;
    }
    if (Number.isInteger(layer) && myState[layer]) {
        myLayer = myState[layer];
    } else if (typeof layer === "string") {
        for (i = 0; i < myState.length; i++) {
            if (layer === myState[i].layerName){
                myLayer = myState[i];
            }
        }
    } else {
        myLayer = false;
        console.log('Sorry, the layer "' + layer + '" does not exist in the state "' + state + '".');
    }
    callback(myLayer);
    return myLayer;
};
},{"./../fetch/fetchState.js":17}],16:[function(require,module,exports){
// TODO fetchScape(argument) calls isValidUrl(argument); if true, retrieves and converts json file at url; else checks isValidName(argument); if true, checks for window[name] and returns it, else returns false
var isValidName = require('../core/isValidName.js'),
    isValidUrl = require('../core/isValidUrl.js');
module.exports = function fetchScape(name, url) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    name = isValidName(name) ? name:false;
    if (name) {
        isValidUrl(url, function (result) {
            if (result) {
                // change
                doStuff(url, function (scape) {
                    callback(scape);
                });
            } else if (!url) {
                if (window[name] && window[name].meta && window[name].meta.type === 'scapeJson') {
                    callback(window[name]);
                }
            } else {
                callback(false);
            }

        });
    } else {
        callback(false);
    }
    return;
};
},{"../core/isValidName.js":9,"../core/isValidUrl.js":10}],17:[function(require,module,exports){
/*jslint node: true */
/*global myState, module, google, require, define, define.amd*/
'use strict';
var isScape = require('./fetchScape.js'); //TODO figure out a new dir for this kind of function
/**
 * This
 *
 * @method getState
 * @memberof! socioscapes
 * @return
 */
// TODO fetchState(argument1, argument2)
module.exports = function getState(myScape, scape, state) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        i,
        myState;
    if (!scape || !isScape(scape)){ //TODO make isScape return false if supplied arg isn't scape
        callback(false);
    }
    state = state || 0;
    if (Number.isInteger(state) && window[scape[state]]) { // if the state provided is an integer
        myState = window[scape[state]];
    } else if (typeof state === "string") { // otherwise if the state provided is a string and it matches the .stateName property of any member of the scape
        for (i = 0; i < window[scape].length; i++) {
            if (state === window[scape[i]].stateName){
                myState = window[scape[i]];
            }
        }
    } else { // otherwise just return false
        myState = false;
        console.log('Sorry, the state "' + state + '" does not exist in that scape.');
    }
    callback(myState);
    return myState;
};
},{"./fetchScape.js":16}],18:[function(require,module,exports){
/*jslint node: true */
/*global myState, module, google, require, define, define.amd*/
'use strict';
var getLayer = require ('./fetchLayer.js');
/**
 * This
 *
 * @method getLayer
 * @memberof! socioscapes
 * @return
 */
// TODO fetchView(argument1, argument2, argument3, argument4)
module.exports = function getView(scape, state, layer, view) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        i,
        myLayer,
        myView;
    layer = layer || 0;
    state = state || 0;
    view = view || 0;
    myLayer = getLayer(scape, state, layer);
    if (!myLayer){ // if myLayer returns false then either scape, state, or layer are invalid or do not exist
        callback(false);
    }
    if (Number.isInteger(view) && myLayer.views[view]) {
        myView = myLayer.views[view];
    } else if (typeof view === "string") {
        for (i = 0; i < myLayer.views.length; i++) {
            if (view === myLayer.views[view].viewName){
                myView = myLayer.views[view];
            }
        }
    } else {
        myView = false;
        console.log('Sorry, the view "' + view + '" does not exist in the layer "' + layer + '" (or that layer does not exist in the state "' + state + '").')
    }
    callback(myView);
    return  myView;
};
},{"./fetchLayer.js":15}],19:[function(require,module,exports){
module.exports = function removeState(myScape, myState) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    callback();
    return;
};

},{}],20:[function(require,module,exports){
module.exports = function storeScape(myScape, myState) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    callback();
    return;
};

},{}],21:[function(require,module,exports){
module.exports = function storeState(myScape, myState) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    callback();
    return;
};

},{}]},{},[12])(12)
});