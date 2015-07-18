/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
// isInteger polyfill taken verbatim from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
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
var dispatch = require ('./dispatch.js'),
    state = require ('./state.js'),
    layer = require ('./layer.js'), // shortcut to socioscapes('myScape').state(0).layer
    view = require ('./view.js'), // shortcut to socioscapes('myScape').state(0).layer(0).view
    isValidName = require('./isValidName.js'),
    isValidUrl = require('./isValidUrl.js'),
    fetchLayer = require('./../fetch/fetchLayer.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchState = require('./../fetch/fetchState.js'),
    fetchView = require('./../fetch/fetchView.js'),
    newScape = require('./../construct/newScape.js'),
    newState = require('./../construct/newState.js'),
    storeScape = require('./../store/storeScape.js'),
    storeState = require('./../store/storeState.js'),
    removeState = require('./../remove/removeState.js');

    /**
     *  This is the root socioscapes namespace and object. socioscapes is stateless and does not store any session
     *  variables within its members (each call to socioscapes generates the same generic object).
     *
     * Requires the modules {@link dispatch}, {@link state}, {@link layer}, {@link view}, {@link isValidName},
     * {@link isValidUrl}, {@link fetchLayer}, {@link fetchScape}, {@link fetchState}, {@link fetchView},
     * {@link newScape}, {@link newState}, s{@link storeScape}, {@link storeState}, and {@link removeState}.
     *
     * @namespace socioscapes
     * @requires dispatch
     * @requires state
     * @requires layer
     * @requires view
     * @requires isValidName
     * @requires isValidUrl
     * @requires fetchLayer
     * @requires fetchScape
     * @requires fetchState
     * @requires fetchView
     * @requires newScape
     * @requires newState
     * @requires storeScape
     * @requires storeState
     * @requires removeState
     */
var s = {};
Object.defineProperty(s, 'fetchScape', {
    value: function(name, url, callback) {
        fetchScape(name, url, callback);
        return s;
    }
});
Object.defineProperty(s, 'newScape', {
    value: newScape
});
Object.defineProperty(s, 'storeScape', {
    value: storeScape
});
Object.defineProperty(s, 'fetchState', {
    value: fetchState
});
Object.defineProperty(s, 'newState', {
    value: newState
});
Object.defineProperty(s, 'removeState', {
    value: removeState
});
Object.defineProperty(s, 'storeState', {
    value: storeState
});
Object.defineProperty(s, 'state', {
    value: state
});
Object.defineProperty(s, 'layer', {
    value: layer
});
Object.defineProperty(s, 'view', {
    value: view
});
module.exports = function(name) {
    fetchScape(name, function(scape) {
        if (scape) {
            dispatch(scape);
        } else {
            console.log('Sorry, a state by that name does not exist in the current session.');
        }
    });
    return s;
};