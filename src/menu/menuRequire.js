/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuRequires(command, config, myContainer) {
    var callback = newDispatcherCallback(arguments);
    callback(this);
    return this;
}
module.exports = menuRequires;