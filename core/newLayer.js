/*jslint node: true */
'use strict';
var chroma = require('../libs/chroma.js'),
    Geostats = require('../libs/Geostats.js'),
    myPolyfills = require('../libs/myPolyfills.js');
myPolyfills();
/**
 * This constructor method appends a new object (of class {@linkcode MyLayer}) to the Socioscapes instance.
 *
 * Requires the modules {@linkcode module:chroma}, {@linkcode module:Geostats}, and {@linkcode module:myPolyfills}.
 *
 * @method newLayer
 * @memberof! Socioscapes
 * @instance
 * @param {String} name - The name of the layer to be appended to the Socioscapes instance.
 * @return {Object} MyLayer
 */
module.exports = function newLayer(name) {
    /**
     * Each instance of this class consists of the two store members {@linkcode MyLayer#data} and
     * {@linkcode MyLayer#geom}, as well as well as the configuration members {@linkcode MyLayer#breaks},
     * {@linkcode MyLayer#classes}, {@linkcode MyLayer#classification}, {@linkcode MyLayer#colourscale},
     * {@linkcode MyLayer#domain}, {@linkcode MyLayer#geostats}, and {@linkcode MyLayer#status}.
     *
     * @constructor MyLayer
     * @memberof! Socioscapes
     * @instance
     */
    var MyLayer = function() {
        var _myBreaks = 5,
            _myClasses,
            _myClassification = 'getClassJenks',
            _myColourscaleName = "YlOrRd",
            _myColourScaleFunction,
            _myData,
            _myDomain,
            _myGeom,
            _myGeostats,
            _myViews = {},
            _myLayerStatus = {},
            that = this;
        Object.defineProperty(_myLayerStatus, 'breaks', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'classification', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'colourscale', {
            value: false,
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
         * This container holds all instances of {@linkcode MyView} that are associated with this {@linkcode MyLayer}
         * instance.
         *
         * @member views
         * @memberof! MyLayer
         * @instance
         */
        this.views = _myViews;
        /**
         * This method returns a boolean status for each configurable member of the associated {@linkcode MyLayer}
         * instance.
         *
         * @example
         * // returns the status of the 'data' member of myLayer.
         * myLayer.status('data')
         *
         * @example
         * // returns the status of all members of myLayer.
         * myLayer.status()
         *
         * @example
         * // set the status of 'data' to true.
         * myLayer.status('data', true)
         *
         * @method status
         * @memberof! MyLayer
         * @instance
         */
        Object.defineProperty(this, 'status', {
            value: function (name, state) {
                if (!name) {
                    return _myLayerStatus
                }
                if (typeof _myLayerStatus[name] === 'boolean' && !state) {
                    return _myLayerStatus[name]
                }
                if (typeof _myLayerStatus[name] === 'boolean' && typeof state === 'boolean') {
                    delete _myLayerStatus[name];
                    Object.defineProperty(_myLayerStatus, name, {
                        value: state,
                        configurable: true
                    });

                    if (_myLayerStatus.breaks &&
                        _myLayerStatus.classification &&
                        _myLayerStatus.colourscale &&
                        _myLayerStatus.data &&
                        _myLayerStatus.geom) {
                        delete _myLayerStatus.readyGis;
                        Object.defineProperty(_myLayerStatus, 'readyGis', {
                            value: true,
                            configurable: true
                        });
                    }
                }
            }
        });
        /**
         * This method sets the data store of the the associated {@linkcode MyLayer} instance. If the fetch is
         * succesful, myLayer.status('data') and myLayer.status('geostats') will both return true.
         *
         * @example
         * // Calls the 'fetchGoogleBq' member of the Socioscapes instance and passes the 'config' object as parameter.
         * myLayer.data(s.fetchGoogleBq, config)
         *
         * @method data
         * @memberof! MyLayer
         * @instance
         * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-data-object} and
         * status boolean (result, success).
         * @parameter {object} config - All arguments that the fetcher method requires.
         */
        Object.defineProperty(this, 'data', {
            value: function (fetcher, config) {
                var _statusBackup;
                if (!fetcher || !config) {
                    return _myData.values;
                }
                _statusBackup = _myLayerStatus.data;
                that.status('data', false);
                fetcher(config, function (result, success) {
                    if (success) {
                        _myData = result;
                        _myGeostats = new Geostats(result.values);
                        that.status('data', true);
                    } else {
                        that.status('data', _statusBackup);
                    }
                });
            }
        });
        /**
         * This method sets the geom store of the the associated {@linkcode MyLayer} instance. If the fetch is
         * successful, myLayer.status('geom') will return true.
         *
         * @example
         * // Calls the 'fetchWfs' member of the Socioscapes instance and passes the 'config' object as parameter.
         * myLayer.geom(s.fetchWfs, config)
         *
         * @method geom
         * @memberof! MyLayer
         * @instance
         * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-geom-object} and a
         * status boolean (result, success).
         * @parameter {object} config - All arguments that the fetcher method requires.
         */
        Object.defineProperty(this, 'geom', {
            value: function (fetcher, config) {
                var _statusBackup;
                if (!fetcher || !config) {
                    return _myGeom.features;
                }
                _statusBackup = _myLayerStatus.geom;
                that.status('geom', false);
                fetcher(config, function (result, success) {
                    if (success) {
                        _myGeom = result;
                        that.status('geom', true);
                    } else {
                        that.status('geom', _statusBackup);
                    }
                });
            }
        });
        /**
         * This method sets the number of breaks for the associated {@linkcode MyLayer} instance. This setting, along
         * with {@linkcode myLayer#classification} and {@linkcode myLayer#colourscale} constitute the core GIS
         * visualization settings.
         *
         * @example
         * // sets three breaks
         * myLayer.breaks('3')
         *
         * @method breaks
         * @memberof! MyLayer
         * @instance
         * @parameter {integer} breaks - The number of classifications for the layer symbology. Typically, this is set
         * to < = 5.
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
         * scale. Socioscapes includes support for all valid colourbrew colour scales {@link http://colorbrewer2.org/}.
         * This setting, along with {@linkcode myLayer#breaks} and {@linkcode myLayer#classifications} constitute the
         * core GIS visualization settings.
         *
         * @example
         * // returns the hexadecimal value for '100' given the ColourBrew spectrum 'YlOrRd' and five breaks.
         * myLayer.breaks(5)
         * myLayer.colourscale('SET', 'YlOrRd')
         * myLayer.colourscale('GET HEX', 100)
         *
         * @example
         * // returns the current colourscale name
         * myLayer.colourscale()
         *
         * @method colourscale
         * @memberof! MyLayer
         * @instance
         * @parameter {string} action - Can be 'SET', 'GET HEX', or 'GET INDEX'.
         * @parameter {number} value - Any value that falls within the bounds of {@linkcode myLayer#data}.
         */
        Object.defineProperty(this, 'colourscale', {
            value: function(action, value) {
                if (action === 'SET' ) {
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
         * This method classifies {@linkcode myLayer#data} based on a geostats classification. See
         * {@linktext https://github.com/simogeo/geostats}.
         *
         * @example
         * // set classification to Jenks
         * myLayer.classification('getEqInterval')
         *
         * @example
         * // set classification to standard deviation and change breaks to 3
         * myLayer.classification('getStdDeviation', 3)
         *
         * @method classification
         * @memberof! MyLayer
         * @instance
         * @parameter {string} classification - Any valid geostats classification function.
         * @parameter {integer} breaks - The number of classifications for the layer symbology. Convention suggests
         * setting this to < = 5.
         */
        Object.defineProperty(this, 'classification', {
            value: function (classification, breaks) {
                var i;
                if (!classification) {
                    return _myClassification;
                }
                if (_myData && _myGeostats[classification]) {
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
         * This method returns the data domain.
         *
         * @method domain
         * @memberof! MyLayer
         * @instance
         */
        Object.defineProperty(this, 'domain', {
            value: function () {
                return _myDomain;
            }
        });
        /**
         * This container stores the {@linkcode myLayer} instance's geostats object. It is calculated each time
         * {@linkcode myLayer#data} is successfully set.
         *
         * @member geostats
         * @memberof! MyLayer
         * @instance
         */
        Object.defineProperty(this, 'geostats', {
            value: _myGeostats
        });
        /**
         * This method gets or sets a new view based on the {@linkcode myLayer} instance's {@linkcode myLayer#data}
         * and {@linkcode myLayer#geom}. Views associated with a given {@linkcode myLayer} instance share the same
         * {@linkcode myLayer#data} and {@linkcode myLayer#geom} but allow you to visualize that information in unique
         * and complimentary ways.
         *
         *
         * @member views
         * @memberof! MyLayer
         * @instance
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
    if (name) {
      this[name] = new MyLayer;
    }
    return new MyLayer;
};