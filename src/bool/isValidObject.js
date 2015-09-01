/*jslint node: true */
/*global module, require*/
'use strict';
/**
 *
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