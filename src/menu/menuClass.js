/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchScapeObject = require ('./../fetch/fetchScapeObject.js');
function menuClass(context, element) {
    var callback = newDispatcherCallback(arguments),
        myResult;
    fetchScapeObject(element || context.myChildSchema.name, this, context.myChildSchema.class,
        function(result) {
            myResult = result;
        });
    callback (myResult);
    return myResult;
}
module.exports = menuClass;