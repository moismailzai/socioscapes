module.exports = function isGlobal(name) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        global = false;
    if (window[name]) {
        global = true;
    }
    callback(global);
    return global;
};