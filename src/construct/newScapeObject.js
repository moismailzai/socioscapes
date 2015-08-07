/*jslint node: true */
/*global module, require, google*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeSchema = require('./newScapeSchema.js');
function newScapeObject(name, parent, type) {
    var callback = newDispatcherCallback(arguments),
        schema = newScapeSchema(type),
        myObject = false,
        ScapeObject = function(myName, myParent, mySchema) {
            var that = this,
                myDispatcher = (myParent) ? myParent.dispatcher:newDispatcher();
            Object.defineProperty(this, 'dispatcher', {
                value: myDispatcher
            });
            Object.defineProperty(this, 'meta', {
                value: {},
                enumerable: true
            });
            Object.defineProperty(this.meta, 'author', {
                value: '',
                configurable: true,
                enumerable: true
            });
            Object.defineProperty(this.meta, 'schema', {
                value: mySchema
            });
            Object.defineProperty(this.meta.schema, 'parent', {
                value: myParent || false
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
            Object.defineProperty(this, 'setMeta', {
                value: function (property, value) {
                    if (typeof property === 'string' && typeof value === 'string') {
                        Object.defineProperty(that.meta, property, {
                            value: value,
                            configurable: true,
                            enumerable: true
                        });
                    }
                    return this;
                }
            });
            for (var i = 0; i < mySchema.children.length; i++) {
                if (!that[mySchema.children[i].container]) {
                    Object.defineProperty(that, mySchema.children[i].container, {
                        value: mySchema[mySchema.children[i].container].value || [],
                        enumerable: true
                    });
                }
                if  (mySchema.children[i].item) {
                    that[mySchema.children[i].container].push(new ScapeObject(
                        mySchema.children[i].item,
                        that,
                        newScapeSchema(mySchema.children[i].type)
                    ))
                }
            }
        };
    name = isValidName(name) ? name:false;
    parent = fetchScapeObject(parent);
    if (name) {
        if (parent) {
            if (schema) {
                if (fetchFromScape(name, 'name', parent[schema.container])) {
                    console.log('Fetching existing scape object "' + name + '".');
                    myObject = fetchFromScape(name, 'name', parent[schema.container]);
                } else {
                    console.log('Adding an object called "' + name + '" to the "' + parent.meta.name + '" container.');
                    myObject = new ScapeObject(name, parent, schema);
                    parent[schema.container].push(myObject);
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
                    console.log('Sorry, a global object external to socioscapes is already associated with that name.')
                }
            }
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = newScapeObject;