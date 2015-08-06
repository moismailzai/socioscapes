/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function newGlobal(name, object, overwrite) {
    var callback = newDispatcherCallback(arguments),
        myGlobal = false;
    if (fetchGlobal(name)) {
        if (overwrite) {
            window[name] = object;
            myGlobal = window[name];
        } else {
            console.log('Sorry, a global object called "' + name + '" already exists.');
        }
    } else {
        window[name] = object;
        myGlobal = window[name];
        console.log('Creating a new global object called "' + name + '".');
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;