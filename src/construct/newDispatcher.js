/*jslint node: true */
/*global module, require*/
'use strict';
var newEvent = require('./../construct/newEvent.js');
/**
 * The {@link socioscapes} {@link Dispatcher} class helps to facilitate asynchronous method chaining and queues. Socioscapes
 * associates every 'scape' object with a unique dispatcher instance and id. The dispatcher allows for API calls to be
 * queued and synchronously resolved on a per-scape basis by attaching a unique dispatcher instance to every scape. The
 * api itself remains asynchronous. Calls to the dispatcher are expeted to provide an arguments array, myArguments, and
 * a function, myFunction. The first argument in myArguments should always be the object that myFunction modifes and/or
 * returns. myFunction is evaluated for the number of expected arguments (myFunction.length) and the dispatcher appends
 * null values for expected arguments that are missing. This is done so that a callback function can be appended to the
 * array and all functions that are executed through the dispatcher can safely assume that the element at index
 * myArguments.length is the dispatcher callback. Finally, a queue item consisting of the myFunction and myArguments
 * members is pushed into the dispatcher's queue array. The dispatcher works through each item in its queue by executing
 * myFunction(myArguments) and waiting for the callback function to fire an event that signals that the function has
 * returned a value and the dispatcher can safely move on to the next item its queue.
 *
 * @function newDispatcher
 * @memberof socioscapes
 * @return {Function}
 * */
function newDispatcher() {
    /**
     * Represents a {@link ScapeObject} dispatcher.
     * @namespace Dispatcher
     * @constructor
     */
    var Dispatcher = function() {
        var dispatcherId = new Date().getTime().toString() + Math.random().toString().split('.')[1], // unique ID,
            dispatcherQueue = [],
            dispatcherReady = true,
            queueItem,
            that = this;
        // add a unique event listener persistent to this dispatcher instance
        document.addEventListener("socioscapes.dispatched." + dispatcherId, function(event) {
            dispatcherReady = true;
            that.dispatch();
        });
        /**
         * Calls to the dispatcher are expeted to provide an arguments array, myArguments, and a function, myFunction.
         * The first argument in myArguments should always be the object that myFunction modifes and/or returns.
         * myFunction is evaluated for the number of expected arguments (myFunction.length) and the dispatcher appends
         * null values for expected arguments that are missing. This is done so that a callback function can be appended
         * to the array and all functions that are executed through the dispatcher can safely assume that the element at
         * index myArguments.length is the dispatcher callback. Finally, a queue item consisting of the myFunction and
         * myArguments members is pushed into the dispatcher's queue array.
         *
         * @memberof Dispatcher#
         * @function dispatch
         * @param {object} [config]
         * */
        Object.defineProperty(this, 'dispatch', {
            value: function (config) {
                if (config) {
                    config.myArguments.unshift(config.myContext);
                    for (; config.myFunction.length > config.myArguments.length; ) {
                        config.myArguments.push(null);
                    } // pack arguments array with null values if there are missing params so that the last param is always the dispatcher callback
                    config.myArguments.push(function(result) { // append the dispatcher callback to the arguments array
                        config.myCallback(result);
                        newEvent("socioscapes.dispatched." + dispatcherId, result);
                    }); // this event executes the callback and triggers the next item in the queue to be processed
                    dispatcherQueue.push({ // push the function and argument array to the dispatcher queue
                        "myArguments": config.myArguments,
                        "myFunction": config.myFunction
                    });
                }
                if (dispatcherReady && dispatcherQueue.length > 0) {
                    dispatcherReady = false;
                    queueItem = dispatcherQueue.shift();
                    queueItem.myFunction.apply(that, queueItem.myArguments);
                }
                return this;
            }
        });
        /**
         * Returns the id specific to this {@link Dispatcher} instance. Useful if you want to setup external listeners for
         * dispatcher events (which fire in the "socioscapes.dispatched.id" pattern).
         *
         * @memberof Dispatcher#
         * @function id
         * */
        Object.defineProperty(this, 'id', {
            value: function() {
                return dispatcherId;
            }
        });
        return this;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;