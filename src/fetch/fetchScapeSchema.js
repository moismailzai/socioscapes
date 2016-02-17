/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    schema = require('./../core/schema.js');
/**
 * This internal method returns the .schema entry that corresponds to 'type'.
 *
 * @function fetchScapeSchema
 * @memberof socioscapes
 * @param {string} type - The type of schema definition to fetch.
 * @return myObject {Object} - Returns the corresponding schema entry or undefined.
 */
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