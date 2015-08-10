/*jslint node: true */
/*global module, require*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
// isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
function fetchFromScape(key, metaProperty, array) {
    var callback = newDispatcherCallback(arguments),
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