/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchScape = socioscapes.fn.fetchScape,
    newScapeObject = socioscapes.fn.newScapeObject,
    newScapeMenu = socioscapes.fn.newScapeMenu,
    newGlobal = socioscapes.fn.newGlobal,
    fetchGlobal = socioscapes.fn.fetchGlobal;
socioscapes.fn.extend([
    {
        path: 'init',
        silent: true,
        extension:
            function coreInit(scape) {
                var myScape;
                myScape = fetchScape(scape || 'scape0') || newScapeObject('scape0', null, 'scape');
                socioscapes.s = myScape;
                newGlobal('socioscapes', socioscapes, true);
                return newScapeMenu(myScape);
            }
    }
]);