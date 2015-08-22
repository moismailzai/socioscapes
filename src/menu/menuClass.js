/*jslint node: true */
/*global module, require, this*/
'use strict';
var fetchFromScape = require('./../fetch/fetchFromScape.js');
function menuClass(context, name) {
    return fetchFromScape(name || context.schema.name, 'name', context.schema.container);
}
module.exports = menuClass;