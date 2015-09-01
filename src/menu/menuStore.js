/*jslint node: true */
/*global module, require, socioscapes, this*/
'use strict';
function menuStore(context, command, config) {
    var newCallback = menuStore.prototype.newCallback,
        newEvent = menuStore.prototype.newEvent;
    //
    var callback = newCallback(arguments),
        myResult = context.that,
        myEvent,
        myCommand = socioscapes.fn[command] || socioscapes.fn.schema.alias[command] || ((typeof command === 'function') ? command:false);
    if (myCommand) {
        context.that.dispatcher.dispatch({
                myFunction: myCommand,
                myArguments: [context.that, config]
            },
            function (result) {
                if (result) {
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            delete context.object[prop];
                            context.object[prop] = result[prop];
                        }
                    }
                    console.log('The results of your "' + command + '" query are ready.');
                    myResult = result;
                    myEvent = newEvent('socioscapes.ready.' + myCommand.name, context);
                    document.dispatchEvent(myEvent);
                }

            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
    }
    callback(myResult);
    return myResult;
}
module.exports = menuStore;