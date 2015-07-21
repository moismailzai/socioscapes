module.exports = function newDispatcher(myObject) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        myDispatcher;
    myDispatcher = function(myObject) {
        var _currentItem = {},
            _isReady = true,
            _queue = [];
        Object.defineProperty(myObject, 'dispatch', {
            get:function() {
                for (;_queue.length > 0 && _isReady === true;) {
                    _isReady = false;
                    _currentItem = _queue.shift();
                    _currentItem(function() {
                        _isReady = true;
                    });
                }
            },
            set:function(config) {
                if (config && typeof config.myFunction === 'function') {
                    var myQueueItem = function(callback) {
                        var myArguments = [];
                        for (var i = 0; i < config.myArguments.length; i++) {
                            myArguments.push(config.myArguments[i]);
                        }
                        myArguments.push(callback);
                        config.myFunction.apply(config.myThis, myArguments);
                        callback();
                    };
                    _queue.push(myQueueItem);
                    myObject.dispatch;
                }
            }
        });
    };
    if (!myObject) {
        console.log('Sorry, you did not provide an object to attach the dispatcher to.');
    } else if (myObject && myObject.dispatcher) {
        console.log('Sorry, a dispatcher already exists for this object.');
    } else {
        myDispatcher(myObject);
        callback(myObject);
        return(myObject);
    }
};