/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    schema = require('./../core/schema.js');
var fetchScapeSchema = function fetchScapeSchema(type) {
    var callback = newCallback(arguments),
        myObject,
        index = schema.index;
    type = (type.indexOf('.') > -1) ? type.split('.')[0] : type;
    if (type) {
        myObject = index[type].schema;
    }
    callback(myObject);
    return myObject;
};
module.exports = fetchScapeSchema;