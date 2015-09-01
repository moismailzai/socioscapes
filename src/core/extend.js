/*jslint node: true */
/*global module, require, socioscapes, document, window, google, gapi*/
'use strict';
function extend(config) {
    var myExtension, myName, myPath, myTarget, i, ii;
    for (i = 0; i < config.length; i++) {
        myTarget = extend.prototype;
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
                myTarget[myName].prototype = extend.prototype;
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
    return extend.prototype;
}
module.exports = extend;