/*jslint node: true */
/*global module, require, google, gapi, socioscapes, this, execute, gapi, bigquery*/
'use strict';

function fetchGoogleBq(that, config) {
    var newCallback = fetchGoogleBq.prototype.newCallback,
        fetchGoogleAuth = fetchGoogleBq.prototype.fetchGoogleAuth,
        geostats = fetchGoogleBq.prototype.geostats;
    //
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
            gapi.client.load('bigquery', 'v2', function() {
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
    return that;
}
module.exports = fetchGoogleBq;