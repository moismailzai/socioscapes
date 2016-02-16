/*jslint node: true */
/*global module, require, this*/
'use strict';
/**
 * This method returns a ScapeObject object for schema entries where menu === 'menuClass'.
 *
 * @function menuClass
 * @param {Object} context - A context object sent by the a ScapeMenu call (this allows us to use the correct ScapeObject
 * for our context).
 * @param {string} [name] - Not implemented.
 * @param {Object} [config] - Not implemented.
 * @return {Object} - A socioscapes ScapeObject object.
 */
function menuClass(context, name, config) {
    var fetchFromScape = menuClass.prototype.fetchFromScape;
    //
    name = (typeof name === 'string') ? name : context.schema.name;
    return fetchFromScape(name, 'name', context.object);
}
module.exports = menuClass;