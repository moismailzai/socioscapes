module.exports = function removeState(myScape, myState) {
    var callback = arguments[arguments.length - 1];
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
    callback();
};
