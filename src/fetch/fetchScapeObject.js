/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
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
function fetchScapeObject(object, source, container) {
    var callback = newDispatcherCallback(arguments),
        // was an object sent to be validated? if so let's prioritize sending it back
        myObject = (typeof object === 'string') ? fetchGlobal(object):(isValidObject(object) ? object:false),
        // otherwise was a parent object provided?
        myParent = myObject ? false:isValidObject(source),
        // if not was a parent url provided?
        myUrl = myParent ? false:isValidUrl(source);
    // if we don't have an object and we do have either a name or url, proceed
    if (!myObject && (myParent || myUrl)) {
        if (myParent) {
            myObject = fetchFromScape(object, 'name', source[container]);
        } else {
            // some myUrl thing
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScapeObject;