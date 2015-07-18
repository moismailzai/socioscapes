module.exports = function(scape, callback) {
    if (!scape.dispatch) {
        var _qItemList = [],
            _qNewItem,
            _qCurrentItem,
            _qIsReady = true,
            _qItemScope = scape;
        callback = typeof callback === 'function' ? callback:function(result) { return result; };
        Object.defineProperty(scape, 'dispatch', {
            get:function() {
                for (;_qItemList.length > 0 && _qIsReady === true;) {
                    _qIsReady = false;
                    _qCurrentItem = _qItemList.shift();
                    _qCurrentItem(_qItemScope, function(itemResult) {
                        _qItemScope = itemResult;
                        _qIsReady = true;
                    });
                }
            },
            set:function(myFunction, myArguments) {
                if (typeof myFunction === 'function') {
                    _qNewItem = function(myThis, myCallback) {
                        myFunction.apply(myThis, myArguments, function(myResult) {
                            myCallback(myResult);
                        })
                    };
                    _qItemList.push(_qNewItem);
                    if (_qIsReady) {
                        console.log('Starting the Q...List: "' + _qItemList + '".');
                        scape.dispatch
                    }
                }
            }
        });
    }
    callback(scape);
};