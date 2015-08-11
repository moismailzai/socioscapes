(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This internal method tests if a name used for a socioscapes scape, state, layer, or view adheres to naming
 * restrictions.
 *
 * @function isValidName
 * @memberof! socioscapes
 * @param {string} name - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
function isValidName(name) {
    var callback = newDispatcherCallback(arguments),
        isValid = false,
        isReserved = [
            'help',
            // below are reserved JS words and properties
            'abstract',
            'arguments',
            'Array',
            'boolean',
            'break',
            'byte',
            'case',
            'catch',
            'char',
            'class',
            'const',
            'continue',
            'debugger',
            'Date',
            'default',
            'delete',
            'do',
            'double',
            'else',
            'enum',
            'eval',
            'export',
            'extends',
            'false',
            'final',
            'finally',
            'float',
            'for',
            'function',
            'goto',
            'hasOwnProperty',
            'if',
            'implements',
            'import',
            'in',
            'instanceof',
            'int',
            'interface',
            'isFinite',
            'isNaN',
            'isPrototypeOf',
            'Infinity',
            'length',
            'let',
            'long',
            'native',
            'Math',
            'name',
            'new',
            'NaN',
            'Number',
            'null',
            'Object',
            'package',
            'private',
            'protected',
            'prototype',
            'public',
            'return',
            'short',
            'static',
            'super',
            'switch',
            'synchronized',
            'String',
            'this',
            'throw',
            'throws',
            'toString',
            'transient',
            'true',
            'try',
            'typeof',
            'undefined',
            'valueOf',
            'var',
            'void',
            'volatile',
            'while',
            'with',
            'yield'
        ];
    if (name && typeof name === 'string') {
        if (/^[-A-Z0-9]+$/i.test(name)) {
            if (isReserved.indexOf(name) === -1) {
                isValid = true;
            } else {
                console.log('Sorry, "' + name + '" is not a valid name because it is a reserved word. The full list of reserved words is: ' + isReserved);
            }
        } else {
            console.log('Sorry, that is not a valid name. Valid names can only contain letters (a to Z), numbers (0-9), or dashes (-).');
        }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidName;
},{"./../construct/newDispatcherCallback.js":5}],2:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 *
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;
},{"./../construct/newDispatcherCallback.js":5}],3:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols.
 *
 * @function isValidUrl
 * @memberof! socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
