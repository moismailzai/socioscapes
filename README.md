# Socioscapes.js  -  a Javascript GIS library
***

### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.

>**Source code**:     [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")

>**Reference implementation**:  [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
  
>**License**:         [MIT license](http://opensource.org/licenses/MIT "MIT license") *(free as in beer & speech)*
   
>**Copyright**:       &copy; 2015 Mo Ismailzai

### Examples

#### config:
// *for easier reference & less typing*

**var s = socioscapes;**
 
// *create a config object*

**var geom = {};** 

// *create a config object*

**var data = {};**

// *example url*

**wfsgeom.url = 'http://www.mywfsserver.com&cql_filter=cmaname=%27Vancouver%27';** 

// *example id property. this should match the data id property*

**wfsgeom.id = 'dauid';** 

// *example id property. this should match the geom id property*

**bqdata.id = 'dauid';**

// *example bq clientid*

**bqdata.clientId = 'exampleid.apps.googleusercontent.com';**

// *example bq project id*

**bqdata.projectId = 'exampleid';** 

// *example bq query*

**bqdata.queryString = 'SELECT Topic, Characteristic FROM [2011_census_of_canada.ontario_da] GROUP BY Topic, Characteristic;';**


#### usage:  
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


*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*