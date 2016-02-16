/*jslint node: true */
/*global module, require, socioscapes, document, window, google, gapi*/
'use strict';
/**
 * The socioscapes structure is inspired by the jQuery team's module management system. To extend socioscapes, you
 * simply need to call 'socioscapes.extender' and provide an array of entries that are composed of an object with
 * '.path' (a string), and '.extension' (a value) members. The '.path'
 *
 * @function extender
 * @param {Object[]} config - A valid socioscapes extension configuration.
 * @param {string} config[].path - Tells the API where to store your extension. The path for most modules will be the
 * root path, which is socioscapes.fn. The name of your module should be prefixed such that existing elements can access
 * it. For instance, if you have created a new module that retrieves data from a MySql server, you'd want to use the
 * 'fetch' prefix (eg. 'fetchMysql').
 * @param {string} config[].alias - A shorter alias that doesn't follow the above naming standards.
 * @param {Boolean} config[].silent - If true, supresses console.log messages.
 * @param {Object} config[].extension - Your extension.
 * */
function extender(config) {
    var myExtension, myName, myPath, i, ii,
        myTarget = extender.prototype;
    for (i = 0; i < config.length; i++) {
        myPath = (typeof config[i].path === 'string') ? config[i].path:false;
        myExtension = config[i].extension || false;
        if (myPath && myExtension) {
            if (myPath.indexOf('/') > -1){
                myPath = myPath.split('/');
                for (ii = 0; myTarget[myPath[ii]] ; ii++) {
                    myTarget = myTarget[myPath[ii]];
                }
                myName = myPath[ii];
            } else {
                myName = myPath;
            }
            if (myTarget) {
                myTarget[myName] = myExtension;
                myTarget[myName].prototype = extender.prototype;
                if (config[i].alias) {
                    myTarget.schema.alias[config[i].alias] = myTarget[myName];
                }
                if (!config[i].silent) {
                    console.log('Extended socioscapes.fn with "' + myPath + (config[i].alias ? ('" alias "' + config[i].alias + '".'):('".')));
                }
            } else {
                console.log('Sorry, unable to add your extension. Please check the .path string.');
            }
        }
    }
}
module.exports = extender;