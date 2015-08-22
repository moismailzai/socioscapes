/*jslint node: true */
/*global module, require, socioscapes*/
'use strict';
var fetchFromScape = socioscapes.fn.fetchFromScape,
    fetchGlobal = socioscapes.fn.fetchGlobal,
    fetchScapeObject = socioscapes.fn.fetchScape,
    newCallback = socioscapes.fn.newCallback,
    newDispatcher = socioscapes.fn.newDispatcher,
    newEvent = socioscapes.fn.newEvent,
    newGlobal = socioscapes.fn.newGlobal,
    fetchScapeSchema = socioscapes.fn.fetchScapeSchema;
socioscapes.fn.extend([
        {
            path: 'newScapeObject',
            silent: true,
            extension:
                function newScapeObject(name, parent, type) {
                    var callback = newCallback(arguments),
                        schema = fetchScapeSchema(type),
                        myEvent,
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
                            // scape objects are defined in the 'fetchScapeSchema' function and follow a json format. each level of a   //
                            // scape object can have an arbitrary number of child elements and socioscapes will produce the necessary //
                            // data structure and corresponding menu items. the following loop creates a member for each item in the  //
                            // current schema's '.children' array. the children array is simply a list of names which correspond to   //
                            // members in the schema's data structure. this means that extending socioscapes can simply be a matter   //
                            // of altering the'fetchScapeSchema' function and allowing the API to do the rest. child entries in         //
                            // [brackets] denote arrays and are populated by instances of the corresponding class. for example, if    //
                            // 'mySchema.children[i].class' is '[state]', then 'mySchema.state[0]' will be created  as the            //
                            // datastructure prototype for all entries in 'this.state'. all such prototypes and schema definitions    //
                            // are stored in the fetchScapeSchema function.                                                             //
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
                            myEvent = newEvent('socioscapes.new', this.meta);
                            document.dispatchEvent(myEvent);
                            return this;
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
        }]);