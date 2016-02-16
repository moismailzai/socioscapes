/*jslint node: true */
/*global module, require, socioscapes, this*/
'use strict';
/**
 * This method returns a ScapeObject object for schema entries where menu === 'menuConfig'.
 *
 * @function menuConfig
 * @param {Object} context - A context object sent by the a ScapeMenu call (this allows us to use the correct ScapeObject
 * for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} - A socioscapes ScapeObject object.
 */
function menuConfig(context, command, config) {
    var newCallback = menuConfig.prototype.newCallback,
        newEvent = menuConfig.prototype.newEvent;
    //
    var callback = newCallback(arguments),
        myCommand = menuConfig.prototype[command] ||  // if command matches a full command name
            menuConfig.prototype.schema.alias[command] || // or an alias
            ((typeof command === 'function') ? command: false); // or if it's a function, then let it be equal to itself; otherwise, false
    if (myCommand) {
        myCommand(context.that, config, function (result) {
            console.log('The results of your "' + command + '" are ready.');
            newEvent('socioscapes.ready.' + myCommand.name, context);
            callback(result);
        });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
        callback(false);
    }
    return context.that;
}
module.exports = menuConfig;