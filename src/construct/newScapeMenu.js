/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var newScapeMenu = function newScapeMenu(scapeObject) {
    var isValidObject = newScapeMenu.prototype.isValidObject,
        newScapeObject = newScapeMenu.prototype.newScapeObject,
        newEvent = newScapeMenu.prototype.newEvent,
        newChildMenu = function(myChild, mySchema, myObject, that) {
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
                "object": myObject[myChildClass], // this is the actual child object
                "schema": myChildSchema, // this is the prototype of the child object
                "that": myObject // this is the actual parent object that contains the actual object
            };
            if (myChildSchema.menu) {
                // if the schema definition includes a .menu member, it is used as an API interface for that
                // item. for example, if the 'geom' class had the following '.menu' entry:
                //                                               function(foo) { console.log(foo, 'bar!'); };
                // then 'socioscapes().state().layer().geom('foo')' would result in a console printout of 'foobar!'
                // child items without a .menu member are ignored.
                Object.defineProperty(that, myChildClass, {
                    value: function () {
                        var myArgs = [],
                            myNewObject,
                            myResult;
                        myArgs.push(myChildContext);
                        for (var i = 0; i < arguments.length; i++) {
                            myArgs.push(arguments[i]);
                        }
                        if (myChildSchema.menu.name === 'menuClass') {
                            myNewObject = myChildSchema.menu.apply(myObject, myArgs);
                            myResult = newScapeMenu(myNewObject);
                        } else {
                            myObject.dispatcher.dispatch({
                                    myFunction: myChildSchema.menu,
                                    myArguments: myArgs,
                                    myThis: myObject
                                },
                                function (result) {
                                    if (result) {
                                        myResult = result;
                                    }
                                });
                            myResult = that;
                        }
                        return myResult;
                    }
                });
            }
        };
    //
    var ScapeMenu = function(myObject) {
        var that = this,
            mySchema = myObject.schema,
            myClass = mySchema.class,
            myParent = mySchema.parent,
            myType = mySchema.type,
            myEvent;
        Object.defineProperty(this, 'schema', {
            value: myObject.schema
        });
        Object.defineProperty(this, 'this', {
            value: myObject
        });
        Object.defineProperty(this, 'meta', {
            value: myObject.meta
        });
        Object.defineProperty(this, 'new', {
            value: function (name) {
                var myNew,
                    myResult = this;
                name = name || mySchema.name + myClass.length;
                myNew = newScapeObject(name, myParent, myType);
                myResult = myNew ? new ScapeMenu(myNew):myResult;
                return myResult;
            }
        });
        Object.defineProperty(this, 'ping', {
            value: function(pong, callback) {
                var myEvent;
                myEvent = newEvent(pong, 'pong!');
                document.dispatchEvent(myEvent);
                if (typeof callback === 'function') {
                    callback();
                }
                return that;
            }
        });
        for (var i = 0; i < mySchema.children.length; i++) {
            newChildMenu(mySchema.children[i], mySchema, myObject, this);
        }
        myEvent = newEvent('socioscapes.active', myObject.meta);
        document.dispatchEvent(myEvent);
        return this;
    };
    if (isValidObject(scapeObject)) {
        return new ScapeMenu(scapeObject);
    }
};
module.exports = newScapeMenu;