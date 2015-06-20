/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * extendable sandbox.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at the
 * University of Toronto.
 */
var fetchGoogleAuth = require('./fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./fetchers/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./fetchers/fetchGoogleBq.js'),
    fetchWfs = require('./fetchers/fetchWfs.js'),
    newLayer = require('./core/newLayer.js'),
    newViewGmap = require('./views/newViewGmap.js');
/**
 * This is the root socioscapes namespace and object.
 *
 * Requires the modules {@link socioscapes.fetchGoogleAuth}, {@link socioscapes.fetchGoogleGeocode},
 * {@link socioscapes.fetchGoogleBq}, {@link socioscapes.fetchWfs}, {@link socioscapes.newLayer}, and
 * {@link socioscapes.newViewGmap}.
 *
 * @namespace socioscapes
 * @requires module:fetchGoogleAuth
 * @requires module:fetchGoogleGeocode
 * @requires module:fetchGoogleBq
 * @requires module:fetchWfs
 * @requires module:newLayer
 * @requires module:newViewGmap
 */
var socioscapes = {};
Object.defineProperty(socioscapes, 'fetchGoogleAuth', {
    value: fetchGoogleAuth
});
Object.defineProperty(socioscapes, 'fetchGoogleGeocode', {
    value: fetchGoogleGeocode
});
Object.defineProperty(socioscapes, 'fetchGoogleBq', {
    value: fetchGoogleBq
});
Object.defineProperty(socioscapes, 'fetchWfs', {
    value: fetchWfs
});
Object.defineProperty(socioscapes, 'newLayer', {
    value: newLayer
});
Object.defineProperty(socioscapes, 'newViewGmap', {
    value: newViewGmap
});
module.exports = socioscapes;