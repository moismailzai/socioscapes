/*jslint node: true */
/*global module, require*/
'use strict';
var fetchScapeObject = socioscapes.fn.fetchScapeObject,
    newScapeObject = socioscapes.fn.newScapeObject,
    newScapeMenu = socioscapes.fn.newScapeMenu;
socioscapes.fn.coreExtend([
    {
        path: 'coreInit', extension: function coreInit(name) {
        var myScape;
        if (name) {
            myScape = fetchScapeObject(name);
        } else {
            myScape = newScapeObject(name || 'scape0', null, 'scape');
        }
        this.s = newScapeMenu(myScape);
        return this.s;
    }}
]);