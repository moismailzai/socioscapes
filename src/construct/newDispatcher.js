module.exports = function(myContainer) {
    var myDispatcher = function() {
        var dispatcher = {
            currentItem: {},
            isReady: true,
            queue: []
        };
        Object.defineProperty(dispatcher, 'dispatch', {
            get:function() {
                for (;dispatcher.queue.length > 0 && dispatcher.isReady === true;) {
                    dispatcher.isReady = false;
                    dispatcher.currentItem = dispatcher.queue.shift();
                    dispatcher.currentItem(function() {
                        dispatcher.isReady = true;
                        //dispatcher.dispatch;
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
                    };
                    dispatcher.queue.push(myQueueItem);
                    dispatcher.dispatch;
                }
            }
        });
        return dispatcher;
    };
    myContainer._q = myDispatcher();
};