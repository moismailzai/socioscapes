/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * The socioscapes Dispatcher class is helps to facilitate asynchronous method chaining and queues. Socioscapes
 * associates every new 'scape' object with a unique dispatcher instance. The dispatcher allows for API calls to be
 * queued and synchronously resolved. Calls to the dispatcher provide a configuration object and an optional callback.
 * The configuration object must include the function to be called, an array of arguments to be sent to the function,
 * an optional 'this' context to be included, and an optional return value or object to be sent back to the caller.
 * Inside the dispatcher, the function to be queued is evaluated for the number of arguments it expects using .length.
 * The dispatcher then appends null values to the arguments array for each expected argument that is not explicitly
 * provided and appends this list with a callback. When the queue is initiated, a for loop is used to iterate through
 * the list and a status boolean prevents further iterations until the current one is processed. While the queue is
 * being processed, new queue items are pushed to the queue array. Internal socioscapes methods begin by evaluating the
 * final argument of the 'arguments' array to test if a dispatcher callback was provided. If one was, results are sent
 * to the callback, which also triggers a new iteration of the queue loop.
 * */
function newDispatcher() {
    var queueServer = function(item, itemThis, callback) { // unpacks the queued item
            var args = [];
            for (; item.myFunction.length > item.myArguments.length; ) { // fills missing parameters with 'null' so that the dispatcher callback is not mistaken for an expected parameter
                item.myArguments.push(null);
            }
            for (var i = 0; i < item.myArguments.length; i++) { // because the 'arguments' array isn't really an array, repackages its contents so we can push to it
                args.push(item.myArguments[i]);
            }
            args.push(callback); // pushes the callback from the dispatcher queue to the function being called
            item.myFunction.apply(itemThis, args);
        },
        Dispatcher = function() {
        var lastResult, // if a 'this' argument is not explicitly provided, te results of the last operation are used as the 'this' context
            myEvent,
            myMessage,
            queue = [],
            queuedItem,
            status = true,
            that = this;
        this.dispatcher = function (config, callback) {
            if (config) {
                if (config.myFunction && typeof config.myFunction === 'function') {
                    callback = newCallback(arguments);
                    queue.push({ // packs requests for the dispatcher queue
                        myFunction: config.myFunction, // the function to be called
                        myArguments: config.myArguments, // its arguments
                        myThis: config.myThis, // [optional] arbitrary 'this' value
                        myReturn: config.myReturn, // [optional] arbitrary 'return' value
                        myCallback: callback // [optional] return to context that made this queue request (if callback is requested, the 'real' return value is sent to it but the fake return value is actually returned.
                    });
                    that.dispatcher();
                }
            }
            if (!config && status) {
                for (; queue.length > 0 ;) {
                    if (status === true) { // this prevents the queue resuming during asynchronous calls
                        status = false;
                        queuedItem = queue.shift();
                        queuedItem.myThis = queuedItem.myThis ? queuedItem.myThis:lastResult; // use either a provided .this context or the results of the last queue operation
                        queueServer(queuedItem, queuedItem.myThis, function(result) { // serve the current queue ietm and wait for a callback
                            queuedItem.myCallback(result);
                            if (queuedItem.myReturn) {
                                lastResult = queuedItem.myReturn;
                            } else {
                                lastResult = result;
                            }
                            myEvent = newEvent('socioscapes.dispatcher.' + queuedItem.myFunction.name, 'update');
                            document.dispatchEvent(myEvent);
                            status = true; // reset the status of the for loop
                            that.dispatcher(); // trigger a new iteration
                        }); // todo jshint error -- unsure how to fix this
                    }
                }
            }
        };
        Object.defineProperty(this.dispatcher, 'result', {
            value: function() {
                return lastResult;
            }
        });
        Object.defineProperty(this.dispatcher, 'status', {
            value: function() {
                return status;
            }
        });
        Object.defineProperty(this.dispatcher, 'queue', {
            value: function() {
                return queue;
            }
        });
        Object.defineProperty(this.dispatcher, 'nowServing', {
            value: function() {
                return queuedItem;
            }
        });
        Object.defineProperty(this, 'dispatcher', {
            configurable: false
        });
        return this.dispatcher;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;