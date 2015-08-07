/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchScapeObject = require ('./../fetch/fetchScapeObject.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeObject = require('./../construct/newScapeObject.js');
/**
 * This
 *
 * @method newMenu
 * @memberof! socioscapes
 * @return
 */
function newScapeMenu(scapeObject) {
    var callback = newDispatcherCallback(arguments),
        myMenu = false,
        ScapeMenu = function(myObject) {
            var that = this,
                mySchema = myObject.meta.schema,
                myContainer = myObject[mySchema.container],
                myParent = myObject.meta.schema.parent,
                myType = mySchema.type,
                newMenu,
                newObject;
            Object.defineProperty(this, 'drop', {
                value: function() {
                    delete window[myObject];
                }
            });
            Object.defineProperty(this, 'test', {
                value: function(option, config) {
                    var myOption = {},
                        myConfig = config || "50";
                    myOption.bq = {
                        id: '2011_census_of_canada',
                        clientId: '424138972496-nlcip7t83lb1ll7go1hjoc77jgc689iq.apps.googleusercontent.com',
                        projectId: '424138972496',
                        queryString: "SELECT Geo_Code, Total FROM [2011_census_of_canada.british_columbia_da] WHERE (Characteristic CONTAINS 'Population in 2011' AND Total IS NOT NULL) GROUP BY Geo_Code, Total, LIMIT " + myConfig + ";"
                    };
                    myOption.wfs = "http://app.socioscapes.com:8080/geoserver/socioscapes/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=cmaname=%27Toronto%27";
                    return myOption[option];
                }
            });
            Object.defineProperty(this, 'meta', {
                value: function() {
                    return  myObject.meta;
                },
                configurable: false
            });
            Object.defineProperty(this, 'new', {
                value: function (name) {
                    name = name || mySchema.name + mySchema.parent.length;
                    myObject.dispatcher({
                            myFunction: newScapeObject,
                            myArguments: [name, myParent, myType]
                        },
                        function (result) {
                            if (result) {
                                newObject = result;
                                newMenu = new ScapeMenu(newObject);
                            }
                        });
                    return newMenu;
                }
            });
            Object.defineProperty(this, 'store', {
                value: ''
            });
            for (var i = 0; i < mySchema.children.length; i++) {
                (function(myChild) {
                    var initValue,
                        defaultName = myChild.item || myChild.container;
                    if (myObject.meta.schema[myChild.container].isMenuItem) { // todo. this should be simplified. right
                    // now, it uses an internal 'schema' map, defined in newScapeSchema, which tells it wether a given
                    // object should have a special menu functionality... it certainly works and allows arbitrary changes
                    // to the resulting menus without editing this file, but it's a bit confusing and can surely be
                    // simplified.
                        initValue = function(cmd, cfg) {
                            myObject.dispatcher({
                                myFunction: myObject.meta.schema[myChild.container].menu,
                                myArguments: [cmd, cfg, myObject[myChild.container]],
                                myThis: myObject
                            },function(result) {
                                if (result) {
                                    return result
                                }
                            });
                            return this
                        };
                    } else {
                        initValue = function(name) {
                            name = name || defaultName;
                            myObject.dispatcher({
                                myFunction: fetchScapeObject,
                                myArguments: [name, myObject]
                            },function(result) {
                                if (result) {
                                    newObject = result;
                                    newMenu = new ScapeMenu(newObject);
                                }
                            });
                            return newMenu;
                        };
                    }
                    Object.defineProperty(that, myChild.name, {
                        value: initValue
                    });
                })(mySchema.children[i]);
            }
            return this;
        };
    if (isValidObject(scapeObject)) {
        myMenu = new ScapeMenu(scapeObject);
    }
    callback(myMenu);
    return myMenu;
}
module.exports = newScapeMenu;