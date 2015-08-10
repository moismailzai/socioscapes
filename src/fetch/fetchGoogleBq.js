/*jslint node: true */
/*global module, require, google, gapi, bigquery, execute, jobs, fields, totalRows*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    bqParser = function(values, callback) {
        var thisRow = {};
        if (callback) {
            values.result.rows.forEach(function (row) {
                for (var i = 0; i < row.f.length; i++) {
                    thisRow[i] = row.f[i].v;
                }
                callback(thisRow);
            });
        }
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
        request,
        totalRows,
        values = [],
        clientId = config ? config.clientId:false,
        dataId = config ? config.id:false,
        projectId = config ? config.projectId:false,
        queryString = config ? config.queryString:false,
        gapiConfig = {
            auth: {
                "client_id": clientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': projectId,
                'timeoutMs': '30000',
                'query': queryString
            }
        };
    if (config) {
        fetchGoogleAuth(gapiConfig, function() {
            request = gapi.client.bigquery.jobs.query(gapiConfig.query);
            request.execute(function(result) {
                for (var i = 0; i < result.schema.fields.length; i++) {
                    data['column'+i] = result.schema.fields[i].name;
                }
                data.columns = result.schema.fields.length;
                totalRows = parseFloat(result.result.totalRows);
                data.rows = totalRows;
                bqParser(result, function (parsed) {
                    values.push(parsed);
                    if (values.length === totalRows) {
                        data.values = values;
                        data.query = queryString;
                        data.name = dataId;
                        callback(data);
                        return data;
                    }
                });
            });
        });
    }
}
module.exports = fetchGoogleBq;