/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This method parses and sorts the results of a Google Big Query fetch to fit the format [key: value].
 *
 * @function fetchGoogleBq_Sort
 * @memberof! socioscapes
 * @param {Object} bqResult - The results of a Google Big Query fetch.
 * @param {Function} callback - This is a mandatory callback that returns each row of the asynchronous fetch.
 */
module.exports = function fetchGoogleBq_Sort(bqResult) {
    var callback = arguments[arguments.length - 1];
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
    var i,
        thisRow = {};
    if (!callback) {
        return;
    }
    callback = (typeof callback === 'function') ? callback : function () { };
    bqResult.result.rows.forEach(function (row) {
        for (i = 0; i < row.f.length; i++) {
            thisRow[i] = row.f[i].v;
        }
        callback(thisRow);
    });
};