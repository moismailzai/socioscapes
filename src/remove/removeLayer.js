module.exports = function removeLayer(myScape) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    callback();
};
