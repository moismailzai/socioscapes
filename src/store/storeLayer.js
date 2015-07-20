module.exports = function storeLayer(myScape, myState) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result; };
    callback();
};
