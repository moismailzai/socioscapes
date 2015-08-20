/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
function fetchScape(object) {
    var callback = newCallback(arguments),
        myEvent,
        myObject;
    if (typeof object === 'string') {
        if (fetchGlobal(object)) {
          if (isValidObject(fetchGlobal(object))) {
              myObject = fetchGlobal(object);
          }
        }
    } else {
        if (isValidObject(object)) {
            myObject = object;
        }
    }
    if (myObject && myObject.meta.type === 'scape.sociJson') {
        if (socioscapes.s && socioscapes.s.meta) {
            if (myObject.meta.name !== socioscapes.s.meta.name) {
                myEvent = newEvent('socioscapes.object.' + myObject.meta.type, myObject.meta.name);
                socioscapes.s = myObject;
                document.dispatchEvent(myEvent);
            }
        } else {
            myEvent = newEvent('socioscapes.object.' + myObject.meta.type, myObject.meta.name);
            socioscapes.s = myObject;
            document.dispatchEvent(myEvent);
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScape;