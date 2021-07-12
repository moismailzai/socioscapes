# Socioscapes.js - a Javascript GIS library

#### Socioscapes is a library for geographic data visualization.

## Details

**Current version**: 0.8.0-0  
*(expect breaking changes prior to version 1.0)*

**Source
code**: [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")

**Reference implementation**: [https://www.socioscapes.com](https://www.socioscapes.com "www.socioscapes.com")

**License**: [MIT license](http://opensource.org/licenses/MIT "MIT license") (free as in beer & speech)

**Copyright**: &copy; 2021 Mo Ismailzai

## Installation

`yarn install socioscapes`

## Dependancies

**geostats:** Simon Georget's [geostats](https://github.com/simogeo/geostats) library for classifications and
statistics.  
**chroma:** Gregor Aisch's [chroma](https://github.com/gka/chroma.js) library for all-things-colour.

## What Does It Do?

For developers, socioscapes provides an extendable asynchronous API that standardizes interaction with various
open-source tools and standards. For the end user, socioscapes allows simple and easy file management: you should be
able to save, edit, and share your work in an intuitive, non-proprietary format. Rather than reinvent the wheel,
socioscape `.scape` files are simply containers that transparently organize the data you choose to work with. A `.scape`
file is [just a JSON object] (https://github.com/moismailzai/socioscapes/blob/master/src/core/schema.js) with the
following structure:

![Image of the Soscioscapes Schema]
(https://raw.githubusercontent.com/moismailzai/socioscapes/master/assets/schema-small.png)  
The `scape` class consists of `state`, `layer`, and `view` items. All class instances include a `meta` object that holds
arbitrary data unique to the instance, such as a name, an author, and a source.

The `state` array stores instances of the `state` class, which are meant to organize data and configuration required to
reproduce a corresponding DOM state. This structure facilitates comparative and time series visualization. For instance,
suppose a user wishes to demonstrate a change in income distribution across their city. They could create
several `state` instances, one for each point in the time series, all of which can be stored and shared in a
single `scape`.

`scape`s can hold multiple `state`s, which themselves can hold multiple `layer`s and `view`s. `layer`s are static
collections of raw numerical and geometric data; `view`s hold the metadata necessary for visualization.

For other use cases, use `socioscapes.fn.extender` to edit, remove, and add additional structures to the `scape`. To get
a feel for the API, jump into the code or read through the following examples:

## Usage:

**Note:** While the servers and datasets in these examples are functioning, due to XSS security it is not possible to
test these from an outside domain. However, *app.socioscapes.com* hosts a publically exposed copy of the socioscapes API
which can be accessed via the developer's console and which has been configured to access the example servers. Don't
forget to change the Big Query client id to your Google client id, found in
the [Google Developer Console](https://console.developers.google.com/)).

**using the api**

```js
// create a new scape object to store our work in. let's call it 'tdot'. if you don't specify a new scape, the api uses the default one ('scape0')  
socioscapes().new('tdot')

// all scapes are created with a default state ('state0'), and all states are created with a default layer ('layer0') and view ('view0'). these defaults are loaded if .state(), .layer(), or .view() are called without an argument. 
socioscapes('tdot').state()

// lets check the newly created 'tdot' scape object to get a sense of the socioscapes datastructure 
tdot

// creating a new socioscapes object of any class is simple
socioscapes('tdot').state().new('census2011')

// okay, let's download some Toronto census data to work with. socioscapes has native support for WFS geometry in geoJSON format and can parse Google Bigquery results. let's set all that up (these variables, "bq" and "wfs", are preconfigured and publicly exposed on the reference implementation website).

var wfs = "http://app.socioscapes.com:8080/geoserver/socioscapes/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=socioscapes:2011-canada-census-da&outputFormat=json&cql_filter=csduid=3520005";

var bq = {
    auth: SERVICETOKEN,
    clientId: "REPLACE WITH YOUR GOOGLE APIS CLIENT ID",
    id: '2011_census_of_canada',
    featureIdProperty: 'dauid',
    projectId: '424138972496',
    queryString: "SELECT dauid, SUM(IF(REGEXP_MATCH(question, r'(^1$)'),total,0)) as characteristic, SUM(IF(REGEXP_MATCH(question, r'(^7$)'),total,0)) as normalization, SUM(IF(REGEXP_MATCH(question, r'(^1$)'),total,0))/SUM(IF(REGEXP_MATCH(question, r'(^7$)'),total,0)) as total FROM [canada_census_2011.ontario] WHERE csduid CONTAINS '3520005' AND (REGEXP_MATCH(question, r'(^1$)') OR REGEXP_MATCH(question, r'(^7$)') )GROUP BY dauid;"
};

socioscapes('tdot').state('census2011').layer().data('bq', bq).geom('wfs', wfs)

// too verbose? the api is setup that way so you can add callbacks at every link. but you can create navigation shortcuts if you prefer
l = socioscapes('tdot').state('census2011').layer()
v = socioscapes('tdot').state('census2011').view()
l.geom('wfs', wfs).data('bq', bq);
v.config('gview')

// putting it all together: using the configuration objects we created above, the code snippet below will create a new scape object called tdot, create a state called census2011, fetch and parse wfs geometry, fetch related google bigquery data, create a new google map, organize the data based on default values and render it to the view if there is a "map-canvas" div present.

socioscapes().new('tdot').state().new('census2011').layer().data('bq', bq).geom('wfs', wfs, function() {
    socioscapes('tdot').state('census2011').view().config('gview');
}); 
```

## Socioscapes Events:

To aid with unidirectional data flow, the API fires the following events:

**ScapeMenu is created:** fires 'socioscapes.newScapeMenu' with event.detail = scapeMenu;   
**ScapeObject is created:** fires 'socioscapes.newScapeObject' with event.detail = scapeObject;   
**viewGmapSymbology completed:** fires 'socioscapes.updateSymbology' with event.detail = socioscapesView;

## Asynchronous:

The Dispatcher class helps to facilitate asynchronous method chaining and queues. Socioscapes associates every `scape`
object with a unique dispatcher instance and id. The dispatcher allows for API calls to be queued and synchronously
resolved on a per-scape basis by attaching a unique dispatcher instance to every scape. The api itself remains
asynchronous. Calls to the dispatcher should provide an arguments array, `myArguments`, and a function,
`myFunction`. The first argument in `myArguments` should always be the object that `myFunction` modifies and/or returns.
`myFunction` is evaluated for the number of expected arguments (`myFunction.length`), and the dispatcher appends null
values for expected arguments that are missing. Additionally, the dispatcher appends a callback function to the array
and all functions that are executed through the dispatcher can safely assume that the element at
index `myArguments.length` is a callback. Finally, a queue item consisting of the `myFunction` and `myArguments` members
added to the dispatcher's queue. The dispatcher works through each item in its queue by
executing `myFunction(myArguments)` and waiting for the callback function to fire an event that signals that the
function has returned a value and the dispatcher can safely move on to the next item its queue.

## Extendable:

The socioscapes structure is inspired by the jQuery team's module system. To extend socioscapes, just call
`socioscapes.extender` and provide an array of entries that are composed of an object with `.path` (a string), and
`.extension` (a value) members. `.path` tells the API where to store your extension, and for most modules, will be the
root path, which is `socioscapes.fn`. The name of your module should be prefixed such that existing elements can access
it. For instance, if you have created a new module that retrieves data from a MySql server, you'd want to use
the `fetch`
prefix (eg. `fetchMysql`).