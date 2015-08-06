/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 *
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.includes('scape.sociJson')) {
        isValid = true
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;