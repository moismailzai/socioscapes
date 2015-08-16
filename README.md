# Socioscapes.js -  a Javascript GIS library

#### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.


## Details
 
**Current version**: 0.5.6  
*(expect breaking changes prior to version 1.0)*

**Source code**: [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")
 
**Reference implementation**: [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
 
**License**: [MIT license](http://opensource.org/licenses/MIT "MIT license") (free as in beer & speech)
 
**Copyright**: &copy; 2015 Misaqe Ismailzai


## Installation  
 
**Standalone**: [regular] (https://cdn.rawgit.com/moismailzai/socioscapes/master/release/socioscapes.js), [minified] (https://cdn.rawgit.com/moismailzai/socioscapes/master/release/socioscapes-min.js)

```js
<script src="https://cdn.rawgit.com/moismailzai/socioscapes/master/release/socioscapes.js">
```

```js
<script src="https://cdn.rawgit.com/moismailzai/socioscapes/master/release/socioscapes-min.js">
```

**NodeJS**: [npm](https://www.npmjs.com/package/socioscapes)

`npm install socioscapes`
 
**Bower**: [bower](http://bower.io/search/?q=socioscapes)

`bower install socioscapes`


## Dependancies 

**geostats:** Simon Georget's [geostats](https://github.com/simogeo/geostats) library for classifications and basic statistics.
**chroma:** Gregor Aisch's [chroma](https://github.com/gka/chroma.js) library for all-things-colour.


## What Does It Do?

For developers, socioscapes provides an extendable asynchronous API that standardizes interaction with various open-source tools and standards. For the end user, socioscapes allows simple and easy file management: you should be able to save, edit, and share your work in an intuitive, non-proprietary format. Rather than reinvent the wheel, socioscape '.scape' files are simply containers that transparently organize the data you choose to work with. A .scape file is [just a JSON object] (https://github.com/moismailzai/socioscapes/blob/master/src/core/schema.js) with the following structure:

![Image of the Soscioscapes Schema]
(https://raw.githubusercontent.com/moismailzai/socioscapes/master/docs/schema-small.png)
The above is a visual representation of the socioscapes [scape] class, which is itself composed of [state], [layer], and [view] classes. All class instances include a {meta} object that holds arbitrary data unique to the instance, such as a name, an author, and a source. Since the {scape} object is itself just an instance of the [scape] class, it also includes a {meta} member.  

The [state] array stores instances of the [state] class, which are meant to organize all of the data and configuration necessary to reproduce a corresponding DOM state. This structure fascilitates comparative and time series visualization. For instance, suppose a user wishes to demonstrate a change in the way income is distributed across their city. They could create several {state} instances, one for each point in the time series. This allows for maximum data mobility because each {state} is entirely independent of the others and can be edited, saved, and shared independently.  

Now suppose that besides a map, the user also wishes to include some charts, graphs, and tables. Socioscapes approaches this problem by organizing each {state} into [layer] and [view] stores. {layer} objects are static collections of raw numerical and geometric data; {view} objects are indexes that store settings and point to data necessary to recreate a particular element (such a chart). Views are directly incorporated into the DOM whereas layers are just datastores. The above schema is not set in stone and users can use [socioscapes.fn.extend()] (https://github.com/moismailzai/socioscapes/blob/master/src/core/extend.js) to edit, remove, and add additional classes. To get a feel for the API, jump into the code or read through the following examples:


## Usage:

**Note:** While the servers and datasets in these examples are functioning, due to XSS security it is not possible to test these from an outside domain. However, *app.socioscapes.com* hosts a publically exposed copy of the socioscapes API which can be accessed via the developer's console and which has been configured to access the example servers. Don't forget to change the Big Query client id to your Google client id, found in the [Google Developer Console](https://console.developers.google.com/)).

**// first, some setup**   
// create a wfs url

```js
var wfs = 'http://app.socioscapes.com:8080/geoserver/socioscapes/ows?&service=WFS&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=ccsuid=1218001'
```

// create a google big query request 

```js
var bq = {
      id: '2011_census_of_canada',
      clientId: '<YOUR-CLIENT-ID-HERE>',
      projectId: '<YOUR-PROJECT-ID-HERE>',
      queryString: 'SELECT REGEXP_REPLACE(ctuid, '...$', '') AS ctuid, dauid, characteristic, total FROM [2011_census_of_canada.geography_index] as census_geography JOIN EACH [2011_census_of_canada.ontario_da] as census_data ON census_geography.DAuid = census_data.Geo_Code WHERE (CMAName CONTAINS 'Toronto') AND (CTuid != '') AND (Characteristic CONTAINS 'Population in 2011') GROUP BY DAuid, CTuid, Characteristic, Total'
};
```

**// now, use the api**  
// create a new scape object to store our work in. let's call it 'tdot'*  

    socioscapes().new('tdot')

// all scapes are created with a default state ('state0'), and all states are created with a default layer ('layer0') and view ('view0'). since these are the defaults, they are loaded if you call the .state(), .layer(), and .view() methods without an argument. 

    socioscapes('tdot').state()

// check the newly created 'tdot' object to get a sense of the socioscapes datastructure 

    tdot  

// creating a new instance of any socioscapes class is simple

    socioscapes('tdot').state().new('census2011')

// now let's download some data to work with  

    socioscapes('tdot').state('census2011').layer().geom('wfs', wfs).data('bq',bq)

// too verbose? you can create navigation shortcuts  

    l = socioscapes('tdot').state('census2011').layer()
    l.geom('wfs', wfs).data('bq', bq);

// and of course, you can chain everything

```js
socioscapes().new('tdot')
             .state()
             .new('census2011')
             .layer()
             .data('bq', bq)
             .geom('wfs', wfs)
```


## Asynchronous:

The socioscapes Dispatcher class facilitate asynchronous method chaining through the use of instanced queues. Socioscapes associates every 'scape' object with a dispatcher instance. The dispatcher allows for API calls to be queued and synchronously resolved. Calls to the dispatcher can provide a configuration object and a callback. The configuration object must include the function to be called and an array of arguments to be sent to the function, but can also include an optional 'this' context and preferred return value once the call has been resolved. Inside the dispatcher, the function to be queued is evaluated for the number of arguments it expects. The dispatcher then appends null values to the arguments array if the arguments supplied are less than the arguments expected, and appends a callback. When the queue is initiated, a for loop is used to work through the queue and a status boolean prevents further iterations until the current one is processed. While the queue is being processed, new queue items are pushed to the queue array. Socioscapes methods start by evaluating the final argument of the 'arguments' array to test if a dispatcher callback was provided. If one was, the method's results are sent to the callback, before being returned as usual. The callback triggers a new iteration of the queue loop.



## Extendable:

The socioscapes structure is inspired by the jQuery team's module management approach. To extend socioscapes, you simply need to call 'socioscapes.extend' and provide an array of entries that are composed of an object with '.path' (a string), and '.extension' (a value) members. The '.path' tells the API where in the socioscapes prototype to store your extension. The path for most modules will be the root path, which is socioscapes.fn. Your module should be appropriately named to ensure that it is exposed to existing elements. For instance, if you have created a new module that retrieves data from a MySql server, you'd want to use the 'fetch' prefix (eg. 'fetchMysql'). This convention not only allows for a clean ecosystem, but under the hood socioscapes also exposed modules contextually based on prefixes.

// the following snippet is from [src/core/init.js] (https://cdn.rawgit.com/moismailzai/socioscapes/master/src/core/init.js). it creates a new member "init", defines it as a function, and exposes it in the API at socioscapes.fn.init.
 
```js
var fetchScape = socioscapes.fn.fetchScape,
    newScapeObject = socioscapes.fn.newScapeObject,
    newScapeMenu = socioscapes.fn.newScapeMenu,
    newGlobal = socioscapes.fn.newGlobal,
    fetchGlobal = socioscapes.fn.fetchGlobal;
socioscapes.fn.extend([
    {
        path: 'init',
        silent: true,
        extension:
            function coreInit(scape) {
                var myScape;
                scape = scape || 'scape0';
                myScape = fetchScape(scape);
                if (!myScape) {
                    myScape = newScapeObject('scape0', null, 'scape');
                }
                socioscapes.s = myScape; // reference to current scape object
                newGlobal('socioscapes', socioscapes, true);
                return newScapeMenu(myScape);
            }
    }
]);
```

*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*
