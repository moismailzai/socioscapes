module.exports = function isKey(key, member, array) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;};
    for (var i = 0; i < array.length; i++) {
        if (key === array[i][member]) {
            callback(true);
        }
    }
    callback(false);
};