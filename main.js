/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ Copies have no rights
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

module.exports = function (pluginModule) {
    var s = {};

    Object.defineProperty(s, 'fetchGoogleAuth', {
        value: fetchGoogleAuth
    });
    Object.defineProperty(s, 'fetchGoogleGeocode', {
        value: fetchGoogleGeocode
    });
    Object.defineProperty(s, 'fetchGoogleBq', {
        value: fetchGoogleBq
    });
    Object.defineProperty(s, 'fetchWfs', {
        value: fetchWfs
    });
    Object.defineProperty(s, 'newLayer', {
        value: newLayer
    });
    Object.defineProperty(s, 'viewGmap', {
        value: viewGmap
    });
    if (pluginModule) {
        return pluginModule(s);
    }

    return s;
};