/*jslint node: true */
/*global myState, module, google, require, define, define.amd*/
'use strict';
var newLayer = require ('./../construct/newLayer.js'),
    layers = require ('./layer.js');
/**
 * This
 *
 * @method states
 * @memberof! socioscapes
 * @return
 */
module.exports = function states(myScape, myState) {
    var callback = arguments[arguments.length - 1],
        that = this;;
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
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