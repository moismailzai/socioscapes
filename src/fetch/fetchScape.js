/*jslint node: true */
/*global module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newCallback = require('./../construct/newCallback.js'),
    isValidObject = require('./../bool/isValidObject.js');
/**
 * This internal method is used to access a {@link ScapeObjec}. Currently limited to simply checking the global object but
 * future versions may allow loading from urls or local storage.
 *
 * @function fetchScape
 * @memberof socioscapes
 * @param {Object} scapeObject - A {@link ScapeObject} or a string that corresponds to a {@link ScapeObject} in the global object.
 * @return myObject {Object} - Returns the corresponding {@link ScapeObject} or undefined.
 */
function fetchScape(scapeObject) {
    var callback = newCallback(arguments),
        myObject;
    if (typeof scapeObject === 'string') {
        if (fetchGlobal(scapeObject)) {
          if (isValidObject(fetchGlobal(scapeObject))) {
              myObject = fetchGlobal(scapeObject);
          }
        }
    } else {
        if (isValidObject(scapeObject)) {
            myObject = scapeObject;
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScape;