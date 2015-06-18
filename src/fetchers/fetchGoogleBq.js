/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');
/**
 * This METHOD authorizes and fetches a BigQuery request, then sends the returned data to be error checked and parsed.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetch.
 * @param {String} config.bqClientId - The Google Big Query client id.
 * @param {String} config.bqProjectId - The Google Big Query project id.
 * @param {String} config.bqQueryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
module.exports = function fetchGoogleBq(config) {
    var data,
        _bqClientId = config.bqClientId,
        _bqProjectId = config.bqProjectId,
        _bqQueryString = config.bqQueryString,
        _currentRow = 0,
        _dataId = config.id,
        _request,
        _totalRows,
        _values = [],
        _gapiConfig = {
            auth: {
                "client_id": _bqClientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': _bqProjectId,
                'timeoutMs': '30000',
                'query': _bqQueryString
            }
        };

    fetchGoogleAuth(_gapiConfig, function () {
        _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
        _request.execute(function (bqResult) {
            console.log(bqResult);
            _totalRows = bqResult.result.totalRows;
            fetchGoogleBq_Sort(bqResult, function (sortedResult) {
                _values.push(sortedResult);
                _currentRow++;
                if (_currentRow === _totalRows) {
                    data = {};
                    data.values = _values;
                    data.url = _bqQueryString;
                    data.id = _dataId;
                    return [data, true];
                }
            });
        });
    });
};