/*jslint node: true */
/*global module, require*/
'use strict';
import newCallback from './../construct/newCallback.js';

/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuRequire'.
 *
 * @function menuRequire
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} context.that - A {@link socioscapes} {@link ScapeObject} object.
 */
export default function menuRequire(context, command, config) {
    let callback = newCallback(arguments);
    callback(context.that);
    return context.that;
}
