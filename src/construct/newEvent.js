/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This function is a CustomEvent wrapper that fires an arbitrary event. Socioscapes methods use it to signal updates.
 * For more information on CustomEvent, see {@link https://developer.mozilla.org/en/docs/Web/API/CustomEvent}.
 *
 * @function newEvent
 * @memberof! socioscapes
 * @param {String} name - The name of the new event (this is what your event handler will listen for).
 * @param {String} message - The content of the event.
 */
// TODO proper documentation of events
function newEvent(name, message) {
    var callback = newDispatcherCallback(arguments);
    new CustomEvent(
        name,
        {
            detail: {
                message: message,
                time: new Date()
            },
            bubbles: true,
            cancelable: true
        }
    );
    callback(true);
    return true;
}
module.exports = newEvent;