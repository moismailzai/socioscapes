/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This constructor method returns an object of class {@linkcode MyState}.
 *
 * @method newState
 * @memberof! MyState
 * @return {Object} MySession
 */
module.exports = function newState() {
    /**
     * Each MySession object consists of a {@linkcode MySession.states} array and a {@linkcode MySession.meta} object.
     *
     * @namespace MyState
     */
    var MySession = {};
    /**
     * This member ...
     *
     * @member {Object} inputKeyboardShortcuts
     * @namespace MySession
     */
    Object.defineProperty(MySession.settings, 'interfaceLegend', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'interfacePanels', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'interfaceShortcuts', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'interfaceTheme', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'gMapBounds', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'gMapTheme', {
        value: false,
        configurable: true
    });
    Object.defineProperty(MySession.settings, 'gMapZoom', {
        value: false,
        configurable: true
    });
}