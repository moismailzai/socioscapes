/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchWfs = require('./../fetch/fetchWfs.js');
function menuGeom(context, command, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.wfs = fetchWfs;
    if (myCommand[command]) {
        this.dispatcher({
                myFunction: myCommand[command],
                myArguments: [config]
            },
            function (result) {
                if (result) {
                    console.log('Geometry fetch has been complete.');
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            context.myScapeObjectValue[prop] = result[prop];
                        }
                    }
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid fetch function.')
    }
    callback(this);
    return this;
}
module.exports = menuGeom;