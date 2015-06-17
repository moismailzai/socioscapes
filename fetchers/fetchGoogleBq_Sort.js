'use strict';
/**
 * This METHOD sorts the results of a Google Big Query fetch to fit the format [key: value].
 *
 * @function sortBigQuery
 * @param bq {Object} The results of a Google Big Query fetch.
 * @param [callback] {Function} Optional callback.
 */
module.exports = function (bq, columns, callback){
    var thisRow = {};
    bq.result.rows.forEach (function(row) {
        thisRow[columns[0]] = parseFloat(row.f[0].v);
        for (i = 1; i < row.f.length; i++) {
            thisRow[columns[i]] = parseFloat(row.f[i].v);
        }
        callback(thisRow);
    });
};