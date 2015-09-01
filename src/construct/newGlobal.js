/*jslint node: true */
/*global global, module, require, window*/
'use strict';
function newGlobal(name, object, overwrite) {
    var fetchGlobal = newGlobal.prototype.fetchGlobal,
        newCallback = newGlobal.prototype.newCallback;
    //
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