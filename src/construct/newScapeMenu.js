/*jslint node: true */
/*global module, require*/
'use strict';
import newEvent from './../construct/newEvent';
import isValidObject from './../bool/isValidObject';
import newScapeObject from './../construct/newScapeObject';

/**
 * This method creates {@link ScapeMenu} objects, which are the api interfaces that developers interact with.
 *
 * @function newScapeMenu
 * @memberof socioscapes
 * @param {Object} scapeObject - A valid {@link ScapeObject}.
 * @param {Object} socioscapesPrototype - The {@link socioscapes} api prototype.
 * @return {Object} - A {@link socioscapes} {@link ScapeMenu} object.
 */
export default function newScapeMenu(scapeObject, socioscapesPrototype) {
    let newChildMenu = function newChildMenu(
        thisMenu, myObject, mySchema, myChild) {
            let myChildIsContainer = myChild.class.match(/\[(.*?)]/g) ?
                true :
                false, // is the child item an array that contains layers or views? [signified by schema classes in square brackets]
                myChildClass = myChildIsContainer ?
                    /\[(.*?)]/g.exec(myChild.class)[1] :
                    myChild.class, // strip the [square brackets]
                myChildSchema = myChildIsContainer ?
                    mySchema[myChildClass][0] :
                    mySchema[myChildClass]; // child item datastructure
            if (myChildSchema.menu) { // if the datastructure defines a menu stub
                Object.defineProperty(thisMenu, myChildClass, { // "myChildClass" evaluates to a classname string (eg. 'state' or 'view' or 'config')
                    value: function(command, config, callback) {
                        let myArguments = [],
                            myCallback = ((typeof command === 'function') &&
                                !config && !callback) ?
                                command // test to see if the first argument is the only one provided and a function. if it is, assume it's a callback
                                :
                                ((typeof config === 'function') && !callback) ?
                                    config // otherwise, if the second argument is a function and there's no third argument, assume it's a callback
                                    :
                                    ((typeof callback === 'function') ?
                                        callback :
                                        function() {
                                        }), // otherwise, if the third argument is a function, assume it's a callback or create an empty one
                            myContext = { // this object points to several important references
                                'object': myObject[myChildClass], // this is the object that the menu calls will manipulate
                                'schema': myChildSchema, // this is the datastructure of the above object
                                'that': myObject, // this is the parent object of the above object (to be used as the "this" return object to facilitate method chaining)
                            },
                            myCommand,
                            myFunction = myChildSchema.menu,
                            myReturn = thisMenu; // default return value (to facilitate method chaining in the api)
                        if (myChildSchema.menu.name === 'menuClass') { // if the object we need to create is of class 'menuClass' (which means it will be an api menu object)
                            myObject = myChildSchema.menu(myContext, command,
                                config); // just generate it on the fly since it's not async
                            myReturn = newScapeMenu(myObject, socioscapesPrototype); // trigger the callback (so that method chaining works even for synchronous api calls)
                            myCallback(myReturn); // and set the return value to be the new api menu object
                        } else { // otherwise, it might produce an asynchronous call so queue to the dispatcher so it can be evaluated sequentially
                            if (command) { // setup the myArguments array for the dispatcher
                                myCommand = socioscapesPrototype[command] ||  // if command matches a full command name
                                    socioscapesPrototype.schema.alias[command] || // or an alias
                                    ((typeof command === 'function') ?
                                        command :
                                        false); // or if it's a function, then let it be equal to itself; otherwise, false
                                myArguments.push(myCommand); // if a command arg was provided, push it to the myArguments array
                                if (typeof config !== 'function') { // do the same for config
                                    myArguments.push(config);
                                }
                            }
                            myObject.dispatch({
                                'myArguments': myArguments,
                                'myCallback': myCallback,
                                'myContext': myContext,
                                'myFunction': myFunction,
                            });
                        }
                        return myReturn;
                    },
                });
            }
        },
        /**
         * Represents a {@link ScapeMenu} (the actual api menu interface that users interact with).
         * @namespace ScapeMenu
         * @constructor
         * @param {Object} myObject - An object of type {@link ScapeObject}.
         */
        ScapeMenu = function(myObject) {
            let mySchema = myObject.meta.schema,
                myClass = mySchema.class,
                myParent = mySchema.parent,
                myType = mySchema.type,
                thisMenu = this;
            myObject.meta.thisMenu = thisMenu;
            myObject.meta.thisObject = myObject;
            /**
             * The metadata of the {@link ScapeObject} that this {@link ScapeMenu} is linked to.
             *
             * @memberof ScapeMenu#
             * @member {Object} meta
             * */
            Object.defineProperty(this, 'meta', {
                value: myObject.meta,
            });
            /**
             * Creates and returns a new object of this type (which is stored in the parent container).
             *
             * @memberof ScapeMenu#
             * @function new
             * */
            Object.defineProperty(this, 'new', {
                value: function(name) {
                    let myMenu = thisMenu,
                        myNew;
                    if (name) {
                        myNew = newScapeObject(name, myParent, myType);
                        myMenu = myNew ? new ScapeMenu(myNew) : thisMenu;
                    }
                    return myMenu;
                },
            });
            for (let i = 0; i < mySchema.children.length; i++) {
                newChildMenu(this, myObject, mySchema, mySchema.children[i]);
            }
            newEvent('socioscapes.newScapeMenu', this);
            return this;
        };
    if (isValidObject(scapeObject)) {
        return new ScapeMenu(scapeObject);
    }
};
