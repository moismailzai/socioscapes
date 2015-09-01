/*jslint node: true */
/*global module, require, this*/
'use strict';
function menuRequire(context, command, config) {
    var newCallback = menuRequire.prototype.newCallback;
    //
    var callback = newCallback(arguments);
    callback(context.that);
    return context.that;
}
module.exports = menuRequire;