function isValidUrl(url) {
    var callback = newDispatcherCallback(arguments),
        isValid = false;
    if (url) {
            if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
                isValid = true;
            } else {
                console.log();
                //console.log('Sorry, that is not a valid url. Currently, socioscapes supports the HTTP(S) and FTP(S) protocols. Valid URLS must begin with the protocol name followed by an address (eg. "ftp://socioscapes.com/myScape.json", "https://socioscapes.com/myScape.json").');
            }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidUrl;
},{"./../construct/newDispatcherCallback.js":5}],4:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
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
            queue = [],
            queuedItem,
            status = true,
            that = this;
        this.dispatcher = function (config, callback) {
            if (config) {
                if (config.myFunction && typeof config.myFunction === 'function') {
                    callback = (callback && typeof callback === 'function') ? callback : function (result) { return result; };
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
                            if (typeof queuedItem.myCallback === 'function') {
                                queuedItem.myCallback(result);
                            }
                            if (queuedItem.myReturn) {
                                lastResult = queuedItem.myReturn;
                            } else {
                                lastResult = result;
                            }
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
        Object.defineProperty(this, 'dispatcher', {
            configurable: false
        });
        return this.dispatcher;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;
},{}],5:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
function newDispatcherCallback(argumentsArray) {
    var myCallback;
    if (typeof argumentsArray[argumentsArray.length - 1] === 'function') {
       myCallback = argumentsArray[argumentsArray.length - 1];
    } else {
        myCallback = function(result) {
            return result;
        };
    }
    return myCallback;
}
module.exports = newDispatcherCallback;
},{}],6:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
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
    new CustomEvent( // todo jshin error, not sure what to do here
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
},{"./../construct/newDispatcherCallback.js":5}],7:[function(require,module,exports){
(function (global){
/*jslint node: true */
/*global global, module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function newGlobal(name, object, overwrite) {
    var callback = newDispatcherCallback(arguments),
        myGlobal;
    if (fetchGlobal(name)) {
        if (overwrite) {
            if (window) {
                window[name] = object;
                myGlobal = window[name];
            } else if (global) {
                global[name] = object;
                myGlobal = global[name];
            }
        } else {
            console.log('Sorry, a global object called "' + name + '" already exists.');
        }
    } else {
        if (window) {
            window[name] = object;
            myGlobal = window[name];
        } else if (global) {
            window[name] = object;
            myGlobal = window[name];
        }
        console.log('Creating a new global object called "' + name + '".');
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGlobal.js":16}],8:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchScapeObject = socioscapes.fn.fetchScapeObject,
    isValidObject = socioscapes.fn.isValidObject,
    newDispatcherCallback = socioscapes.fn.newDispatcherCallback,
    newScapeObject = socioscapes.fn.newScapeObject;
/**
 * This
 *
 * @method newMenu
 * @memberof! socioscapes
 * @return
 */
socioscapes.fn.extend(
    [{ path: 'newScapeMenu', extension:
        function newScapeMenu(scapeObject) {
        var callback = newDispatcherCallback(arguments),
            myMenu = false,
            ScapeMenu = function(myObject) {
                var that = this,
                    myResult,
                    mySchema = myObject.schema,
                    myClass = mySchema.class,
                    myParent = mySchema.parent,
                    myType = mySchema.type;
                Object.defineProperty(this, 'drop', {
                    value: function() {
                        delete window[myObject];
                    }
                });
                Object.defineProperty(this, 'schema', {
                    value: myObject.schema
                });
                Object.defineProperty(this, 'fn', {
                    value: socioscapes.fn
                });
                Object.defineProperty(this, 'this', {
                    value: myObject
                });
                Object.defineProperty(this, 'meta', {
                    value: myObject.meta
                });
                Object.defineProperty(this, 'new', {
                    value: function (name) {
                        name = name || mySchema.name + myClass.length;
                        myObject.dispatcher({
                                myFunction: newScapeObject,
                                myArguments: [name, myParent, myType]
                            },
                            function (result) {
                                if (result) {
                                    myResult = new ScapeMenu(result);
                                }
                            });
                        return myResult;
                    }
                });
                Object.defineProperty(this, 'store', {
                    value: ''
                });
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // scape menus are defined in the 'newScapeSchema' function by adding a '.menu' property to a given entry.//
                // the following loop creates a new menu entry for each corresponding element in the current schema's     //
                // '.children' array. the children array is simply a list of names which correspond to members in the     //
                // schema's data structure. this means that extending socioscapes can simply be a matter of altering the  //
                // 'newScapeSchema' function and allowing the API to do the rest.                                         //
                for (var i = 0; i < mySchema.children.length; i++) {
                    (function(myChild) {
                        var myChildClass = myChild.class, // child item class
                            myChildIsArray,
                            myChildSchema, // child item datastructure schema
                            myChildContext; // context object to be prepended to all menu item calls
                        if (myChildClass.match(/\[(.*?)]/g)) {
                            myChildClass = /\[(.*?)]/g.exec(myChildClass)[1];
                            myChildIsArray = true;
                        }
                        myChildSchema = myChildIsArray ? mySchema[myChildClass][0]:mySchema[myChildClass];
                        myChildContext = {
                            "myChild": myChild,
                            "myChildSchema": myChildSchema,
                            "myScapeObjectValue": myObject[myChildClass],
                            "ScapeMenu": ScapeMenu,
                            "that": that
                        };
                        if (myChildSchema.menu) {
                        // if the schema definition includes a .menu member, it is used as an API interface for that
                        // item. for example, if the 'geom' class had the following '.menu' entry:
                        //                                               function(foo) { console.log(foo, 'bar!'); };
                        // then 'socioscapes().state().layer().geom('foo')' would result in a console printout of 'foobar!'
                        // child items without a .menu member are ignored.
                            Object.defineProperty(that, myChildClass, {
                                value: function () {
                                    var myArgs = [];
                                    myArgs.push(myChildContext);
                                    for (var i = 0; i < arguments.length; i++) {
                                        myArgs.push(arguments[i]);
                                    }
                                    myObject.dispatcher({
                                            myFunction: myChildSchema.menu,
                                            myArguments: myArgs,
                                            myThis: myObject
                                        },
                                        function (result) {
                                            if (result) {
                                                myResult = new ScapeMenu(result);
                                            }
                                        });
                                    return myResult;
                                }
                            });
                        }
                    })(mySchema.children[i]); // todo jshin error, unsure how to resolve this
                }
            };
        if (isValidObject(scapeObject)) {
            myMenu = new ScapeMenu(scapeObject);
        }
        callback(myMenu);
        return myMenu;
        }
    }]
);
},{}],9:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchFromScape = socioscapes.fn.fetchFromScape,
    fetchGlobal = socioscapes.fn.fetchGlobal,
    fetchScapeObject = socioscapes.fn.fetchScapeObject,
    newDispatcherCallback = socioscapes.fn.newDispatcherCallback,
    newDispatcher = socioscapes.fn.newDispatcher,
    newGlobal = socioscapes.fn.newGlobal,
    newScapeSchema = socioscapes.fn.newScapeSchema;
socioscapes.fn.extend(
    [{ path: 'newScapeObject', extension:
        function newScapeObject(name, parent, type) {
            var callback = newDispatcherCallback(arguments),
                schema = newScapeSchema(type),
                myObject = false,
                ScapeObject = function(myName, myParent, mySchema) {
                    var myDispatcher = (myParent) ? myParent.dispatcher:newDispatcher();
                    Object.defineProperty(this, 'dispatcher', {
                        value: myDispatcher
                    });
                    Object.defineProperty(this, 'schema', {
                        value: mySchema
                    });
                    Object.defineProperty(this.schema, 'parent', {
                        value: myParent || false
                    });
                    if (!this.schema.container) {
                        Object.defineProperty(this.schema, 'container', {
                            value: myParent ? myParent[mySchema.class]:false
                        });
                    }
                    Object.defineProperty(this, 'meta', {
                        value: {},
                        enumerable: true
                    });
                    Object.defineProperty(this.meta, 'author', {
                        value: '',
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(this.meta, 'name', {
                        value: myName,
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(this.meta, 'summary', {
                        value: '',
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(this.meta, 'type', {
                        value: mySchema.type,
                        enumerable: true
                    });
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // scape objects are defined in the 'newScapeSchema' function and follow a json format. each level of a   //
                    // scape object can have an arbitrary number of child elements and socioscapes will produce the necessary //
                    // data structure and corresponding menu items. the following loop creates a member for each item in the  //
                    // current schema's '.children' array. the children array is simply a list of names which correspond to   //
                    // members in the schema's data structure. this means that extending socioscapes can simply be a matter   //
                    // of altering the'newScapeSchema' function and allowing the API to do the rest. child entries in         //
                    // [brackets] denote arrays and are populated by instances of the corresponding class. for example, if    //
                    // 'mySchema.children[i].class' is '[state]', then 'mySchema.state[0]' will be created  as the            //
                    // datastructure prototype for all entries in 'this.state'. all such prototypes and schema definitions    //
                    // are stored in the newScapeSchema function.                                                             //
                    for (var i = 0; i < mySchema.children.length; i++) {
                        var myChildClass = mySchema.children[i].class, // child item class
                            myChildIsArray,
                            myChildName, // child item name
                            myChildSchema, // child item definition and datastructure
                            myChildValue; // child item default value
                        if (myChildClass.match(/\[(.*?)]/g)) {
                            myChildClass = /\[(.*?)]/g.exec(myChildClass)[1];
                            myChildIsArray = true;
                        }
                        myChildSchema = myChildIsArray ? mySchema[myChildClass][0]:mySchema[myChildClass];
                        myChildName = myChildSchema.name || myChildSchema.class;
                        myChildValue = myChildSchema.value || [];
                        if (!this[myChildClass]) {
                            Object.defineProperty(this, myChildClass, {
                                value: myChildValue,
                                enumerable: true
                            });
                        }
                        if  (myChildIsArray) {
                            this[myChildClass].push(new ScapeObject(myChildName, this, myChildSchema));
                        }
                    }
                };
            parent = fetchScapeObject(parent);
            if (name) {
                if (parent) {
                    if (schema) {
                        if (fetchFromScape(name, 'name', parent[schema.class])) {
                            console.log('Fetching existing scape object "' + name + '" of class "' + schema.class + '".');
                            myObject = fetchFromScape(name, 'name', parent[schema.class]);
                        } else {
                            console.log('Adding a new ' + schema.class + ' called "' + name + '" to the "' + parent.meta.name + '" ' +  parent.schema.class + '.');
                            myObject = new ScapeObject(name, parent, schema);
                            parent[schema.class].push(myObject);
                        }
                    }
                } else {
                    if (fetchScapeObject(name)) {
                        console.log('Fetching exisisting scape "' + name + '".');
                        myObject = fetchScapeObject(name);
                    } else {
                        if (!fetchGlobal(name)) {
                            console.log('Creating a new scape called "' + name + '".');
                            myObject = new ScapeObject(name, null, schema);
                            newGlobal(name, myObject);
                        } else {
                            console.log('Sorry, there is already a global object called "' + name + '".');
                        }
                    }
                }
            }
            callback(myObject);
            return myObject;
        }
    }]
);
},{}],10:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var socioscapes,
    version = '0.5.5',
    extend = require('./extend.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchGoogleGeocode = require('./../fetch/fetchGoogleGeocode.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuData = require('./../menu/menuData.js'),
    menuGeom = require('./../menu/menuGeom.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newEvent = require('./../construct/newEvent.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    test = require('./test.js');
/**
 * The socioscapes structure is inspired by the jQuery team's module management system. To extend socioscapes, you
 * simply need to call 'socioscapes.extend' and provide an array of entries that are composed of an object with
 * '.path' (a string), and '.extension' (a value) members. The '.path' tells the API where to store your extension. The
 * path for most modules will be the root path, which is socioscapes.fn. The name of your module should be prefixed such
 * that existing elements can access it. For instance, if you have created a new module that retrieves data from a
 * MySql server, you'd want to use the 'fetch' prefix (eg. 'fetchMysql'). This convention not only allows for a clean
 * ecosystem, under the hood socioscapes will ensure that your module is integrated with all other modules which accept
 * data fetchers.
 * */
socioscapes = function(name) {
    return new socioscapes.fn.init(name);
};
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    extend: extend,
    fetchFromScape: fetchFromScape,
    fetchGlobal: fetchGlobal,
    fetchGoogleAuth: fetchGoogleAuth,
    fetchGoogleBq: fetchGoogleBq,
    fetchGoogleGeocode: fetchGoogleGeocode,
    fetchScapeObject: fetchScapeObject,
    fetchWfs: fetchWfs,
    init: function() {  },
    isValidObject: isValidObject,
    isValidName: isValidName,
    isValidUrl: isValidUrl,
    menuClass: menuClass,
    menuConfig: menuConfig,
    menuData: menuData,
    menuGeom: menuGeom,
    menuRequire: menuRequire,
    newDispatcher: newDispatcher,
    newDispatcherCallback: newDispatcherCallback,
    newEvent: newEvent,
    newGlobal: newGlobal,
    test: test,
    version: version
};
newGlobal('socioscapes', socioscapes, true);
module.exports = socioscapes;
},{"./../bool/isValidName.js":1,"./../bool/isValidObject.js":2,"./../bool/isValidUrl.js":3,"./../construct/newDispatcher.js":4,"./../construct/newDispatcherCallback.js":5,"./../construct/newEvent.js":6,"./../construct/newGlobal.js":7,"./../fetch/fetchFromScape.js":15,"./../fetch/fetchGlobal.js":16,"./../fetch/fetchGoogleAuth.js":17,"./../fetch/fetchGoogleBq.js":18,"./../fetch/fetchGoogleGeocode.js":19,"./../fetch/fetchScapeObject.js":20,"./../fetch/fetchWfs.js":21,"./../menu/menuClass.js":23,"./../menu/menuConfig.js":24,"./../menu/menuData.js":25,"./../menu/menuGeom.js":26,"./../menu/menuRequire.js":27,"./extend.js":11,"./test.js":14}],11:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
function extend(config) {
    var myExtension, myName, myPath, myTarget, i, ii;
    for (i = 0; i < config.length; i++) {
        myTarget = socioscapes.fn;
        myPath = (typeof config[i].path === 'string') ? config[i].path:false;
        myExtension = config[i].extension || false;
        if (myPath && myExtension) {
            if (myPath.indexOf('/') > -1){
                myPath = myPath.split('/');
                for (ii = 0; myTarget[myPath[ii]] ; ii++) {
                    myTarget = myTarget[myPath[ii]];
                }
                myName = myPath[ii];
            } else {
                myName = myPath;
            }
            if (myTarget) {
                console.log('Extending socioscapes.fn with "' + myPath + '".');
                myTarget[myName] = myExtension;
            } else {
                console.log('Sorry, unable to add your extension. Please check your .path string.');
            }
        }
    }
    return socioscapes.fn;
}
module.exports = extend;

},{}],12:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchScapeObject = socioscapes.fn.fetchScapeObject,
    newScapeObject = socioscapes.fn.newScapeObject,
    newScapeMenu = socioscapes.fn.newScapeMenu;
socioscapes.fn.extend([
    {
        path: 'init', extension: function coreInit(name) {
        var myScape;
        if (name) {
            myScape = fetchScapeObject(name);
        } else {
            myScape = newScapeObject(name || 'scape0', null, 'scape');
        }
        this.s = newScapeMenu(myScape);
        return this.s;
    }}
]);
},{}],13:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var menuClass = socioscapes.fn.menuClass,
    menuConfig = socioscapes.fn.menuConfig,
    menuData = socioscapes.fn.menuData,
    menuGeom = socioscapes.fn.menuGeom,
    menuRequire = socioscapes.fn.menuRequire,
    newDispatcherCallback = socioscapes.fn.newDispatcherCallback;
socioscapes.fn.extend(
    [
        { path: 'schema', extension: {}
        },
        { path: 'schema/structure', extension: { "scape": {
            "children": [
                {
                    "class": "[state]"
                }
            ],
            "class": "scape",
            "menu": menuClass,
            "name": "scape",
            "state": [
                {
                    "class": "state",
                    "children": [
                        {
                            "class": "[layer]"
                        },
                        {
                            "class": "[view]"
                        }
                    ],
                    "layer": [
                        {
                            "children": [
                                {
                                    "class": "data"
                                },
                                {
                                    "class": "geom"
                                }
                            ],
                            "class": "layer",
                            "data": {
                                "menu": menuData,
                                "value": {}
                            },
                            "geom": {
                                "menu": menuGeom,
                                "value": {}
                            },
                            "menu": menuClass,
                            "name": "layer0",
                            "parent": "state",
                            "type": "layer.state.scape.sociJson"
                        }
                    ],
                    "menu": menuClass,
                    "name": "state0",
                    "parent": "scape",
                    "type": "state.scape.sociJson",
                    "view": [
                        {
                            "config": {
                                "menu": menuConfig,
                                "value": {}
                            },
                            "children": [
                                {
                                    "class": "config"
                                },
                                {
                                    "class": "require"
                                }
                            ],
                            "class": "view",
                            "menu": menuClass,
                            "name": "view0",
                            "parent": "state",
                            "require": {
                                "menu": menuRequire,
                                "value": []
                            },
                            "type": "view.state.scape.sociJson"
                        }
                    ]
                }
            ],
            "type": "scape.sociJson"
        }}}
    ]
);
socioscapes.fn.extend(
    [
        { path: 'schema/classes', extension:
            [
                'scape',
                'state',
                'layer',
                'view'
            ]},
        { path: 'schema/types', extension:
            [
                'scape.sociJson',
                'state.scape.sociJson',
                'layer.state.scape.sociJson',
                'view.state.scape.sociJson'
            ]},
        { path: 'schema/index', extension:
            {
                "scape": socioscapes.fn.schema.structure.scape,
                "state": socioscapes.fn.schema.structure.scape.state[0],
                "layer": socioscapes.fn.schema.structure.scape.state[0].layer[0],
                "view": socioscapes.fn.schema.structure.scape.state[0].view[0]
            }},
        { path: 'newScapeSchema', extension:
            function newScapeSchema(type) {
                var callback = newDispatcherCallback(arguments),
                    isClass,
                    isType,
                    myObject = false,
                    myTypes  = socioscapes.fn.schema.types,
                    myClasses  = socioscapes.fn.schema.classes,
                    index = socioscapes.fn.schema.index;
                isType = (myTypes.indexOf(type) > -1) ? type.split('.')[0]:false;
                isClass = (myClasses.indexOf(type) > -1) ? type:false;
                if (isType || isClass) {
                    myObject = index[isType || isClass];
                }
                callback(myObject);
                return myObject;
            }
        }
    ]
);
},{}],14:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
function test(option, config) {
    var myOption = {};
    myOption.bq = {
        id: '2011_census_of_canada',
        clientId: config ? config:'424138972496-nlcip7t83lb1ll7go1hjoc77jgc689iq.apps.googleusercontent.com',
        projectId: config ? config.split("-")[0]:'424138972496',
        queryString: "SELECT Geo_Code, Total FROM [2011_census_of_canada.british_columbia_da] WHERE (Characteristic CONTAINS 'Population in 2011' AND Total IS NOT NULL) GROUP BY Geo_Code, Total, LIMIT 10;"
    };
    myOption.wfs = "http://app.socioscapes.com:8080/geoserver/socioscapes/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=cmaname=%27Toronto%27";
    myOption.all = {
        bq: myOption.bq,
        wfs: myOption.wfs
    };
    return myOption[option];
}
module.exports = test;
},{}],15:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
// isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
function fetchFromScape(key, metaProperty, array) {
    var callback = newDispatcherCallback(arguments),
        myKey = false;
    if (array) {
        if (Number.isInteger(key)) {
            myKey = (array[key]) ? array[key]:false;
        } else if (isValidName(key)) {
            for (var i = 0; i < array.length; i++) {
                if (key === array[i].meta[metaProperty]) {
                    myKey = array[i];
                }
            }
        }
    }
    callback(myKey);
    return myKey;
}
module.exports = fetchFromScape;
},{"./../bool/isValidName.js":1,"./../construct/newDispatcherCallback.js":5}],16:[function(require,module,exports){
(function (global){
/*jslint node: true */
/*global global, module, require*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
function fetchGlobal(name) {
    var callback = newDispatcherCallback(arguments),
        myGlobal;
    if (window) {
        myGlobal = window[name];
    } else if (global) {
        myGlobal = global[name];
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = fetchGlobal;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./../construct/newDispatcherCallback.js":5}],17:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google, gapi, authorize, access_token*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This function requests authorization to use a Google API, and if received, loads that API client. For more information
 * on Google APIs, see {@link http://developers.google.com/api-client-library/javascript/reference/referencedocs}.
 *
 * @function fetchGoogleAuth
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for Google APIs.
 * @param {Object} config.auth - Configuration options for the auth request (eg. .client_id, .scope, .immediate)
 * @param {Object} config.client.name - The name of the Google API client to load.
 * @param {Object} config.client.version - The version of the Google API client to load.
 * @return this {Object}
 */
function fetchGoogleAuth(config) {
    var callback = newDispatcherCallback(arguments);
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function (result) {
                callback(result);
                return result;
            });
        }
    });
}
module.exports = fetchGoogleAuth;
},{"./../construct/newDispatcherCallback.js":5}],18:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google, gapi, bigquery, execute, jobs, fields, totalRows*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    bqParser = function(values, callback) {
        var thisRow = {};
        if (callback) {
            values.result.rows.forEach(function (row) {
                for (var i = 0; i < row.f.length; i++) {
                    thisRow[i] = row.f[i].v;
                }
                callback(thisRow);
            });
        }
    };
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetchScapeObject.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
function fetchGoogleBq(config) {
    var callback = newDispatcherCallback(arguments),
        data = {},
        request,
        totalRows,
        values = [],
        clientId = config ? config.clientId:false,
        dataId = config ? config.id:false,
        projectId = config ? config.projectId:false,
        queryString = config ? config.queryString:false,
        gapiConfig = {
            auth: {
                "client_id": clientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': projectId,
                'timeoutMs': '30000',
                'query': queryString
            }
        };
    if (config) {
        fetchGoogleAuth(gapiConfig, function() {
            request = gapi.client.bigquery.jobs.query(gapiConfig.query);
            request.execute(function(result) {
                for (var i = 0; i < result.schema.fields.length; i++) {
                    data['column'+i] = result.schema.fields[i].name;
                }
                data.columns = result.schema.fields.length;
                totalRows = parseFloat(result.result.totalRows);
                data.rows = totalRows;
                bqParser(result, function (parsed) {
                    values.push(parsed);
                    if (values.length === totalRows) {
                        data.values = values;
                        data.query = queryString;
                        data.name = dataId;
                        callback(data);
                        return data;
                    }
                });
            });
        });
    }
}
module.exports = fetchGoogleBq;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGoogleAuth.js":17}],19:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google, geocode, maps, GeocoderStatus*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method executes a Google Geocoder query for 'address' and returns the results in an object.
 *
 * Make sure you obtain Google auth and load the GAPI client first.
 *
 * @function fetchGoogleGeocode
 * @memberof! socioscapes
 * @param {String} address - The address around which the map around (eg. 'Toronto, Canada').
 * @return {Object} geocode - An object with latitude and longitude coordinates.
 */
