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