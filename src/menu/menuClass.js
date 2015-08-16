/*jslint node: true */
/*global module, require, this*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchFromScape = require ('./../fetch/fetchFromScape.js');
function menuClass(context, name) {
    var callback = newCallback(arguments),
        myResult = fetchFromScape(name || context.schema.name, 'name', context.object);
    callback (myResult);
    return myResult;
}
module.exports = menuClass;