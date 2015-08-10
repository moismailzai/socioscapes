/*jslint node: true */
/*global module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 *
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;