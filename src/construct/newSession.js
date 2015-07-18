/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This constructor method returns a new array object of class {@linkcode MySession}.
 *
 * @method newSession
 * @memberof! socioscapes
 * @return {Array} MySession
 */
module.exports = function newSession() {
    /**
     * Each MySession object consists of a {@linkcode MySession.states} array and a {@linkcode MySession.meta} object.
     *
     * @namespace MySession
     */
    // TODO create comprehensive documentation for the following session variables
    var MySession = {};
    /**
     * This array holds paired {@linkcode MySession.data} and {@linkcode MySession.settings} entries.
     * Each pair contains all of the data, geometry, and settings necessary to render a screen state.
     *
     * @member {array} states
     * @namespace MySession
     */
    Object.defineProperty(MySession, 'states', {
        value: []
    });
    /**
     * This member stores metadata about the MySession object.
     *
     * @member {Object} meta
     * @namespace MySession
     */
    Object.defineProperty(MySession, 'meta', {
        value: {}
    });
};