/*jslint node: true */
/*global global, module, require, window*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js');
/**
 * This internal method creates a new global object. *gasp*
 *
 * @function newGlobal
 * @memberof socioscapes
 * @param {string} name - A valid name JavaScript object name.
 * @param {Object} object - The global object, either window or global.
 * @param {Boolean} [overwrite] - If true, overwrite existing objects.
 * @return {Object} myGlobal - The newly-created global object.
 */
function newGlobal(name, object, overwrite) {
    var callback = newCallback(arguments),
        myGlobal;
    if (fetchGlobal(name)) {
        if (overwrite) {
            if (window) {
                window[name] = object;
                myGlobal = window[name];
            } else if (global) {
                global[name] = object;
                myGlobal = global[name];
            }
        }
    } else {
        if (window) {
            window[name] = object;
            myGlobal = window[name];
        } else if (global) {
            window[name] = object;
            myGlobal = window[name];
        }
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;