/*jslint node: true */
/*global module, require*/
'use strict';
function fetchFromScape(key, metaProperty, array) {
    var isValidName = fetchFromScape.prototype.isValidName,
        newCallback = fetchFromScape.prototype.newCallback;
    Number.isInteger = Number.isInteger || function(value) {     // isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    //
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