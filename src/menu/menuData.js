/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuData(context, command, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.bq = fetchGoogleBq;
    if (myCommand[command]) {
        this.dispatcher({ // todo jshint errors regarding 'this', however this method is always called with a context
                myFunction: myCommand[command],
                myArguments: [config]
            },
            function (result) {
                if (result) {
                    console.log('Data fetch has been complete.');
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            context.myScapeObjectValue[prop] = result[prop];
                        }
                    }
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid fetch function.');
    }
    callback(this);
    return this;
}
module.exports = menuData;