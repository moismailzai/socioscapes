/*jslint node: true */
/*global module, require, gapi*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    geostats = require('./../lib/geostats.min.js');
/**
 * This internal method fetches data from Google BigQuery. If necessary, it also requests a gapi authorization token and
 * loads the gapi BigQuery client.
 *
 * If successful, callsback with fetch results.
 *
 * @function fetchGoogleBq
 * @memberof socioscapes
 * @param {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 * @param {Object} [config] - A configuration object for the gapi.auth and gapi.config api. If missing, defaults will
 * be used (see the 'gapiConfig' variable).
 * @return {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 */
function fetchGoogleBq(scapeObject, config) {
    config = config || {};
    var callback = newCallback(arguments),
        authClientId = config.clientId || false,
        authImmediate = config.immediate || false,
        authScope = config.scope || false,
        authToken = config.auth || false,
        featureIdProperty = (config && config.featureIdProperty) ? config.featureIdProperty.toLowerCase():'dauid',
        indexOfFeatureProperty = 1,
        indexOfValueProperty = 0,
        normalizationIdProperty = (config && config.normalizationIdProperty) ? config.normalizationIdProperty.toLowerCase(): 'none',
        queryDataId = config.id || false,
        queryFetcher,
        queryProjectId = config.projectId || false,
        queryRequest,
        queryResult,
        queryString = config.queryString || false,
        valueIdProperty = (config && config.valueIdProperty) ? config.valueIdProperty.toLowerCase():'total',
        gapiConfig = {
            auth: {
                "client_id": authClientId,
                'scope': authScope || ['https://www.googleapis.com/auth/bigquery'],
                'immediate': authImmediate || true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': queryProjectId,
                'timeoutMs': '30000',
                'query': queryString
            }
        };
        if (authToken) {
            gapi.auth.setToken({
                access_token: authToken.access_token
            });
            gapi.client.load(gapiConfig.client.name, gapiConfig.client.version, function() {
                queryFetcher(authToken);
            });
        } else {
            fetchGoogleAuth(gapiConfig, function () {
                queryFetcher();
            });
        }
        queryFetcher = function() {
            queryRequest = gapi.client.bigquery.jobs.query(gapiConfig.query);
            queryRequest.execute(function(result) {
                queryResult = {
                    meta: {
                        bqQueryString: queryString,
                        bqTableId: queryDataId,
                        columns: [],
                        errors: [],
                        featureIdProperty: featureIdProperty,
                        normalizationIdProperty: normalizationIdProperty,
                        valueIdProperty: valueIdProperty,
                        source: "Google BigQuery, " + gapiConfig.client.version,
                        totalRows: parseInt(result.totalRows)
                    },
                    byColumn: {},
                    byId: {},
                    geoJson: {
                        "type": "FeatureCollection",
                        "features": []
                    },
                    raw: result
                };
                for (var i = 0; i < result.schema.fields.length; i++) {
                    queryResult.meta.columns.push(result.schema.fields[i].name.toLowerCase());
                    queryResult.byColumn[result.schema.fields[i].name.toLowerCase()] = [];
                    indexOfFeatureProperty = (result.schema.fields[i].name.toLowerCase() === featureIdProperty) ? i:indexOfFeatureProperty;
                    indexOfValueProperty = (result.schema.fields[i].name.toLowerCase() === valueIdProperty) ? i:indexOfValueProperty;
                }
                result.rows.forEach(function(row) {
                    for (var i = 0, parsedRow = {}; i < row.f.length; i++) {
                        if (isNaN(row.f[i].v)) {
                            queryResult.meta.errors.push(row.f[i]);
                            row.f[i].v = 0;
                        }
                        if (i === indexOfValueProperty) {
                            row.f[i].v = parseFloat(row.f[i].v);
                        }
                        if (isNaN(row.f[i].v)) {
                            queryResult.meta.errors.push(row.f[i]);
                            row.f[i].v = 0;
                        }
                        parsedRow[result.schema.fields[i].name] = row.f[i].v;
                        queryResult.byColumn[result.schema.fields[i].name].push(row.f[i].v);
                    }
                    queryResult.geoJson.features.push( { "type": "Feature", "properties": parsedRow } );
                    queryResult.byId[parsedRow[featureIdProperty]] = parsedRow;
                });
                queryResult.geostats = new geostats(queryResult.byColumn[valueIdProperty]);
                callback(queryResult);
            });
        };
    return scapeObject;
}
module.exports = fetchGoogleBq;