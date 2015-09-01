/*jslint node: true */
/*global module, require, this*/
'use strict';
function menuClass(context, name) {
    var fetchFromScape = menuClass.prototype.fetchFromScape;
    //
    return fetchFromScape(name || context.schema.name, 'name', context.schema.container);
}
module.exports = menuClass;