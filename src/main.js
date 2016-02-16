/*jslint node: true */
/*global module, require, document, window, google, gapi*/
'use strict';
var socioscapes = require('./core/core.js'),
    viewGmaps = require('./extension/viewGmaps.js');

/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2016 Misaqe Ismailzai
 *
 * This software was originally conceived as partial fulfilment of the degree requirements for the Masters of Arts in
 * Sociology at the University of Toronto.
 */

// to extend socioscapes, simply call the extension with the socioscapes object as argument
viewGmaps(socioscapes);

module.exports = socioscapes;