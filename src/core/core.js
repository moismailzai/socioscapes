/*jslint node: true */
/*global module, require*/
'use strict';
import newScapeMenu from '../construct/newScapeMenu';
import chroma from 'chroma-js';
import geostats from 'geostats';
import newCallback from './../construct/newCallback.js';
import newEvent from './../construct/newEvent.js';
import newDispatcher from './../construct/newDispatcher.js';
import fetchGlobal from './../fetch/fetchGlobal.js';
import newGlobal from './../construct/newGlobal.js';
import isValidObject from './../bool/isValidObject.js';
import isValidName from './../bool/isValidName.js';
import isValidUrl from './../bool/isValidUrl.js';
import fetchFromScape from './../fetch/fetchFromScape.js';
import fetchScape from './../fetch/fetchScape.js';
import fetchGoogleAuth from './../fetch/fetchGoogleAuth.js';
import fetchGoogleGeocode from './../fetch/fetchGoogleGeocode.js';
import fetchGoogleBq from './../fetch/fetchGoogleBq.js';
import fetchWfs from './../fetch/fetchWfs.js';
import menuClass from './../menu/menuClass.js';
import menuConfig from './../menu/menuConfig.js';
import menuRequire from './../menu/menuRequire.js';
import menuStore from './../menu/menuStore.js';
import schema from './../core/schema.js';
import fetchScapeSchema from './../fetch/fetchScapeSchema.js';
import newScapeObject from './../construct/newScapeObject.js';
import extender from './../core/extender';

const version = '0.8.0-0';

/**
 * @global
 * @namespace
 * @param {string} [scapeName=scape0] - The name of an existing ScapeObject to load.
 * @return {Object} The {@link socioscapes} api interface, which is a {@link ScapeMenu} object.
 */
export default function socioscapes(scapeName) { // when socioscapes is called, fetch the {@link ScapeObject} specified (or fetch / create a default {@link ScapeObject}) and return an api ({@link ScapeMenu}) for it
    let myScape = fetchScape(scapeName || 'scape0') ||
        newScapeObject('scape0', null, 'scape');
    return newScapeMenu(myScape, socioscapes.prototype);
}

// lets steal some structure from jQuery and setup socioscapes.prototype to act as a central methods repository, this way external socioscapes extensions will have access to internal socioscapes methods via the prototype
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    chroma: chroma,
    geostats: geostats,
    extender: extender,
    fetchFromScape: fetchFromScape,
    fetchGlobal: fetchGlobal,
    fetchGoogleAuth: fetchGoogleAuth,
    fetchGoogleBq: fetchGoogleBq,
    fetchGoogleGeocode: fetchGoogleGeocode,
    fetchScape: fetchScape,
    fetchScapeSchema: fetchScapeSchema,
    fetchWfs: fetchWfs,
    isValidName: isValidName,
    isValidObject: isValidObject,
    isValidUrl: isValidUrl,
    menuClass: menuClass,
    menuConfig: menuConfig,
    menuRequire: menuRequire,
    menuStore: menuStore,
    newCallback: newCallback,
    newDispatcher: newDispatcher,
    newEvent: newEvent,
    newGlobal: newGlobal,
    newScapeMenu: newScapeMenu,
    newScapeObject: newScapeObject,
    schema: schema,
    version: version,
};
