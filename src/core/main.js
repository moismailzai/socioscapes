/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
if (!Number.isInteger) {
    Number.isInteger = function isInteger (nVal) {
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    };
}
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
var newDispatcher = require ('./../construct/newDispatcher.js'),
    newS = require ('./../construct/newS'),
    fetchScape = require('./../fetch/fetchScape.js');

module.exports = function socioscapes(name) {
    var myScape = fetchScape(name) || {};
    newDispatcher(myScape);
    return newS(myScape);
};