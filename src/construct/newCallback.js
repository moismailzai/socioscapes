/*jslint node: true */
/*global module, require*/
'use strict';
/**
 * This internal method checks to see if the last argument in an array contains a function. If it does, return that
 * function, else return an empty function.
 *
 * @function newCallback
 * @memberof socioscapes
 * @param {Object[]} argumentsArray - The arguments array of a function.
 * @return {Function} myCallback - Any function.
 */
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