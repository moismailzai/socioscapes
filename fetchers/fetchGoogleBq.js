/**
 * This METHOD authorizes and fetches a BigQuery request, then sends the returned data to be error checked and parsed.
 *
 * @function fetchGoogleBq
 * @param config {Object} Configuration parameters for Google Big Query (bqClientId, bqProjectId, bqQueryString).
 * @return this {Object}
 */

var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');

module.exports = function (config) {
    var data, _values, _gapiConfig, _bqClientId, _bqProjectId, _bqQueryString, _gapiConfig, _request, _totalRows, _currentRow;
    _currentRow = 0;
    _values = [];
    _bqClientId = config.bqClientId;
    _bqProjectId = config.bqProjectId;
    _bqQueryString = config.bqQueryString;
    _dataId = config.id;
    _bqQueryColumns = config.bqQueryColumns || 2;
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