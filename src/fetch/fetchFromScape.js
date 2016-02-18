/*jslint node: true */
/*global module, require, Number*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    isValidName = require('./../bool/isValidName.js');
/**
 * This internal method is used to extract a specific state, view, or layer from within a {@link ScapeObject} 'array' based on a
 * 'key' and 'metaProperty' pairing.
 *
 * @function fetchFromScape
 * @memberof socioscapes
 * @param {(number|string)} key - An integer value that corresponds to an entry in the 'array' argument or a string that
 * corresponds to a metaProperty value.
 * @param {Object} metaProperty - The property in the '.meta' member that we are trying to match to (usually 'name').
 * @param {Object} array - The {@link ScapeObject} array that contains the state, view, or layer we are looking for.
 * @return this {Object}
 */
Number.isInteger = Number.isInteger || function(value) {     // isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
function fetchFromScape(key, metaProperty, array) {
    var callback = newCallback(arguments),
        myKey = false;
    if (array) {
        if (Number.isInteger(key)) {
            myKey = (array[key]) ? array[key]:false;
        } else if (isValidName(key)) {
            for (var i = 0; i < array.length; i++) {
                if (key === array[i].meta[metaProperty]) {
                    myKey = array[i];
                }
            }
        }
    }
    callback(myKey);
    return myKey;
}
module.exports = fetchFromScape;