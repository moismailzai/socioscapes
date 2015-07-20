/*jslint node: true */
/*global myLayer, module, google, require, define, define.amd*/
'use strict';
var layers;
/**
 * This
 *
 * @method layers
 * @memberof! socioscapes
 * @return
 */
module.exports = function layers(myLayer) {
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
};