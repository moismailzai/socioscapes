/*jslint node: true */
/*global module, require*/
'use strict';
/**
 * This internal method tests if an object adheres to the scape.sociJson standard.
 *
 * @function isValidObject
 * @param {Object} object - An object whose .meta.type === 'scape.sociJson'.
 * @returns {Boolean}
 */
function isValidObject(object) {
    var newCallback = isValidObject.prototype.newCallback;
    //
    var callback = newCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;