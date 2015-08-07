/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    bqSort = function (bq) {
        var callback = newDispatcherCallback(arguments),
            thisRow = {};
        if (!callback) {
            return;
        }
        callback = (typeof callback === 'function') ? callback : function () { };
        bq.result.rows.forEach(function (row) {
            for (var i = 0; i < row.f.length; i++) {
                thisRow[i] = row.f[i].v;
            }
            callback(thisRow);
        });
    };
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetchScapeObject.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
function fetchGoogleBq(config) {
    var callback = newDispatcherCallback(arguments),
        data = {},
        _clientId = config ? config.clientId:_clientId ,
        _dataId = config ? config.id:_dataId,
        _projectId = config ? config.projectId:_projectId,
        _queryString = config ? config.queryString:_queryString,
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
    if (config) {
        fetchGoogleAuth(_gapiConfig, function () {
            _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
            _request.execute(function (bqResult) {
                for (var i = 0; i < bqResult.schema.fields.length; i++){
                    data['column'+i] = bqResult.schema.fields[i].name
                }
                _totalRows = parseFloat(bqResult.result.totalRows);
                data.columns = bqResult.schema.fields.length;
                data.rows = _totalRows;
                bqSort(bqResult, function (sortedResult) {
                    _values.push(sortedResult);
                    if (_values.length === _totalRows) {
                        data.values = _values;
                        data.query = _queryString;
                        data.name = _dataId;
                        callback(data);
                        return data;
                    }
                });
            });
        });
    }
}
module.exports = fetchGoogleBq;