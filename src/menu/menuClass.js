/*jslint node: true */
/*global module, require*/
'use strict';
var fetchFromScape = require('./../fetch/fetchFromScape.js');
/**
 * This method returns a ScapeObject object for schema entries where menu === 'menuClass'.
 *
 * @function menuClass
 * @param {Object} context - A context object sent by the a ScapeMenu call (this allows us to use the correct ScapeObject
 * for our context).
 * @param {string} [name] - Not implemented.
 * @return {Object} - A socioscapes ScapeObject object.
 */
function menuClass(context, name) {
    name = (typeof name === 'string') ? name : context.schema.name;
    return fetchFromScape(name, 'name', context.object);
}
module.exports = menuClass;