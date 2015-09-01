/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
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
    var newCallback = newDispatcher.prototype.newCallback,
        newEvent = newDispatcher.prototype.newEvent;
    //
    var Dispatcher = function() {
        var lastResult, // if a 'this' argument is not explicitly provided, te results of the last operation are used as the 'this' context
            myEvent,
            myMessage,
            queue = [],
            queueItem,
            status = true,
            that = this,
            queueItemArgsGenerator = function(item) {
                var args = [];
                for (var i = 0; i < item.myArguments.length; i++) {
                    args.push(item.myArguments[i]);
                }
                item.myArguments = args;
                return item;
            },
            queueItemFunctionFiller = function(item) {
                for (; item.myFunction.length > item.myArguments.length; ) {
                    item.myArguments.push(null);
                }
                return item;
            },
            queueItemServer = function(item) {
                item.myArguments.push(function(result) { // serve the current queue item and wait for a callback
                    queueItem.myCallback(result);
                    if (queueItem.myReturn) {
                        lastResult = queueItem.myReturn;
                    } else {
                        lastResult = result;
                    }
                    myMessage = {};
                    myMessage.item = queueItem;
                    myMessage.result = result;
                    myEvent = newEvent('socioscapes.dispatcher', myMessage);
                    document.dispatchEvent(myEvent);
                    status = true; // reset the status of the for loop
                    that.dispatch(); // trigger a new iteration
                }); // pushes the callback from the dispatcher queue to the function being called
                item.myFunction.apply(item.myThis, item.myArguments);
            },
            queueItemThisGenerator = function(item) {
                item.myThis = queueItem.myThis ? queueItem.myThis:lastResult;
                return item;
            };
        Object.defineProperty(this, 'dispatch', {
            value: function (config, callback) {
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
                        that.dispatch();
                    }
                }
                if (!config && status) {
                    for (; queue.length > 0;) {
                        if (status === true) { // this prevents the queue resuming during asynchronous calls
                            status = false;
                            queueItem = queue.shift();
                            queueItem = queueItemThisGenerator(queueItem); // use either a provided .this context or the results of the last queue operation
                            queueItem = queueItemArgsGenerator(queueItem); // because the 'arguments' array isn't really an array, repackages its contents so we can push to it
                            queueItem = queueItemFunctionFiller(queueItem); // fills missing parameters with 'null' so that the dispatcher callback is not mistaken for an expected parameter
                            queueItemServer(queueItem);
                        }
                    }
                }
            }
        });
        Object.defineProperty(this.dispatch, 'result', {
            value: function() {
                return lastResult;
            }
        });
        Object.defineProperty(this.dispatch, 'status', {
            value: function() {
                return status;
            }
        });
        Object.defineProperty(this.dispatch, 'queue', {
            value: function() {
                return queue;
            }
        });
        Object.defineProperty(this.dispatch, 'nowServing', {
            value: function() {
                return queueItem;
            }
        });
        return this;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;