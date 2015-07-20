module.exports = function removeLayer(myScape) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result; };
    callback();
};
