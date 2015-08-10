/*jslint node: true */
/*global module, require, google*/
'use strict';
var socioscapes = require('./core/socioscapes.js'), // loaded in exactly this order to avoid circular dependencies
    coreSchema = require('./core/coreSchema.js'),
    newScapeObject = require('./construct/newScapeObject.js'),
    newScapeMenu = require('./construct/newScapeMenu.js'),
    coreInit = require('./core/coreInit.js');
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
module.exports = socioscapes;