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
module.exports = function newLayer(name, layers) {
    var MyLayer,
        callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result;},
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
        callback(layers);
    } else {
        console.log('Sorry, unable to create a new layer called "' + name + '" (does a scape by that name already exist?).');
        callback(false)
    }
};