/*jslint node: true */
/*global module, require, google, gapi, socioscapes*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js');
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetchScape.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
function fetchGoogleBq(config) {
    var callback = newCallback(arguments),
        clientId = (config && config.clientId) ? config.clientId:false,
        dataId = config ? config.id:false,
        valueIdProperty = (config && config.valueIdProperty) ? config.valueIdProperty.toLowerCase():'total',
        valueIndex = 0,
        featureIdProperty = (config && config.featureIdProperty) ? config.featureIdProperty.toLowerCase():'dauid',
        featureIndex = 1,
        projectId = config ? config.projectId:false,
        queryString = config ? config.queryString:false,
        request,
        bq = {},
        that = this,
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
                bq.byColumn = {};
                bq.byId = {};
                bq.geoJson = { "type": "FeatureCollection", "features": [] };
                bq.meta = {};
                bq.meta.bqQueryString = queryString;
                bq.meta.bqTableId = dataId;
                bq.meta.columns = [];
                bq.meta.totalRows = parseInt(result.totalRows);
                bq.meta.source = "Google BigQuery, " + gapiConfig.client.version;
                bq.raw = result;
                for (var i = 0; i < result.schema.fields.length; i++) {
                    bq.meta.columns.push(result.schema.fields[i].name.toLowerCase());
                    bq.byColumn[result.schema.fields[i].name.toLowerCase()] = [];
                    featureIndex = (result.schema.fields[i].name.toLowerCase() === featureIdProperty) ? i:featureIndex;
                    valueIndex = (result.schema.fields[i].name.toLowerCase() === valueIdProperty) ? i:valueIndex;
                }
                result.rows.forEach(function(row) {
                    for (var i = 0, parsedRow = {}; i < row.f.length; i++) {
                        if (i === valueIndex) {
                            row.f[i].v = parseFloat(row.f[i].v);
                        }
                        parsedRow[result.schema.fields[i].name] = row.f[i].v;
                        bq.byColumn[result.schema.fields[i].name].push(row.f[i].v);
                    }
                    bq.geoJson.features.push( { "type": "Feature", "properties": parsedRow } );
                    bq.byId[parsedRow[featureIdProperty]] = parsedRow;
                });
                if (bq.geoJson.features.length === bq.meta.totalRows) {
                    bq.geostats = new socioscapes.fn.geostats(bq.byColumn[valueIdProperty]);
                    callback(bq);
                }
            });
            return that;
        });
    }
}
module.exports = fetchGoogleBq;