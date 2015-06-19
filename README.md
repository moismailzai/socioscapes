# Socioscapes.js  -  a Javascript GIS library

### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.

>**Source code**:     [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")

>**Reference implementation**:  [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
  
>**License**:         [MIT license](http://opensource.org/licenses/MIT "MIT license") *(free as in beer & speech)*
   
>**Copyright**:       &copy; 2015 Mo Ismailzai


### Examples
***

#### Config:
// *for easier reference & less typing*

**var s = socioscapes;**
 
// *create some config objects*

**var geom = {};** 

**var data = {};**

**wfsgeom.url = 'http://www.example.com&cql_filter=example;** 

**wfsgeom.id = 'dauid';** 

**bqdata.id = 'dauid';**

**bqdata.clientId = 'example.apps.googleusercontent.com';**

**bqdata.projectId = 'example';** 

**bqdata.queryString = 'SELECT Topic, Characteristic FROM [table] GROUP BY Topic, Characteristic;';**
***

#### Usage:  
// *create a new socioscapes layer object called 'van'*

**van = s.newLayer();**

// *fetch some wfs geom for van*

**van.geom('fetchWfs', wfsgeom);**

// *fetch some bq data for van*

**van.data('fetchGoogleBq', bqdata);**

// *set 5 breaks for van's visualization*

**van.breaks(5);**

// *calculate jenks classifications for van*

**van.classification('getJenks');**

// *set the Yellow-Orange-Red colorbrew colour scale for van's visualization*

**van.colourscale('YlOrRd');**


***

*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*