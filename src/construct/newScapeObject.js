/*jslint node: true */
/*global module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchScapeSchema = require('./../fetch/fetchScapeSchema.js');
/**
 * This method creates socioscape {@link ScapeObject} objects.
 *
 * @function newScapeObject
 * @memberof socioscapes
 * @param {string} name - A valid JavaScript name.
 * @param {Object} parent - A valid {@link ScapeObject} or null.
 * @param {string} type - A valid scape.sociJson scape class.
 * @return {Object} - A socioscapes {@link ScapeObject} object.
 */
var newScapeObject = function newScapeObject(name, parent, type) {
    var callback = newCallback(arguments),
        schema = fetchScapeSchema(type),
        myObject = false,
        /**
         * Represents a {@link ScapeObject} (a json container for arbitrary geospatial data).
         * @namespace ScapeObject
         * @constructor
         * @param {string} myName - A valid name.
         * @param {?Object} myParent - The containing parent item or null if this is a top level {@link ScapeObject} (a scape).
         * @param {Object} mySchema - The {@link socioscapes} schema branch that describes this {@link ScapeObject}.
         */
        ScapeObject = function(myName, myParent, mySchema) {
            var myDispatcher = (myParent) ? myParent.dispatcher:newDispatcher();
            /**
             * Accesses {@link Dispatcher#dispatch}.
             *
             * @memberof ScapeObject#
             * @function dispatch
             * */
            Object.defineProperty(this, 'dispatch', {
                value: myDispatcher.dispatch
            });
            /**
             * The schema definition corressponding to this {@link ScapeObject}.
             *
             * @memberof ScapeObject#
             * @member {Object} schema
             * */
            Object.defineProperty(this, 'schema', {
                value: mySchema
            });
            /**
             * The parent {@link ScapeObject} item.
             *
             * @memberof ScapeObject#
             * @member {Object} parent
             * */
            Object.defineProperty(this.schema, 'parent', {
                value: myParent || false
            });
            /**
             * The array container within the parent {@link ScapeObject} item which stores other {@link ScapeObject}s of this type.
             *
             * @memberof ScapeObject#
             * @member {Object} container
             * */
            if (!this.schema.container) {
                Object.defineProperty(this.schema, 'container', {
                    value: myParent ? myParent[mySchema.class]:false
                });
            }
            /**
             * The metadata corresponding to this {@link ScapeObject}.
             *
             * @memberof ScapeObject#
             * @member {Object} meta
             * */
            Object.defineProperty(this, 'meta', {
                value: {},
                writeable: true,
                enumerable: true
            });
                Object.defineProperty(this.meta, 'author', {
                    value: '',
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'name', {
                    value: myName,
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'summary', {
                    value: '',
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'type', {
                    value: mySchema.type,
                    enumerable: true
                });
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // {@link ScapeObjects} are defined in the {@link socioscapes}.prototype.schema member and follow a json format. each
            // level of a scape object can have an arbitrary number of child elements and {@link socioscapes} will produce the
            // necessary data structure and corresponding menu items. the following loop creates a member for each item
            // in the current schema's '.children' array. the children array is simply a list of names which correspond
            // to members in the schema's data structure. this means that extending {@link socioscapes} can simply be a matter
            // of altering the '.schema' member and allowing the API to do the rest. child entries in [brackets] denote
            // arrays and are populated by instances of the corresponding class. for example, if 'mySchema.children[i].class'
            // is '[state]', then 'mySchema.state[0]' will be created  as the datastructure prototype for all entries in
            // 'this.state'. all such prototypes and schema definitions are stored in the {@link socioscapes}.prototype.schema.
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
                        enumerable: true,
                        writable: true
                    });
                }
                if  (myChildIsArray) {
                    this[myChildClass].push(new ScapeObject(myChildName, this, myChildSchema));
                }
            }
            newEvent('socioscapes.new.' + this.meta.type, this);
            return this;
        };
    parent = fetchScape(parent);
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
            if (fetchScape(name)) {
                console.log('Fetching exisisting scape "' + name + '".');
                myObject = fetchScape(name);
            } else {
                if (!fetchGlobal(name)) {
                    console.log('Creating a new scape called "' + name + '".');
                    myObject = new ScapeObject(name, null, schema);
                    newGlobal(name, myObject);
                }
            }
        }
    }
    callback(myObject);
    return myObject;
};
module.exports = newScapeObject;
