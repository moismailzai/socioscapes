/*jslint node: true */
/*global module, require*/
'use strict';
import fetchGlobal from './../fetch/fetchGlobal.js';
import newCallback from './../construct/newCallback.js';
import isValidObject from './../bool/isValidObject.js';

/**
 * This internal method is used to access a {@link ScapeObjec}. Currently limited to simply checking the global object but
 * future versions may allow loading from urls or local storage.
 *
 * @function fetchScape
 * @memberof socioscapes
 * @param {Object} scapeObject - A {@link ScapeObject} or a string that corresponds to a {@link ScapeObject} in the global object.
 * @return myObject {Object} - Returns the corresponding {@link ScapeObject} or undefined.
 */
export default function fetchScape(scapeObject) {
    let callback = newCallback(arguments),
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
