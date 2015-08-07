/*jslint node: true */
/*global module, require, google*/
'use strict';
function newDispatcher() {
    var Dispatcher = function() {
        var _queue = [],
            _queuedItem,
            _servedItem,
            _lastResult,
            _status = true,
            _this,
            _that = this,
            itemServer = function(myItem, myThis, dispatcherCallback) {
                var args = [];
                for (; myItem.myFunction.length > myItem.myArguments.length; myItem.myArguments.push(null)) {}
                for (var i = 0; i < myItem.myArguments.length; i++) {
                    args.push(myItem.myArguments[i]);
                }
                args.push(dispatcherCallback);
                myItem.myFunction.apply(myThis, args);
            };
        this.dispatcher = function (config, callback) {
            if (config) {
                if (config.myFunction && typeof config.myFunction === 'function') {
                    callback = (callback && typeof callback === 'function') ? callback : function (result) { return result };
                    _queue.push({
                        myFunction: config.myFunction, // the function to be called
                        myArguments: config.myArguments, // its arguments
                        myThis: config.myThis, // [optional] arbitrary 'this' value
                        myReturn: config.myReturn, // [optional] arbitrary 'return' value
                        myCallback: callback // [optional] return to context that made this queue request (if callback is requested, the 'real' return value is sent to it but the fake return value is actually returned.
                    });
                    _that.dispatcher();
                }
            }
            if (!config && _status) {
                for (; _queue.length > 0 ;) {
                    if (_status === true) {
                        _status = false;
                        _queuedItem = _queue.shift();
                        _this = (_queuedItem.myThis) ? _queuedItem.myThis:_lastResult;
                        itemServer(_queuedItem, _this, function(result) {
                            if (typeof _queuedItem.myCallback === 'function') {
                                _queuedItem.myCallback(result);
                            }
                            if (_queuedItem.myReturn) {
                                _lastResult = _queuedItem.myReturn;
                            } else {
                                _lastResult = result;
                            }
                            _status = true;
                            _that.dispatcher();
                        });
                    }
                }
            }
        };
        Object.defineProperty(this.dispatcher, 'lastResult', {
            value: function() { return _lastResult }
        });
        Object.defineProperty(this.dispatcher, 'status', {
            value: function() { return _status }
        });
        Object.defineProperty(this.dispatcher, 'queue', {
            value: function() { return _queue }
        });
        Object.defineProperty(this, 'dispatcher', {
            configurable: false
        });
        return this.dispatcher;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;