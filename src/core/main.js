/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeObject = require('./../construct/newScapeObject.js'),
    newScapeMenu = require('./../construct/newScapeMenu.js');
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * extendable environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2015 Misaqe Ismailzai
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at
 * the University of Toronto.
 */
if (!Number.isInteger) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
    Number.isInteger = function isInteger (nVal) {
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    };
}
function socioscapes(name) {
    var myScape,
        myMenu;
    name = (isValidName(name)) ? name:'scape0';
    myScape = (fetchScapeObject(name)) ? fetchScapeObject(name):newScapeObject(name, null, 'scape');
    if (myScape) {
        myMenu = newScapeMenu(myScape);
        newGlobal('s', myMenu, true);
    }
    return myMenu;
}
module.exports = socioscapes;