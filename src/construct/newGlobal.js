isGlobal = require('./../core/isGlobal.js');
module.exports = function newGlobal(name, object) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        myGlobal = false;
    if (isGlobal(name)) {
        console.log('Sorry, a global object by that name already exists.');
    } else {
        window[name] = object;
        myGlobal = window[name];
    }
    callback(myGlobal);
    return myGlobal;
};