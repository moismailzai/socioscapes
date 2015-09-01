/*jslint node: true */
/*global module, require, document, window*/
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
// CustomEvent Polyfill
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
// TODO proper documentation of events
function newEvent(name, message) {
    var myEvent;
    myEvent = new CustomEvent(name, {"detail": message });
    return (myEvent);
}
module.exports = newEvent;