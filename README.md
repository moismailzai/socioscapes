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

### What Does It Do?
***

**For developers, socioscapes provides a semantic API that is designed to standardize how you interact with an 
extendable set of current and future open-source tools. For the end user, socioscapes has been designed to allow simple 
and easy file management: you should be able to save, edit, and share your work in an intuitive, non-proprietary way. 
Rather than reinvent the wheel, socioscape '.scape' files are simply containers that transparently organize the data you 
choose to work with. A .scape file is just a JSON object with the following structure:**
>**&nbsp;[ S C A P E ]**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**[ . s t a t e s ]**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;--&nbsp;&nbsp;[ .state1 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ .state2 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ etc ]**    
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ . l a y e r s ]**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;--&nbsp;&nbsp;[ .layer1 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ .layer2 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ etc ]**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ . v i e w s ]**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|**  
>**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;--&nbsp;&nbsp;[ .view1 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ .view2 ]&nbsp;&nbsp;--&nbsp;&nbsp;[ etc ]**  

**Each level also includes a .meta member. For instance, the root of a .scape file has two members, .meta, which stores 
metadata about the file itself, and .states, which stores an arbitrary number of screen states. A screen state is 
conceptualized as the complete contents of the DOM at a specific moment. A given .state member includes all of the data 
and configuration necessary to reproduce a corresponding screen state. A single screen state can include multiple maps, 
charts, graphs, and other visualizations. For instance, suppose a user wishes to create a thematic map of their 
neighbourhood and to display the way in which income is distributed across their city. Besides a map, they may also wish 
to include other materials, such as charts, graphs, and tables. Socioscapes distinguishes between 'layers', which are 
conceptualized as static groupings of raw numerical and geometric data, and 'views' which are conceptualized as 
unique DOM-rendered instances of such layers. Views are always directly incorporated into the DOM, layers never are. 
For example a chart contained within a DOM \<div\> element constitutes a socioscapes view, and the data in a layer can be 
used to produce multiple such views in the form of maps, charts, graphs, and tables. Since this is a common GIS 
scenario, both the socioscapes API and .scape files have been organized to facilitate this workflow. The .layer member 
of a .scape object can store an arbitrary number of unique views, and since views may themselves be broken up into sub 
levels (for instance a mapping API may allow you to stack multiple layers on a map that will ultimately reside in a 
single DIV), a .view member may itself recurse several levels. To really get a sense of all this, consider the following 
examples:**

#### Config:
***

>// *create a wfs config object*  
>**var wfsGeom = {**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **url:  'http://www.example.com&cql_filter=myFilter',**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **id: 'exampleGeomId'**  
>**};**  

>// *create a google big query config object*  
>**var bqData = {**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **id: 'exampleDataId',**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **clientId: '123456789.apps.googleusercontent.com',**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **projectId: '123456789',**  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **queryString: 'SELECT Topic, Characteristic FROM [table] GROUP BY Topic, Characteristic;'**  
>**};**  

#### Usage:
*** 

>// *create a new scape for this session. let's call it 'vancity'*  
>**socioscapes('vancity').newScape()**

>// *socioscapes is smart, the following commands all create a new scape called 'vancity'*  
>**socioscapes().newScape('vancity')**  
>**socioscapes('vancity').newScape('vancity')**  
>**socioscapes('anotherScape').newScape('vancity')**  

>// *now let's download some geometry and put it in a new layer, we'll fetch it from a wfs server. since all scapes are created with a default state ('state1'), and all states are created with a default layer ('layer1'), we can just reference these immediately after we create a new scape.*
>**socioscapes('vancity').states('state1').layers('layer1').geom('fetchWfs', wfsGeom)**

>// *hmm that's pretty verbose, but don't worry, socioscapes is smart... if you don't explicitly reference something, it will assume the default value. the following commands all fetch the same geometry and store it in the default layer*  
>**socioscapes('vancity').states('state1').geom('fetchWfs', wfsGeom)**  
>**socioscapes('vancity').layers('layer1').geom('fetchWfs', wfsGeom)**  
>**socioscapes('vancity').geom('fetchWfs', wfsGeom)**  

>// *still too verbose? let's shorten it even more and fetch some data from a Google Big Query table*
>**v1 = socioscapes('vancity').states('state1').layers('layer1')**  
>**v1.data('fetchGoogleBq', bqData);**  

>// *now let's configure our layer to use 5 groups in any subsequent visualizations*  
>**v1.breaks(5);**

>// *now let's configure vancity to use jenks classifications for any subsequent visualizations*  
>**v1.classification('getJenks');**

>// *now let's configure vancity to use the Yellow-Orange-Red colorbrew colour scale for any subsequent visualizations*  
>**v1.colourscale('YlOrRd');**

>// *let's check the status of the vancity layer's various members*  
>**v1.status();**

***

*This software was written as partial fulfilment of the Masters Research Paper, a degree requirement for the Masters of Arts in Sociology at the University of Toronto.*