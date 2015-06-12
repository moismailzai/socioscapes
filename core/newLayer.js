/**
 * This FUNCTION creates a new layer object. Layers are self-contained store-view pairings.
 *
 * @function newLayer
 * @return this {Object}
 */
var chroma = require('../libs/chroma.js'),
    Geostats = require('../libs/Geostats.js'),
    myPolyfills = require('../libs/myPolyfills.js');
myPolyfills();

module.exports = function (name) {
    var myLayer,
        _myData,
        _myGeom,
        _myColourscale = "YlOrRd",
        _myGeostats,
        _myDomain,
        _myClassification = 'getClassJenks',
        _myClasses,
        _myViews = [],
        _myBreaks = 5,
        _myLayerStatus = {};
    Object.defineProperty(_myLayerStatus, 'data', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'geom', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'colourscale', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'geostats', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'domain', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'classes', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'breaks', {
        value: false,
        configurable: true
    });

    myLayer = {};

    Object.defineProperty(myLayer, 'status', {
        value: function (name, state) {
            if (!name) {
                return _myLayerStatus
            }
            if (typeof _myLayerStatus[name] === 'boolean' && !state) {
                return _myLayerStatus[name]
            }
            if (typeof _myLayerStatus[name] === 'boolean' && typeof state === 'boolean') {
                delete _myLayerStatus[name];
                _myLayerStatus[name] = state;
            }
        }
    });

    Object.defineProperty(myLayer, 'data', {
        value: function (fetcher, config) {
            var _statusBackup;
            if (!fetcher || !config) {
                return _myData.values;
            }
            _statusBackup = _myLayerStatus.data;
            myLayer.status('data', false);
            fetcher(config, function (result, success) {
                if (success) {
                    _myData = result;
                    _myGeostats = new Geostats(result.values);
                    myLayer.status('data', true);
                } else {
                    myLayer.status('data', _statusBackup);
                }
            });
        }
    });

    Object.defineProperty(myLayer, 'geom', {
        value: function (fetcher, config) {
            var _statusBackup;
            if (!fetcher || !config) {
                return _myGeom.features;
            }
            _statusBackup = _myLayerStatus.geom;
            myLayer.status('geom', false);
            fetcher(config, function (result, success) {
                if (success) {
                    _myGeom = result;
                    myLayer.status('geom', true);
                } else {
                    myLayer.status('geom', _statusBackup);
                }
            });
        }
    });

    Object.defineProperty(myLayer, 'breaks', {
        value: function (breaks) {
            if (!breaks) {
                return _myBreaks;
            }
            if (Number.isInteger(breaks)) {
                _myBreaks = breaks;
                myLayer.status('breaks', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'chromaScale', {
        value: chroma.scale(_myColourscale).domain(_myDomain).out('hex')
    });

    Object.defineProperty(myLayer, 'chromaScaleIndex', {
        value: chroma.scale(_myColourscale).domain(_myDomain, _myBreaks).colors()
    });

    Object.defineProperty(myLayer, 'classes', {
        value: function (classes) {
            if (!classes) {
                return _myClasses;
            }
            if (Object.prototype.toString.call(classes) === '[object Array]') { // http://stackoverflow.com/questions/4775722/check-if-object-is-array
                _myClasses = classes;
                myLayer.status('classes', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'classification', {
        value: function (classification) {
            var i;
            if (!classification) {
                return _myClassification;
            }
            if (_myGeostats[classification] && _myData) {
                myLayer.status('classes', false);
                myLayer.status('domain', false);
                _myDomain = [];
                _myClassification = classification;
                myLayer.classes(_myGeostats[classification](_myBreaks));
                for (i = 0; i < _myBreaks; i++) {
                    _myDomain.push(parseFloat(_myClasses[i]));
                }
                myLayer.status('domain', true);
                myLayer.status('classes', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'domain', {
        value: function () { return _myDomain; }
    });

    Object.defineProperty(myLayer, 'geostats', {
        value: _myGeostats
    });

    Object.defineProperty(myLayer, 'colourscale', {
        value: function (colourscale) {
            if (!colourscale) {
                return _myColourscale;
            }
            myLayer.status('colourscale', false);
            _myColourscale = colourscale;
            myLayer.status('colourscale', true);
        }
    });

    Object.defineProperty(myLayer, 'views', {
        value: function (viewName, viewFunction, viewConfig) {
            if (!viewName) {
                return _myViews;
            }
            if (viewName && !viewFunction) {
                if (_myViews[viewName]) {
                    return _myViews[viewName]();
                } else {
                    return _myViews;
                }
            }
            if (_myViews[viewName] && viewFunction === "DELETE") {
                delete(_myViews[viewName]);
                return _myViews;
            } else if (_myViews[viewName] && ViewFunction === "INIT") {
                delete(_myViews[viewName]);
                return _myViews;
            } else {
                Object.defineProperty(_myViews, viewName, {
                    value: function () {
                        viewFunction(myLayer, viewConfig)
                    },
                    enumerable: true,
                    configurable:true
                });
            }
        }
    });
    if (name) {
      this[name] = myLayer;
    }
    return myLayer;
};