/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
function fetchScape(object) {
    var fetchGlobal = fetchScape.prototype.fetchGlobal,
        isValidObject = fetchScape.prototype.isValidObject,
        newCallback = fetchScape.prototype.newCallback;
    //
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