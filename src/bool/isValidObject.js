/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 *
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;