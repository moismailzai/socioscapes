/*jslint node: true */
/*global global, module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function fetchGlobal(name) {
    var callback = newDispatcherCallback(arguments),
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