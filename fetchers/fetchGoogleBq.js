'use strict';
var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');
/**
 * This METHOD authorizes and fetches a BigQuery request, then sends the returned data to be error checked and parsed.
 *
 * @function fetchGoogleBq
 * @param config {Object} Configuration parameters for Google Big Query.
 * @param config.bqClientId {String} The Google Big Query client ID.
 * @param config.bqProjectId {String} The Google Big Query project ID.
 * @param config.bqQueryColumns {String} The number of Google Big Query columns being queried.
 * @param config.bqQueryString {String} The Google Big Query query string.
 * @param config.id {String} The ID column (the values in this column are used to match geom ID values).
 * @return this {Object}
 */
module.exports = function (config) {
    var data,
        _bqClientId = config.bqClientId,
        _bqProjectId = config.bqProjectId,
        _bqQueryColumns = config.bqQueryColumns || 2,
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
        _request.execute(function (queryResult) {
            console.log(queryResult);
            _totalRows = queryResult.result.totalRows;
            fetchGoogleBq_Sort(queryResult, _bqQueryColumns, function(sortedResult) {
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