/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
function extend(config) {
    var myExtension, myName, myPath, myTarget, i, ii;
    for (i = 0; i < config.length; i++) {
        myTarget = socioscapes.fn;
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
                console.log('Extending socioscapes.fn with "' + myPath + '".');
                myTarget[myName] = myExtension;
            } else {
                console.log('Sorry, unable to add your extension. Please check your .path string.');
            }
        }
    }
    return socioscapes.fn;
}
module.exports = extend;
