/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetch = require ('./../fetchScapeObject/fetchScapeObject.js'),
    newCallback = require('./newDispatcherCallback.js'),
    newScapeObject = require('./../construct/newScapeObject.js');
/**
 * This
 *
 * @method newData
 * @memberof! socioscapes
 * @return
 */
function newData(object) {
    var callback = newCallback(arguments),
        myData = false,
        Data = function() {
            Object.defineProperty(this, 'data', {
                value: function (fetcher, config) {
                    if (!fetcher || !config) {
                        return _myData.values;
                    }
                    if (fetcher && config && typeof fetcher === "function") {
                        fetcher(config, function (result) {
                            if (typeof result.values[0] !== 'number') {
                                alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                            } else {
                                _myData = result;
                                _myGeostats = new Geostats(result.values);
                            }
                        });
                    } else if (fetcher && !config && typeof fetcher === "object") {
                        if (fetcher.url && fetcher.id && fetcher.values) {
                            if (typeof result.values[0] !== 'number') {
                                alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                            } else {
                                _myData = fetcher;
                                _myGeostats = new Geostats(result.values);
                            }
                        }
                    }
                }
            });
        }
}