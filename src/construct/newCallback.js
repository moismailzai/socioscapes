/*jslint node: true */
/*global module, require*/
'use strict';
function newCallback(argumentsArray) {
    var myCallback;
    if (typeof argumentsArray[argumentsArray.length - 1] === 'function') {
       myCallback = argumentsArray[argumentsArray.length - 1];
    } else {
        myCallback = function(result) {
            return result;
        };
    }
    return myCallback;
}
module.exports = newCallback;