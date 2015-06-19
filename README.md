# Socioscapes.js  -  a Javascript GIS library
***

### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.

>**Source code**:     [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")

>**Reference implementation**:  [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
  
>**License**:         [MIT license](http://opensource.org/licenses/MIT "MIT license") *(free as in beer & speech)*
   
>**Copyright**:       &copy; 2015 Mo Ismailzai

### Example
>
##### config:
........... **var s = socioscapes;** // *for easier reference & less typing*
........... **var geom = {};** // *create a config object*
........... **var data = {};** // *create a config object*
........... **wfsgeom.url = 'http://www.mywfsserver.com&cql_filter=cmaname=%27Vancouver%27';** // *example url*
........... **wfsgeom.id = 'dauid';** // *example id property. this should match the data id property*
........... **bqdata.id = 'dauid';** // *example id property. this should match the geom id property*
........... **bqdata.clientId = 'exampleid.apps.googleusercontent.com';** // *example bq clientid*
........... **bqdata.projectId = 'exampleid';** // *example bq project id*
........... **bqdata.queryString = 'SELECT Topic, Characteristic FROM [2011_census_of_canada.ontario_da] GROUP BY Topic, Characteristic;';** // *example bq query*

>
##### usage:
........... **van = s.newLayer();** // *create a new socioscapes layer object called 'van'*
........... **van.geom('fetchWfs', wfsgeom);** // *fetch some wfs geom for van*
........... **van.data('fetchGoogleBq', bqdata);** // *fetch some bq data for van*
........... **van.breaks(5);** // *set 5 breaks for van's visualization*
........... **van.classification('getJenks');** // *calculate jenks classifications for van*
........... **van.colourscale('YlOrRd');** // *set the Yellow-Orange-Red colorbrew colour scale for van's visualization*


*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*