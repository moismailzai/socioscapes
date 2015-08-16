/*jslint node: true */
/*global global, module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
function fetchGlobal(name) {
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