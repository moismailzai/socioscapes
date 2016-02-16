/*jslint node: true */
/*global module, require, this*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * This method returns a ScapeObject object for schema entries where menu === 'menuRequire'.
 *
 * @function menuRequire
 * @param {Object} context - A context object sent by the a ScapeMenu call (this allows us to use the correct ScapeObject
 * for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} - A socioscapes ScapeObject object.
 */
function menuRequire(context, command, config) {
    var callback = newCallback(arguments);
    callback(context.that);
    return context.that;
}
module.exports = menuRequire;