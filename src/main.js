/*jslint node: true */
/*global module, require*/
'use strict';
import socioscapes from './core/core.js';
import viewGmaps from './extension/viewGmaps.js';
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://www.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2021 Mo Ismailzai
 *
 * This software was originally conceived as partial fulfilment of the degree requirements for the Masters of Arts in
 * Sociology at the University of Toronto.
 */

// to extend socioscapes, simply call the extension with the socioscapes object as argument
viewGmaps(socioscapes);

export default socioscapes;