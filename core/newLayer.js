/**
 * This METHOD creates a new layer which is either returned: myLayer = s.newLayer() or appended to the root socioscapes
 * object: (s.newLayer('myLayer'). Layers are a simple way to organize related data, geometry, and settings; they allow
 * you to easily access your data, analyze it, associate it with specific geometry, and connect it to various views.
 *
 * To create a new layer: s.newLayer('myLayer')
 * To add data: s.myLayer(
 *
 * @function newLayer
 * @param name {String} The name to be used for the layer (eg. s.name).
 * @return myLayer {Object}
 */
var chroma = require('../libs/chroma.js'),
    Geostats = require('../libs/Geostats.js'),
    myPolyfills = require('../libs/myPolyfills.js');
myPolyfills();

module.exports = function (name) {
    var myLayer,
        _myBreaks = 5,
        _myClasses,
        _myClassification = 'getClassJenks',
        _myColourscale = "YlOrRd",
        _myData,
        _myDomain,
        _myGeom,
        _myGeostats,
        _myViews = {},
        _myLayerStatus = {};
    Object.defineProperty(_myLayerStatus, 'breaks', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'classes', {
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

    myLayer = {};
    myLayer.views = _myViews;
    console.log(this);
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
                Object.defineProperty(_myLayerStatus, name, {
                    value: state,
                    configurable: true
                });

                if (_myLayerStatus.breaks &&
                _myLayerStatus.classes &&
                _myLayerStatus.colourscale &&
                _myLayerStatus.data &&
                _myLayerStatus.domain &&
                _myLayerStatus.geom &&
                _myLayerStatus.geostats) {
                    delete _myLayerStatus.readyGis;
                    Object.defineProperty(_myLayerStatus, 'readyGis', {
                        value: true,
                        configurable: true
                    });
                }
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
                configurable:true
            });
        }
    });
    if (name) {
      this[name] = myLayer;
    }
    return myLayer;
};