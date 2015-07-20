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
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result;},
        i,
        myState;
    if (!scape || !isScape(scape)){ //TODO make isScape return false if supplied arg isn't scape
        return;
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
    return myState;
};