/*jslint node: true */
/*global global, module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function newGlobal(name, object, overwrite) {
    var callback = newDispatcherCallback(arguments),
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
        } else {
            console.log('Sorry, a global object called "' + name + '" already exists.');
        }
    } else {
        if (window) {
            window[name] = object;
            myGlobal = window[name];
        } else if (global) {
            window[name] = object;
            myGlobal = window[name];
        }
        console.log('Creating a new global object called "' + name + '".');
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;