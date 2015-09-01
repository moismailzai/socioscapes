/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchScapeSchema = function fetchScapeSchema(type) {
    var newCallback = fetchScapeSchema.prototype.newCallback;
    var callback = newCallback(arguments),
        myObject,
        index = fetchScapeSchema.prototype.schema.index;
    type = (type.indexOf('.') > -1) ? type.split('.')[0] : type;
    if (type) {
        myObject = index[type].schema;
    }
    callback(myObject);
    return myObject;
};
module.exports = fetchScapeSchema;