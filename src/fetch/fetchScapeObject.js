/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchFromScape = require('./fetchFromScape.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This
 *
 * @method fetcher
 * @memberof! socioscapes
 * @return
 */
function fetchScapeObject(object, parent) {
    var callback = newDispatcherCallback(arguments),
        myParent = (isValidObject(parent)) ? parent:false,
        myGlobal = (parent) ? false:fetchGlobal(object),
        myName = (isValidName(object)) ? object:false,
        myObject = (isValidObject(object)) ? object:false,
        myUrl = (isValidUrl(parent)) ? parent:false;
    if (myName) {
        if (myUrl) {
            // fetching code here
        }
        if (myParent) {
            if (myParent.states) {
                myObject = fetchFromScape(object, 'name', myParent.states);
            } else if (myParent.layers) {
                myObject = fetchFromScape(object, 'name', myParent.layers);
            } else if (myParent.views) {
                myObject = fetchFromScape(object, 'name', myParent.views);
            }
        }
        if (myGlobal) {
            myObject = (isValidObject(myGlobal)) ? myGlobal: false;
        }
    }
    callback(myObject);
    return(myObject);
}
module.exports = fetchScapeObject;