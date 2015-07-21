/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
var newDispatcher = require ('./../construct/newDispatcher.js'),
    state = require ('./../core/state.js'),
    layer = require ('./../core/layer.js'), // shortcut to socioscapes('myScape').state(0).layer
    view = require ('./../core/view.js'), // shortcut to socioscapes('myScape').state(0).layer(0).view
    isValidName = require('./../core/isValidName.js'),
    isValidUrl = require('./../core/isValidUrl.js'),
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
 * Requires the modules {@link newDispatcher}, {@link state}, {@link layer}, {@link view}, {@link isValidName},
 * {@link isValidUrl}, {@link fetchLayer}, {@link fetchScape}, {@link fetchState}, {@link fetchView},
 * {@link newScape}, {@link newState}, s{@link storeScape}, {@link storeState}, and {@link removeState}.
 *
 * @namespace socioscapes
 * @requires newDispatcher
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
module.exports = function newS(myScape) {
    var myS = {};
    Object.defineProperty(myS, '_myScape', {
        value: myScape
    });
    Object.defineProperty(myS, 'fetchScape', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: fetchScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'newScape', {
        value: function() {
            console.log(myScape);
            myScape.dispatch = {
                myThis: myS,
                myFunction: newScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'storeScape', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: storeScape,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'fetchState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: fetchState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'newState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: newState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'removeState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: removeState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'storeState', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: storeState,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'state', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: state,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'layer', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: layer,
                myArguments: arguments
            };
        }
    });
    Object.defineProperty(myS, 'view', {
        value: function() {
            myScape.dispatch = {
                myThis: myS,
                myFunction: view,
                myArguments: arguments
            };
        }
    });
    return myS;
};