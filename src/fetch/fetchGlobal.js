/*jslint node: true */
/*global global, module, require*/
'use strict';
function fetchGlobal(name) {
    var newCallback = fetchGlobal.prototype.newCallback;
    //
    var callback = newCallback(arguments),
        myGlobal;
    if (window) {
        myGlobal = window[name];
    } else if (global) {
        myGlobal = global[name];
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = fetchGlobal;