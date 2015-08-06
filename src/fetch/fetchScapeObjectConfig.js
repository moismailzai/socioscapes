/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js'),
    fetchScapeObject = require('./../fetch/fetchScapeObject.js');
/**
 * This internal method tests if a name used for a socioscapes scape, state, layer, or view adheres to naming
 * restrictions.
 *
 * @returns {Boolean}
 */
function fetchScapeObjectConfig(type) {
    var callback = newDispatcherCallback(arguments),
        myObject = false,
        myTypes  = [
            'scape.sociJson',
            'state.scape.sociJson',
            'layer.state.scape.sociJson',
            'view.state.scape.sociJson'
        ],
        myTypesAliases  = [
            'scape',
            'state',
            'layer',
            'view'
        ],
        myTypesProps = {
            scape: {
                children: [
                    {
                        children: true,
                        container: 'states',
                        type: 'state.scape.sociJson',
                        value: []
                    }
                ],
                container: false,
                containerParent: false,
                isScape: true,
                type: 'scape.sociJson'
            },
            state: {
                children: [
                    {
                        children: true,
                        container: 'layers',
                        type: 'layer.state.scape.sociJson',
                        value: []
                    },
                    {
                        children: true,
                        container: 'views',
                        type: 'view.state.scape.sociJson',
                        value: []
                    }
                ],
                container: 'states',
                containerParent: 'scape',
                isState: true,
                type: 'state.scape.sociJson'
            },
            layer: {
                children: [
                    {
                        children: false,
                        container: 'data',
                        value: []
                    },
                    {
                        children: false,
                        container: 'geom',
                        value: []
                    }
                ],
                container: 'layers',
                containerParent: 'state',
                isLayer: true,
                type: 'layer.state.scape.sociJson'
            },
            view: {
                children: [
                    {
                        children: false,
                        container: 'requires',
                        value: []
                    },
                    {
                        children: false,
                        container: 'config',
                        value: {}
                    }
                ],
                container: 'views',
                containerParent: 'state',
                isView: true,
                type: 'view.state.scape.sociJson'
            }
        };
    type =  ( (myTypes.indexOf(type) > -1) ? type.split('.')[0]:false ) ||
            ( (myTypesAliases.indexOf(type) > -1) ? type:false );
    if (type) {
        myObject = myTypesProps[type];
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScapeObjectConfig;