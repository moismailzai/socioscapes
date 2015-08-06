/*jslint node: true */
/*global module, require, google*/
'use strict';
var fetchScapeObject = require ('./../fetch/fetchScapeObject.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    newScapeObject = require('./../construct/newScapeObject.js');
/**
 * This
 *
 * @method newMenu
 * @memberof! socioscapes
 * @return
 */
function newScapeMenu(scapeObject) {
    var callback = newDispatcherCallback(arguments),
        myMenu = false,
        ScapeMenu = function(myObject) {
            var that = this,
                isScape = (myObject.meta.breadcrumbs.isScape),
                isState = (myObject.meta.breadcrumbs.isState),
                isLayer = (myObject.meta.breadcrumbs.isLayer),
                isView  = (myObject.meta.breadcrumbs.isView),
                myBreadcrumbs = myObject.meta.breadcrumbs,
                myChildren = myBreadcrumbs.children,
                myContainer = myBreadcrumbs.container,
                myParent = myObject.meta.breadcrumbs.parent,
                myType = myObject.meta.type.split('.')[0],
                newMenu,
                newObject;
            Object.defineProperty(this, 'drop', {
                value: function() {
                    delete window[myObject['meta']['name']];
                }
            });
            Object.defineProperty(this, 'meta', {
                value: function() {
                    return  myObject.meta;
                },
                configurable: false
            });
            Object.defineProperty(this, 'new', {
                value: function (name) {
                    name = name || (myContainer ? myType + myContainer.length:'scape0');
                    myObject.dispatcher({
                            myFunction: newScapeObject,
                            myArguments: [name, myParent, myType]
                        },
                        function (result) {
                            if (result) {
                                newObject = result;
                                newMenu = new ScapeMenu(newObject);
                            }
                        });
                    return newMenu;
                }
            });
            Object.defineProperty(this, 'store', {
                value: ''
            });
            for (var i = 0; i < myChildren.length; i++) {
                (function(myChild) {
                    var myMember = !(myChild && myChild.type) ? myChild.container:myChild.type.split('.')[0],
                        myValue = !(myChild && myChild.type) ? function(){ return myObject[myChild.container] }:function(name) {
                            name = name || myMember + '0';
                            myObject.dispatcher({
                                myFunction: fetchScapeObject,
                                myArguments: [name, myObject]
                            },
                            function(result) {
                                if (result) {
                                    newObject = result;
                                    newMenu = new ScapeMenu(newObject);
                                }
                            });
                        return newMenu;
                    };
                    Object.defineProperty(that, myMember, {
                        value: myValue
                    });
                })(myChildren[i]);
            }
            newGlobal('s', this, true);
        };
    if (isValidObject(scapeObject)) {
        myMenu = new ScapeMenu(scapeObject);
    }
    callback(myMenu);
    return myMenu;
}
module.exports = newScapeMenu;