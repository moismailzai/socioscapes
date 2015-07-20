/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetch.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
module.exports = function fetchGoogleBq(config) {
    var callback = arguments[arguments.length - 1];
    callback = (typeof callback === 'function') ? callback:function(result) { return result; };
    var data = {},
        _clientId = config.clientId,
        _dataId = config.id,
        _projectId = config.projectId,
        _queryString = config.queryString,
        _request,
        _totalRows,
        _values = [],
        _gapiConfig = {
            auth: {
                "client_id": _clientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': _projectId,
                'timeoutMs': '30000',
                'query': _queryString
            }
        };
    callback = (typeof callback === 'function') ? callback : function () { };

    fetchGoogleAuth(_gapiConfig, function () {
        _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
        _request.execute(function (bqResult) {
            _totalRows = parseFloat(bqResult.result.totalRows);
            fetchGoogleBq_Sort(bqResult, function (sortedResult) {
                _values.push(sortedResult);
                if (_values.length === _totalRows) {
                    data.values = _values;
                    data.url = _queryString;
                    data.id = _dataId;
                    callback(data);
                }
            });
        });
    });
};