/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuConfig(command, layer, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.gmap = setGmap;
    myCommand.gmaplayer = setGmapLayer;
    myCommand.gmaplabel = setGmapLabel;
    myCommand.datatable = setDatatable;
    myCommand.breaks = setBreaks;
    myCommand.class = setClassification;
    myCommand.colours = setColourscale;
    myCommand.domain = setDataDomain;
    if (myCommand[command]) {
        this.dispatcher({
                myFunction: myCommand[command],
                myArguments: [config, layer]
            },
            function (result) {
                if (result) {
                    console.log('Config element ' + command + ' has been updated.');
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid configuration function.')
    }
    callback(this);
    return this;
}
module.exports = menuConfig;