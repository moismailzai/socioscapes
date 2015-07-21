/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var isValidName = require('./../core/isValidName.js'),
    isKey = require('./../core/isKey.js'),
    newLayer = require('./../construct/newLayer.js');
/**
 * This constructor method returns an object of class {@linkcode MyState}.
 *
 * @method newState
 * @memberof! MyState
 * @return {Object} MySession
 */
module.exports = function newState(name, states, config) {
    var myState = {},
        callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson.state';
    if (isValidName(name) && !isKey(name, 'name', states)) {
        Object.defineProperty(myState, 'meta', {
            value: {}
        });
        Object.defineProperty(myState.meta, 'author', {
            get: function() { return _author },
            set: function(author) {_author = author}
        });
        Object.defineProperty(myState.meta, 'name', {
            get: function() { return _name },
            set: function(name) {_name = name }
        });
        Object.defineProperty(myState.meta, 'summary', {
            get: function() { return _summary },
            set: function(summary) {_summary = summary}
        });
        Object.defineProperty(myState.meta, 'type', {
            get: function() { return _type },
            set: function(type) {_type = type}
        });
        Object.defineProperty(myState, 'source', {
            get: function() { return _source },
            set: function(source) {_source = source}
        });
        Object.defineProperty(myState, 'layers', {
            value: []
        });
        newLayer('layer0', myState.layers, function(myLayer){
            myState.layers.push(myLayer);
        });
    } else {
        console.log('Sorry, unable to create a new state called "' + name + '" (does a state by that name already exist?).');
    }
    callback(myState);
    return myState;
};