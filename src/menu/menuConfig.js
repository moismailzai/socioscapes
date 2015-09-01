/*jslint node: true */
/*global module, require, socioscapes, this*/
'use strict';
function menuConfig(context, command, config) {
    var newCallback = menuConfig.prototype.newCallback,
        newEvent = menuConfig.prototype.newEvent;
    //
    var callback = newCallback(arguments),
        myResult = context.that,
        myEvent,
        myCommand = socioscapes.fn[command] ||  // if command matches a full command name
            socioscapes.fn.schema.alias[command] || // or an alias
            ((typeof command === 'function') ? command: false); // or if it's a function, then let it be equal to itself; otherwise, false
        config = (typeof config === 'object') ? config: { "name": config || command }; // if a string was provided as the config argument, use it as a name
    if (myCommand) {
        context.that.dispatcher.dispatch({
                myFunction: myCommand,
                myArguments: [context.that, config],
                myThis: context.that
            },
            function (result) {
                if (result) {
                    console.log('The results of your "' + command + '" are ready.');
                    myResult = result;
                    myEvent = newEvent('socioscapes.ready.' + myCommand.name, context);
                    document.dispatchEvent(myEvent);
                }
            });
    }
    callback(myResult);
    return myResult;
}
module.exports = menuConfig;