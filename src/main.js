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
    viewGmap = require('./views/viewGmap.js');

/**
 * This is the root Socioscapes namespace and object.
 *
 * Requires the modules {@link module:fetchGoogleAuth}, {@link module:fetchGoogleGeocode},
 * {@link module:fetchGoogleBq}, {@link module:fetchWfs}, {@link module:newLayer}, and {@link module:viewGmap}.
 *
 * @namespace Socioscapes
 * @requires module:fetchGoogleAuth
 * @requires module:fetchGoogleGeocode
 * @requires module:fetchGoogleBq
 * @requires module:fetchWfs
 * @requires module:newLayer
 * @requires module:viewGmap
 */
module.exports = function () {
    Object.defineProperty(this, 'fetchGoogleAuth', {
        value: fetchGoogleAuth
    });
    Object.defineProperty(this, 'fetchGoogleGeocode', {
        value: fetchGoogleGeocode
    });
    Object.defineProperty(this, 'fetchGoogleBq', {
        value: fetchGoogleBq
    });
    Object.defineProperty(this, 'fetchWfs', {
        value: fetchWfs
    });
    Object.defineProperty(this, 'newLayer', {
        value: newLayer
    });
    Object.defineProperty(this, 'viewGmap', {
        value: viewGmap
    });
};