function fetchGoogleGeocode(address) {
    var callback = newDispatcherCallback(arguments),
        geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = results[0].geometry.location.lat();
            geocode.long = results[0].geometry.location.lng();
            callback(geocode);
            return geocode;
        }
        console.log('Error: Google Geocoder was unable to locate ' + address);
    });
}
module.exports = fetchGoogleGeocode;
},{"./../construct/newDispatcherCallback.js":5}],20:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This
 *
 * @method fetcher
 * @memberof! socioscapes
 * @return
 */
function fetchScapeObject(object, source, container) {
    var callback = newDispatcherCallback(arguments),
        myObject = (typeof object === 'string') ? fetchGlobal(object):(isValidObject(object) ? object:false), // was an object sent to be validated? if so let's prioritize sending it back
        myParent = myObject ? false:isValidObject(source), // otherwise was a parent object provided?
        myUrl = myParent ? false:isValidUrl(source); // if not was a parent url provided?
    if (!myObject && (myParent || myUrl)) {     // if we don't have an object and we do have either a name or url, proceed
        if (myParent) {
            myObject = fetchFromScape(object, 'name', source[container]);
        } else {
            // some myUrl thing
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScapeObject;
},{"./../bool/isValidObject.js":2,"./../bool/isValidUrl.js":3,"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchFromScape.js":15,"./../fetch/fetchGlobal.js":16}],21:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
/**
 * This method asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson and returns the
 * queried url, the id parameter, and the fetched features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
function fetchWfs(url) {
    var callback = newDispatcherCallback(arguments),
        xobj = new XMLHttpRequest(),
        geom;
    xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") { // todo jshin error about == instead of === but when I change to === function does not behave as expected
            geom = {};
            geom.features = xobj.responseText;
            geom.url = url;
            callback(geom);
            return geom;
        }
    };
    xobj.send(null);
}
module.exports = fetchWfs;
},{"./../construct/newDispatcherCallback.js":5}],22:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * extendable environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2015 Misaqe Ismailzai
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at
 * the University of Toronto.
 */
/// load in exactly this order to avoid circular dependencies ///
var core = require('./core/core.js'),
    schema = require('./core/schema.js'),
    newScapeObject = require('./construct/newScapeObject.js'),
    newScapeMenu = require('./construct/newScapeMenu.js'),
    init = require('./core/init.js');
/// load in exactly this order to avoid circular dependencies ///
module.exports = core;
},{"./construct/newScapeMenu.js":8,"./construct/newScapeObject.js":9,"./core/core.js":10,"./core/init.js":12,"./core/schema.js":13}],23:[function(require,module,exports){
/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchScapeObject = require ('./../fetch/fetchScapeObject.js');
function menuClass(context, element) {
    var callback = newDispatcherCallback(arguments),
        myResult;
    fetchScapeObject(element || context.myChildSchema.name, this, context.myChildSchema.class,
        function(result) {
            myResult = result;
        });
    callback (myResult);
    return myResult;
}
module.exports = menuClass;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchScapeObject.js":20}],24:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuConfig(command, layer, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.gmap = setGmap;
    myCommand.gmaplayer = setGmapLayer;
    myCommand.gmaplabel = setGmapLabel;
    myCommand.datatable = setDatatable;
    myCommand.breaks = setBreaks;
    myCommand.class = setClassification;
    myCommand.colours = setColourscale;
    myCommand.domain = setDataDomain;
    if (myCommand[command]) {
        this.dispatcher({
                myFunction: myCommand[command],
                myArguments: [config, layer]
            },
            function (result) {
                if (result) {
                    console.log('Config element ' + command + ' has been updated.');
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid configuration function.')
    }
    callback(this);
    return this;
}
module.exports = menuConfig;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGoogleBq.js":18}],25:[function(require,module,exports){
/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuData(context, command, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.bq = fetchGoogleBq;
    if (myCommand[command]) {
        this.dispatcher({ // todo jshint errors regarding 'this', however this method is always called with a context
                myFunction: myCommand[command],
                myArguments: [config]
            },
            function (result) {
                if (result) {
                    console.log('Data fetch has been complete.');
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            context.myScapeObjectValue[prop] = result[prop];
                        }
                    }
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid fetch function.');
    }
    callback(this);
    return this;
}
module.exports = menuData;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGoogleBq.js":18}],26:[function(require,module,exports){
/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchWfs = require('./../fetch/fetchWfs.js');
function menuGeom(context, command, config) {
    var callback = newDispatcherCallback(arguments),
        myCommand = {};
    myCommand.wfs = fetchWfs;
    if (myCommand[command]) {
        this.dispatcher({ // todo jshint errors regarding 'this', however this method is always called with a context
                myFunction: myCommand[command],
                myArguments: [config]
            },
            function (result) {
                if (result) {
                    console.log('Geometry fetch has been complete.');
                    for (var prop in result) {
                        if (result.hasOwnProperty(prop)) {
                            context.myScapeObjectValue[prop] = result[prop];
                        }
                    }
                }
            });
    } else {
        console.log('Sorry, "' + command + '" is not a valid fetch function.');
    }
    callback(this);
    return this;
}
module.exports = menuGeom;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchWfs.js":21}],27:[function(require,module,exports){
/*jslint node: true */
/*global module, require, this*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js');
function menuRequires(command, config, myContainer) {
    var callback = newDispatcherCallback(arguments);
    callback(this);
    return this;
}
module.exports = menuRequires;
},{"./../construct/newDispatcherCallback.js":5,"./../fetch/fetchGoogleBq.js":18}]},{},[22])


//# sourceMappingURL=socioscapes.js.map