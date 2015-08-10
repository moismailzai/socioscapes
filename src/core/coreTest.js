/*jslint node: true */
/*global module*/
'use strict';
function coreTest(option, config) {
    var myOption = {};
    myOption.bq = {
        id: '2011_census_of_canada',
        clientId: config ? config:'424138972496-nlcip7t83lb1ll7go1hjoc77jgc689iq.apps.googleusercontent.com',
        projectId: config ? config.split('-')[0]:'424138972496',
        queryString: "SELECT Geo_Code, Total FROM [2011_census_of_canada.british_columbia_da] WHERE (Characteristic CONTAINS 'Population in 2011' AND Total IS NOT NULL) GROUP BY Geo_Code, Total, LIMIT 10;"
    };
    myOption.wfs = "http://app.socioscapes.com:8080/geoserver/socioscapes/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=cmaname=%27Toronto%27";
    myOption.all = {
        bq: myOption.bq,
        wfs: myOption.wfs
    };
    return myOption[option];
}
module.exports = coreTest;