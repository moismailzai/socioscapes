/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms.
 * The modular API fuses together various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *      Source code...................... http://github.com/moismailzai/SocioscapesGIS
 *      Reference implementation......... http://app.socioscapes.com
 *      License.......................... MIT license (free as in beer & speech)
 *      Copyright........................ Ideas are free
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at
 * the University of Toronto.
 */
var fetchGoogleAuth = require('./fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./fetchers/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./fetchers/fetchGoogleBq.js'),
    fetchWfs = require('./fetchers/fetchWfs.js'),
    newLayer = require('./core/newLayer.js'),
    setViewGmap = require('./views/setViewGmap.js');

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
    Object.defineProperty(s, 'setViewGmap', {
        value: setViewGmap
    });

    if (pluginModule) {
        return pluginModule(s);
    }
    return s;
};
