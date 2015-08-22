/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var isValidObject = socioscapes.fn.isValidObject,
    newCallback = socioscapes.fn.newCallback,
    newScapeObject = socioscapes.fn.newScapeObject,
    fetchFromScape = socioscapes.fn.fetchFromScape,
    newEvent = require('./../construct/newEvent.js');
socioscapes.fn.extend([
        {
            path: 'newScapeMenu',
            silent: true,
            extension:
                function newScapeMenu(scapeObject) {
                    var callback = newCallback(arguments),
                        myMenu = this,
                        ScapeMenu = function(myObject) {
                            var that = this,
                                mySchema = myObject.schema,
                                myClass = mySchema.class,
                                myParent = mySchema.parent,
                                myType = mySchema.type,
                                myEvent;
                            Object.defineProperty(this, 'drop', {
                                value: function() {
                                    delete window[myObject];
                                    return this;
                                }
                            });
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
                                        myResult;
                                    name = name || mySchema.name + myClass.length;
                                    myNew = newScapeObject(name, myParent, myType);
                                    myResult = myNew ? new ScapeMenu(myNew):myResult;
                                    return myResult;
                                }
                            });
                            Object.defineProperty(this, 'save', {
                                value: ''
                            });
                            Object.defineProperty(this, 'load', {
                                value: ''
                            });
                            Object.defineProperty(this, 'ping', {
                                value: function(pong, callback) {
                                    var myEvent;
                                    myEvent = newEvent(pong, 'pong!');
                                    document.dispatchEvent(myEvent);
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                    return  that;
                                }
                            });
                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            // scape menus are defined in the 'fetchScapeSchema' function by adding a '.menu' property to a given entry.//
                            // the following loop creates a new menu entry for each corresponding element in the current schema's     //
                            // '.children' array. the children array is simply a list of names which correspond to members in the     //
                            // schema's data structure. this means that extending socioscapes can simply be a matter of altering the  //
                            // 'fetchScapeSchema' function and allowing the API to do the rest.                                         //
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
                                                    myObject.dispatcher({
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
                                })(mySchema.children[i]); // todo jshin error, unsure how to resolve this
                            }
                            myEvent = newEvent('socioscapes.active', myObject.meta);
                            document.dispatchEvent(myEvent);
                            return this;
                        };
                    if (isValidObject(scapeObject)) {
                        myMenu = new ScapeMenu(scapeObject);
                    }
                    callback(myMenu);
                    return myMenu;
                }
        }]);