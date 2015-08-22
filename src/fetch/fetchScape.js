/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newCallback = require('./../construct/newCallback.js');
function fetchScape(object) {
    var callback = newCallback(arguments),
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
    callback(myObject);
    return myObject;
}
module.exports = fetchScape;