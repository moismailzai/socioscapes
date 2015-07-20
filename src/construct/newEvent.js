/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
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
module.exports = function newEvent(name, message) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result; };
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
};