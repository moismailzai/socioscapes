/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var isValidObject = socioscapes.fn.isValidObject,
    newCallback = socioscapes.fn.newCallback,
    newScapeObject = socioscapes.fn.newScapeObject,
    newEvent = require('./../construct/newEvent.js');
socioscapes.fn.extend([
        {
            path: 'newScapeMenu',
            silent: true,
            extension:
                function newScapeMenu(scapeObject) {
                    var callback = newCallback(arguments),
                        myMenu = this,
                        myEvent,
                        ScapeMenu = function(myObject) {
                            var that = this,
                                myResult = this,
                                mySchema = myObject.schema,
                                myClass = mySchema.class,
                                myParent = mySchema.parent,
                                myType = mySchema.type;
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
                                    var myNew;
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
                                value: function(pong, seconds) {
                                    var myEvent;
                                    seconds = seconds || 4;
                                    myObject.dispatcher({
                                            myFunction: isValidObject,
                                            myArguments: [myObject]
                                        },
                                        function (result) {
                                            if (result) {
                                                myEvent = newEvent('socioscapes.' + pong, 'pong!');
                                                setTimeout(function(){ document.dispatchEvent(myEvent); }, seconds * 1000);
                                            }
                                        });
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
                                        "that": that.this // this is the actual parent object that contains the actual object
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
                                                    callback = newCallback(arguments);
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
                                                            callback();
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
                    if (scapeObject && scapeObject.meta.type === 'scape.sociJson') {
                        if (socioscapes.s && socioscapes.s.meta) {
                            if (scapeObject.meta.name !== socioscapes.s.meta.name) {
                                myEvent = newEvent('socioscapes.object.' + scapeObject.meta.type, scapeObject.meta.name);
                                socioscapes.s = scapeObject;
                                document.dispatchEvent(myEvent);
                            }
                        } else {
                            myEvent = newEvent('socioscapes.object.' + scapeObject.meta.type, scapeObject.meta.name);
                            socioscapes.s = scapeObject;
                            document.dispatchEvent(myEvent);
                        }
                    }
                    callback(myMenu);
                    return myMenu;
                }
        }]);