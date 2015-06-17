/*jslint node: true */
'use strict';
/**
 * This METHOD sorts the results of a Google Big Query fetch to fit the format [key: value].
 *
 * @function fetchGoogleBq_Sort
 * @memberof! socioscapes
 * @param {Object} bqResult - The results of a Google Big Query fetch.
 * @param {Function} callback - This is a mandatory callback that returns each row of the asynchronous fetch.
 */
module.exports = function fetchGoogleBq_Sort(bqResult, callback) {
    var i,
        thisRow = {};
    if (!callback) {
        return;
    }
    callback = (typeof callback === 'function') ? callback : function () { };
    bqResult.result.rows.forEach(function (row) {
        thisRow[0] = parseFloat(row.f[0].v);
        for (i = 1; i < row.f.length; i++) {
            thisRow[i] = parseFloat(row.f[i].v);
        }
        callback(thisRow);
    });
};