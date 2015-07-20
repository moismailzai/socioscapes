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
    var callback = arguments[arguments.length - 1],
        i,
        myLayer,
        myView;
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
    layer = layer || 0;
    state = state || 0;
    view = view || 0;
    myLayer = getLayer(scape, state, layer);
    if (!myLayer){ // if myLayer returns false then either scape, state, or layer are invalid or do not exist
        return;
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
    return myView;
};