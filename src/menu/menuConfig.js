/*jslint node: true */
/*global module, require, socioscapes, this*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
function menuConfig(context, command, config) {
    var callback = newCallback(arguments),
        myResult = context.that,
        myCommand = socioscapes.fn[command] ||  // if command matches a full command name
        socioscapes.fn.schema.alias[command] || // or an alias
            ((typeof command === 'function') ? command: false); // or if it's a function, then let it be equal to itself; otherwise, false
    config = (typeof config === 'object') ? config: { "name": config || command }; // if a string was provided as the config argument, use it as a name
    if (myCommand) {
        this.dispatcher({
                myFunction: myCommand,
                myArguments: [config],
                myThis: context.that
            },
            function (result) {
                if (result) {
                    console.log('The results of your "' + command + '" are ready.');
                    myResult = result;
                    socioscapes.fn.newEvent(command+'.success', command+'.success');
                }
                socioscapes.fn.newEvent(command+'.fail', command+'.fail');
            });
    }
    callback(myResult);
    return myResult;
}
module.exports = menuConfig;