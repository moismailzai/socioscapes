/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function fetchGlobal(name) {
    var callback = newDispatcherCallback(arguments),
        myGlobal = false;
    if (window[name] === undefined) {

    } else {
        myGlobal = window[name];
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = fetchGlobal;