/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var init = function init(scape) {
    var fetchScape = init.prototype.fetchScape,
        newScapeObject = init.prototype.newScapeObject,
        newScapeMenu = init.prototype.newScapeMenu;
    var myScape;
    myScape = fetchScape(scape || 'scape0') || newScapeObject('scape0', null, 'scape');
    socioscapes.s = myScape;
    return newScapeMenu(myScape);
};
module.exports = init;