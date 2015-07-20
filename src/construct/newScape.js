var isValidName = require('./../core/isValidName.js');
module.exports = function newScape(name, config) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        _author = (config && config.author) ? config.author:'',
        _name = (config && config.name) ? config.name:name,
        _source = (config && config.source) ? config.source:'',
        _summary = (config && config.summary) ? config.summary:'',
        _type = (config && config.author) ? config.summary:'scapeJson';
    if (isValidName(name) && !window[name]) {
        window[name] = {};
        Object.defineProperty(window[name], 'meta', {
            value: {}
        });
        Object.defineProperty(window[name].meta, 'author', {
            get: _author,
            set: function(author) {_author = author}
        });
        Object.defineProperty(window[name].meta, 'name', {
            get: _name,
            set: function(name) {_name = name }
        });
        Object.defineProperty(window[name].meta, 'summary', {
            get: _summary,
            set: function(summary) {_summary = summary}
        });
        Object.defineProperty(window[name].meta, 'type', {
            get: _type,
            set: function(type) {_type = type}
        });
        Object.defineProperty(window[name].meta, 'source', {
            get: _source,
            set: function(source) {_source = source}
        });
        Object.defineProperty(window[name], 'states', {
            value: []
        });
        newState('state0', window[name].states, function(myState){
            window[name].states.push(myState);
            callback(window[name]);
        });
    } else {
        console.log('Sorry, unable to create a new scape called "' + name + '" (does a scape by that name already exist?).')
        callback(false)
    }
};