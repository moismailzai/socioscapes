# Socioscapes.js -  a Javascript GIS library

### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.
   
   
   
### Details
***  
**Current version**:     0.5.5  
*(expect breaking changes prior to version 1.0)*

**Source code**:     [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")
 
**Reference implementation**:  [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
 
**License**:         [MIT license](http://opensource.org/licenses/MIT "MIT license") (free as in beer & speech)
 
**Copyright**:       &copy; 2015 Misaqe Ismailzai
   
   
   
### Installation  
***  
**Standalone**: [regular] (https://cdn.rawgit.com/moismailzai/socioscapes/master/socioscapes.js), [minified] (https://cdn.rawgit.com/moismailzai/socioscapes/master/socioscapes-min.js)

    <script src="https://cdn.rawgit.com/moismailzai/socioscapes/master/socioscapes-min.js"></script>
 
**NodeJS**: [npm](https://www.npmjs.com/package/socioscapes)

    npm install socioscapes
 
**Bower**: [bower](http://bower.io/search/?q=socioscapes)

    bower install socioscapes
   
   
   
### What Does It Do?
***

For developers, socioscapes provides a semantic API that is designed to standardize how you interact with an extendable set of current and future open-source tools. For the end user, socioscapes has been designed to allow simple and easy file management: you should be able to save, edit, and share your work in an intuitive, non-proprietary way. Rather than reinvent the wheel, socioscape '.scape' files are simply containers that transparently organize the data you choose to work with. A .scape file is just a JSON object with the following structure:
  
![Image of the Soscioscapes Schema]
(https://raw.githubusercontent.com/moismailzai/socioscapes/master/schema-small.png)
This diagram is a visual representation of the core socioscapes schema. Currently, socioscapes defines the following classes [scape], [state], [layer], and [view]. Each instance of these classes includes a {meta} member whose purpose is to store metadata about the unique aspects of that instance. Since the root socioscapes object is itself just an instance of the [scape] class, it also has a {meta} member. The [states] array in the root object stores instances of the [state] class, which are conceptualized as the complete contents of the DOM at a particular moment. A particular {state} instance stores all of the data and configuration that are necessary to reproduce a corresponding screen state. Each such state can include multiple maps, charts, graphs, and other visualizations. For instance, suppose a user wishes to create a thematic map of their neighbourhood and to display the ways in which income is distributed across their city. Besides a map, they may also wish to include charts, graphs, and tables. Socioscapes approaches this task by differentiating between [layer] elements, which are static collections of raw numerical and geometric data, and [view] elements, which are conceptualized unique DOM-rendered instances of these layers. Views are always directly incorporated into the DOM whereas layers never simply datastores. A chart contained within a DOM \<div\> element constitutes a socioscapes view but the same data from the same layer could also be used in my different maps, charts, graphs, and tables. Since this is a common GIS scenario, both the socioscapes API and the datastructure has been organized to help facilitate such tasks. This schema is not set in stone and users can use the socioscapes.fn.extend function to edit, remove, and add classes as they see fit. To get a feel for the API, jump into the code or read through the following examples:
   
   
   
#### Usage: 
*** 

**Note:** While the servers and datasets in these examples are functioning, due to XSS security it is not possible to test these from an outside domain. However, *app.socioscapes.com* hosts a publically exposed copy of the socioscapes API which can be accessed via the developer's console and which has been configured to access the example servers. Don't forget to change the Big Query client id to your Google client id, found in the Google Developer Console).  

// some setup first...
// create a wfs url

    var wfs = 'http://app.socioscapes.com:8080/geoserver/socioscapes/ows?
               &service=WFS&request=GetFeature&typeName=socioscapes:2011-canada-census-da
               &outputFormat=json&cql_filter=ccsuid=1218001'

// create a google big query request 
 
    var bq = {  
           id: '2011_census_of_canada',  
           clientId: '1234567890.apps.googleusercontent.com', 
           projectId: '1234567890',
           queryString: 'SELECT Geo_Code, Total FROM 
                        [2011_census_of_canada.british_columbia_da] WHERE 
                        (Characteristic CONTAINS 'Population in 2011' AND 
                        Total IS NOT NULL) GROUP BY Geo_Code, Total, LIMIT 10;'
    };  

// create a new scape object to store our work in. let's call it 'vancity'*  

    socioscapes().new('vancity')

// all scapes are created with a default state ('state0'), and all states are created with a default layer ('layer0') and view ('view0'). since these are the defaults, they are loaded if you call the .state(), .layer(), and .view() methods without an argument. 

    socioscapes('vancity').state()

// check the newly created 'vancity' object to get a sense of the socioscapes datastructure 

    vancity  

// creating a new instance of any socioscapes class is simple

    socioscapes('vancity').state().new('census2011')

// now let's download some geometry to work with  

    socioscapes('vancity').state('census2011').layer().geom('wfs', wfs)

// too verbose? you can create navigation shortcuts...  

    l = socioscapes('vancity').state('census2011').layer()
    l.data('bq', bq);

// of course, you can chain all of the above:

    socioscapes().new('vancity').state().new('census2011').layer().data('bq', config.bq).geom('wfs', config.wfs)
   
   
   
#### Asynchronous:
***

The socioscapes Dispatcher class facilitate asynchronous method chaining through the use of instanced queues. Socioscapes associates every 'scape' object with a dispatcher instance. The dispatcher allows for API calls to be queued and synchronously resolved. Calls to the dispatcher can provide a configuration object and a callback. The configuration object must include the function to be called and an array of arguments to be sent to the function, but can also include an optional 'this' context and preferred return value once the call has been resolved. Inside the dispatcher, the function to be queued is evaluated for the number of arguments it expects. The dispatcher then appends null values to the arguments array if the arguments supplied are less than the arguments expected, and appends a callback. When the queue is initiated, a for loop is used to work through the queue and a status boolean prevents further iterations until the current one is processed. While the queue is being processed, new queue items are pushed to the queue array. Socioscapes methods start by evaluating the final argument of the 'arguments' array to test if a dispatcher callback was provided. If one was, the method's results are sent to the callback, before being returned as usual. The callback triggers a new iteration of the queue loop.
   
   
   
#### Extendability:
***

The socioscapes structure is inspired by the jQuery team's module management approach. To extend socioscapes, you simply need to call 'socioscapes.extend' and provide an array of entries that are composed of an object with '.path' (a string), and '.extension' (a value) members. The '.path' tells the API where in the socioscapes prototype to store your extension. The path for most modules will be the root path, which is socioscapes.fn. Your module should be appropriately named to ensure that it is exposed to existing elements. For instance, if you have created a new module that retrieves data from a MySql server, you'd want to use the 'fetch' prefix (eg. 'fetchMysql'). This convention not only allows for a clean ecosystem, but under the hood socioscapes also exposed modules contextually based on prefixes.
  
// example: socioscapes.fn.init the following snippet is from src/core/init.js. it creates a new member "init" at socioscapes.fn.init and populates its value with a function. 
  
    socioscapes.fn.extend([
       {
           path: 'init', extension: function init(name) { 
           var myScape;
           if (name) {
               myScape = fetchScapeObject(name);
           } else {
               myScape = newScapeObject(name || 'scape0', null, 'scape');
           }
           this.s = newScapeMenu(myScape);
           return this.s;
       }}
    ]);
       
*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*
