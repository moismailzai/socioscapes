/*jslint node: true */
/*global module, require, google*/
'use strict';
var isValidName = require('./../bool/isValidName.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js'),
    fetchScapeObjectConfig = require('./../fetch/fetchScapeObjectConfig.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newGlobal = require('./../construct/newGlobal.js');
function newScapeObject(name, parent, type) {
    var callback = newDispatcherCallback(arguments),
        myConfig = fetchScapeObjectConfig(type),
        myObject = false,
        ScapeObject = function(myName, myParent, myConfig) {
            var that = this,
                myBreadcrumbs = fetchScapeObjectConfig(myConfig.type.split('.')[0]),
                myChildren = (myConfig && myConfig.children) ? myConfig.children:isScape.children,
                myDispatcher = myParent ? myParent.dispatcher:newDispatcher();
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
            Object.defineProperty(this.meta, 'breadcrumbs', {
                value: myBreadcrumbs
            });
            Object.defineProperty(this.meta.breadcrumbs, 'parent', {
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
                value: myConfig.type,
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
            if (myChildren) {
                for (var i = 0; i < myChildren.length; i++) {
                    if (!that[myChildren[i].container]) {
                        Object.defineProperty(that, myChildren[i].container, {
                            value: myChildren[i].value,
                            enumerable: true
                        });
                    }
                    if (myChildren[i].children) {
                        that[myChildren[i].container].push(new ScapeObject(
                            myChildren[i].type.split('.')[0] + '0',
                            that,
                            fetchScapeObjectConfig(myChildren[i].type)
                        ))
                    }
                }
            }
        };
    name = isValidName(name) ? name:false;
    parent = fetchScapeObject(parent);
    if (name) {
        if (parent) {
            if (myConfig) {
                if (fetchFromScape(name, 'name', parent[myConfig.container])) {
                    console.log('Fetching existing scape object "' + name + '".');
                    myObject = fetchFromScape(name, 'name', parent[myConfig.container]);
                } else {
                    console.log('Adding an object called "' + name + '" to the "' + parent.meta.name + '" container.');
                    myObject = new ScapeObject(name, parent, myConfig);
                    parent[myConfig.container].push(myObject);
                }
            }
        } else {
            if (fetchScapeObject(name)) {
                console.log('Fetching exisisting scape "' + name + '".');
                myObject = fetchScapeObject(name);
            } else {
                if (!fetchGlobal(name)) {
                    console.log('Creating a new scape called "' + name + '".');
                    myObject = new ScapeObject(name, null, myConfig);
                    newGlobal(name, myObject);
                } else {
                    console.log('Sorry, a global object by that name already exists.')
                }

            }
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = newScapeObject;