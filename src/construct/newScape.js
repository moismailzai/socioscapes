var isValidName = require('./../core/isValidName.js'),
    isGlobal = require('./../core/isGlobal.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newState = require('./../construct/newState.js');
module.exports = function newScape(name, config) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson',
        myScape = (isGlobal(name)) ? true:false;
    if (isValidName(name) && !myScape) {
        myScape = {};
        Object.defineProperty(myScape, 'meta', {
            value: {}
        });
        Object.defineProperty(myScape.meta, 'author', {
            get: function(){ return _author},
            set: function(author) {_author = author}
        });
        Object.defineProperty(myScape.meta, 'name', {
            get: function(){ return _name},
            set: function(name) {_name = name }
        });
        Object.defineProperty(myScape.meta, 'summary', {
            get: function(){ return _summary},
            set: function(summary) {_summary = summary}
        });
        Object.defineProperty(myScape.meta, 'type', {
            get: function(){ return _type},
            set: function(type) {_type = type}
        });
        Object.defineProperty(myScape.meta, 'source', {
            get: function(){ return _source},
            set: function(source) {_source = source}
        });
        Object.defineProperty(myScape, 'states', {
            value: []
        });
        newState('state0', myScape.states, function(myState){
            myScape.states.push(myState);
            newGlobal(name, myScape);
        });
    } else {
        console.log('Sorry, unable to create a new scape called "' + name + '" (does a scape by that name already exist?).')
    }
    callback(myScape);
    return myScape;
};