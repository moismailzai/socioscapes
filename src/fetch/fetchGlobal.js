/*jslint node: true */
/*global global, module, require*/
'use strict';
import newCallback from './../construct/newCallback.js';

/**
 * This internal method is used to retrieve a variable from the global object.
 *
 * @function fetchGlobal
 * @memberof socioscapes
 * @param {string} name - A string that corresponds to a variable in the global object.
 * @return {Object} myGlobal - Returns the corresponding {@link ScapeObject} or undefined.
 */
export default function fetchGlobal(name) {
    let callback = newCallback(arguments),
        myGlobal;
    if (window) {
        myGlobal = window[name];
    } else if (global) {
        myGlobal = global[name];
    }
    callback(myGlobal);
    return myGlobal;
}
