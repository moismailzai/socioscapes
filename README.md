# Socioscapes.js -  a Javascript GIS library

### Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and sandboxed environment.

### Details
>**Current version**:     0.1.4

>**Source code**:     [http://github.com/moismailzai/socioscapes](http://github.com/moismailzai/socioscapes "github.com/moismailzai/socioscapes")
 
>**Reference implementation**:  [http://app.socioscapes.com](http://app.socioscapes.com "app.socioscapes.com")
 
>**License**:         [MIT license](http://opensource.org/licenses/MIT "MIT license") (free as in beer & speech)
 
>**Copyright**:       &copy; 2015 Misaqe Ismailzai

### Installation
> **Standalone**: \<script src="path/to/socioscapes.js"\>\</script\>
 
> **NodeJS**: [npm install socioscapes](https://www.npmjs.com/package/socioscapes)
 
> **Bower**: [bower install socioscapes](http://bower.io/search/?q=socioscapes)

### Examples

#### Config:
***
// *for easier reference & less typing*

**var s = socioscapes;**
 
// *create some config objects*

**var wfsgeom = {};** 

**var bqdata = {};**

**wfsgeom.url = 'http://www.example.com&cql_filter=example;** 

**wfsgeom.id = 'example';** 

**bqdata.id = 'example';**

**bqdata.clientId = '123456789.apps.googleusercontent.com';**

**bqdata.projectId = '123456789';** 

**bqdata.queryString = 'SELECT Topic, Characteristic FROM [table] GROUP BY Topic, Characteristic;';**

#### Usage:
***
// *create a new socioscapes layer object called 'vancity'*

**vancity = s.newLayer();**

// *fetch some wfs geom for vancity*

**vancity.geom('fetchWfs', wfsgeom);**

// *fetch some bq data for vancity*

**vancity.data('fetchGoogleBq', bqdata);**

// *return vancity's data values*

**vancity.data();**

// *configure vancity to use 5 groups in any subsequent visualizations*

**vancity.breaks(5);**

// *configure vancity to use jenks classifications for any subsequent visualizations*

**vancity.classification('getJenks');**

// *configure vancity to use the Yellow-Orange-Red colorbrew colour scale for any subsequent visualizations*

**vancity.colourscale('YlOrRd');**

// *check the status of the vancity layer's various members*

**vancity.status();**

***

*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*