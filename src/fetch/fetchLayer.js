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