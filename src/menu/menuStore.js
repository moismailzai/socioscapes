/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuRequire'.
 *
 * @function menuStore
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} context.that - A {@link socioscapes} {@link ScapeObject} object.
 */
function menuStore(context, command, config) {
    var callback = newCallback(arguments),
        myCommand = (typeof command === 'function') ? command: false;
    if (myCommand) {
        myCommand(context.that, config, function (result) {
            if (result) {
                for (var prop in result) {
                    if (result.hasOwnProperty(prop)) {
                        delete context.object[prop];
                        context.object[prop] = result[prop];
                    }
                }
            }
            console.log('The results of your "' + myCommand.name + '" query are ready.');
            newEvent('socioscapes.ready.' + myCommand.name, context);
            callback(result);
        });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
        callback(false);
    }
    return context.that;
}
module.exports = menuStore;