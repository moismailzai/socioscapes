/*jslint node: true */
/*global module, require, socioscapes, this*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
function menuStore(context, command, config) {
    var callback = newCallback(arguments),
        myResult = context.that,
        myCommand = socioscapes.fn[command] || socioscapes.fn.schema.alias[command] || ((typeof command === 'function') ? command:false);
    if (myCommand) {
        this.dispatcher({
                myFunction: myCommand,
                myArguments: [config]
            },
            function (result) {
                if (result) {
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            context.object[prop] = result[prop];
                        }
                    }
                    console.log('The results of your "' + command + '" query are ready.');
                    myResult = result;
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
    }
    callback(myResult);
    return myResult;
}
module.exports = menuStore;