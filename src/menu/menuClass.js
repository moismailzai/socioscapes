/*jslint node: true */
/*global module, require*/
'use strict';
import fetchFromScape from './../fetch/fetchFromScape.js';

/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuClass'.
 *
 * @function menuClass
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} [name] - Not implemented.
 * @return {Object} - A {@link socioscapes} {@link ScapeObject} object.
 */
export default function menuClass(context, name) {
    name = (typeof name === 'string') ? name : context.schema.name;
    return fetchFromScape(name, 'name', context.object);
}
