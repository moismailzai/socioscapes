/*jslint node: true */
/*global module, require*/
'use strict';
import newCallback from './../construct/newCallback';

/**
 * This internal method tests if an object adheres to the scape.sociJson standard.
 *
 * @function isValidObject
 * @memberof socioscapes
 * @param {Object} object - An object whose .meta.type === 'scape.sociJson'.
 * @returns {Boolean}
 */
export default function isValidObject(object) {
    let callback = newCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type &&
        object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
