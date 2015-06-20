(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var
	util = require('util'),
	color_map = [
		'black',
		'red',
		'green',
		'yellow',
		'blue',
		'magenta',
		'cyan',
		'white'
	],
	color_weights = [
		[0, 0, 0],
		[255, 0, 0],
		[0, 255, 0],
		[255, 255, 0],
		[0, 0, 255],
		[255, 0, 255],
		[0, 255, 255],
		[255, 255, 255]
	],
	reset = '\x1b[30m';

function hex_to_rgb ( hex ) {
	var
		base_16;

	if ( hex.indexOf('#') === 0 ) {
		hex = hex.slice(1);
	}
	base_16 = parseInt(hex, 16);
	if ( isNaN(base_16) ) {
		base_16 = 0;
	}
	return [
		( base_16 >> 16 ) & 255,
		( base_16 >> 8 ) & 255,
		base_16 & 255
	];
}

function get_fitness ( source, target ) {
	return Math.abs(source - target);
}

function get_closest_color ( red, green, blue ) {
	var
		current_color,
		best_color = null,
		current_fit,
		best_fit = 765,
		index = color_map.length;

	while ( index -- ) {
		current_color = color_weights [index];
		current_fit = get_fitness(red, current_color [0]) + get_fitness(green, current_color [1]) + get_fitness(blue, current_color [2]);
		if ( current_fit <= best_fit ) {
			best_fit = current_fit;
			best_color = color_map [index];
		}
	}
	return best_color;
}

function generate ( color ) {
	var
		resolved_color,
		index;

	function colorize ( text ) {
		if ( typeof text !== 'string' ) {
			text = util.format(text);
		}
		return resolved_color + text + reset;
	}

	index = color_map.indexOf(color);
	if ( index !== -1 ) {
		resolved_color = '\x1b[3' + index + 'm';
	}
	else {
		resolved_color = reset;
	}

	return colorize;
}

function create_color ( color, green, blue ) {
	var
		index,
		resolved_color;

	if ( typeof color === 'string' ) {
		if ( color [0] === '#' ) {
			resolved_color = get_closest_color.apply(null, hex_to_rgb(color));
		}
	}
	else if ( typeof color === 'number' ) {
		resolved_color = get_closest_color(color, green, blue);
	}
	else {
		resolved_color = reset;
	}
	
	return generate(resolved_color);
}

color_map.map(function ( item ) {
	create_color [item] = generate(item);
});

module.exports = create_color;

},{"util":16}],2:[function(require,module,exports){
var isInt=function(e){return"number"===typeof e&&parseFloat(e)==parseInt(e,10)&&!isNaN(e)},_t=function(e){return e},inArray=function(e,a){for(var b=0;b<a.length;b++)if(a[b]==e)return!0;return!1},geostats=function(e){this.objectId="";this.legendSeparator=this.separator=" - ";this.method="";this.precision=0;this.precisionflag="auto";this.roundlength=2;this.debug=this.is_uniqueValues=!1;this.bounds=[];this.ranges=[];this.inner_ranges=null;this.colors=[];this.counter=[];this.stat_cov=this.stat_stddev=
this.stat_variance=this.stat_pop=this.stat_min=this.stat_max=this.stat_sum=this.stat_median=this.stat_mean=this.stat_sorted=null;this.log=function(a){!0==this.debug&&console.log(this.objectID+"(object id) :: "+a)};this.setBounds=function(a){this.log("Setting bounds ("+a.length+") : "+a.join());this.bounds=[];this.bounds=a};this.setSerie=function(a){this.log("Setting serie ("+a.length+") : "+a.join());this.serie=[];this.serie=a;this.setPrecision()};this.setColors=function(a){this.log("Setting color ramp ("+
a.length+") : "+a.join());this.colors=a};this.doCount=function(){if(!this._nodata()){var a=this.sorted();this.counter=[];for(i=0;i<this.bounds.length-1;i++)this.counter[i]=0;for(j=0;j<a.length;j++){var b=this.getClass(a[j]);this.counter[b]++}}};this.setPrecision=function(a){"undefined"!==typeof a&&(this.precisionflag="manual",this.precision=a);if("auto"==this.precisionflag)for(a=0;a<this.serie.length;a++){var b=isNaN(this.serie[a]+"")||-1==(this.serie[a]+"").toString().indexOf(".")?0:(this.serie[a]+
"").split(".")[1].length;b>this.precision&&(this.precision=b)}this.log("Calling setPrecision(). Mode : "+this.precisionflag+" - Decimals : "+this.precision);this.serie=this.decimalFormat(this.serie)};this.decimalFormat=function(a){for(var b=[],c=0;c<a.length;c++)isNaN(a[c]+"")?b[c]=a[c]:b[c]=parseFloat(a[c]).toFixed(this.precision);return b};this.setRanges=function(){this.ranges=[];for(i=0;i<this.bounds.length-1;i++)this.ranges[i]=this.bounds[i]+this.separator+this.bounds[i+1]};this.min=function(){if(!this._nodata())return this.stat_min=
Math.min.apply(null,this.serie)};this.max=function(){return this.stat_max=Math.max.apply(null,this.serie)};this.sum=function(){if(!this._nodata()){if(null==this.stat_sum)for(i=this.stat_sum=0;i<this.pop();i++)this.stat_sum+=parseFloat(this.serie[i]);return this.stat_sum}};this.pop=function(){if(!this._nodata())return null==this.stat_pop&&(this.stat_pop=this.serie.length),this.stat_pop};this.mean=function(){if(!this._nodata())return null==this.stat_mean&&(this.stat_mean=parseFloat(this.sum()/this.pop())),
this.stat_mean};this.median=function(){if(!this._nodata()){if(null==this.stat_median){this.stat_median=0;var a=this.sorted();this.stat_median=a.length%2?parseFloat(a[Math.ceil(a.length/2)-1]):(parseFloat(a[a.length/2-1])+parseFloat(a[a.length/2]))/2}return this.stat_median}};this.variance=function(){round="undefined"===typeof round?!0:!1;if(!this._nodata()){if(null==this.stat_variance){for(var a=0,b=0;b<this.pop();b++)a+=Math.pow(this.serie[b]-this.mean(),2);this.stat_variance=a/this.pop();!0==round&&
(this.stat_variance=Math.round(this.stat_variance*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))}return this.stat_variance}};this.stddev=function(a){a="undefined"===typeof a?!0:!1;if(!this._nodata())return null==this.stat_stddev&&(this.stat_stddev=Math.sqrt(this.variance()),!0==a&&(this.stat_stddev=Math.round(this.stat_stddev*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))),this.stat_stddev};this.cov=function(a){a="undefined"===typeof a?!0:!1;if(!this._nodata())return null==
this.stat_cov&&(this.stat_cov=this.stddev()/this.mean(),!0==a&&(this.stat_cov=Math.round(this.stat_cov*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))),this.stat_cov};this._nodata=function(){return 0==this.serie.length?(alert("Error. You should first enter a serie!"),1):0};this.sorted=function(){null==this.stat_sorted&&(this.stat_sorted=!1==this.is_uniqueValues?this.serie.sort(function(a,b){return a-b}):this.serie.sort(function(a,b){var c=a.toString().toLowerCase(),d=b.toString().toLowerCase();
return c<d?-1:c>d?1:0}));return this.stat_sorted};this.info=function(){if(!this._nodata()){var a;a=""+(_t("Population")+" : "+this.pop()+" - ["+_t("Min")+" : "+this.min()+" | "+_t("Max")+" : "+this.max()+"]\n");a+=_t("Mean")+" : "+this.mean()+" - "+_t("Median")+" : "+this.median()+"\n";return a+=_t("Variance")+" : "+this.variance()+" - "+_t("Standard deviation")+" : "+this.stddev()+" - "+_t("Coefficient of variation")+" : "+this.cov()+"\n"}};this.getEqInterval=function(a){if(!this._nodata()){this.method=
_t("eq. intervals")+" ("+a+" "+_t("classes")+")";var b=this.max(),c=[],d=this.min(),g=(b-this.min())/a;for(i=0;i<=a;i++)c[i]=d,d+=g;c[a]=b;this.setBounds(c);this.setRanges();return this.bounds}};this.getQuantile=function(a){if(!this._nodata()){this.method=_t("quantile")+" ("+a+" "+_t("classes")+")";var b=[],c=this.sorted(),d=Math.round(this.pop()/a),g=d,f=0;b[0]=c[0];for(f=1;f<a;f++)b[f]=c[g],g+=d;b.push(c[c.length-1]);this.setBounds(b);this.setRanges();return this.bounds}};this.getStdDeviation=function(a){if(!this._nodata()){this.method=
_t("std deviation")+" ("+a+" "+_t("classes")+")";this.max();this.min();var b=[];if(1==a%2){var c=Math.floor(a/2),d=c+1;b[c]=this.mean()-this.stddev()/2;b[d]=this.mean()+this.stddev()/2;i=c-1}else d=a/2,b[d]=this.mean(),i=d-1;for(;0<i;i--)c=b[i+1]-this.stddev(),b[i]=c;for(i=d+1;i<a;i++)c=b[i-1]+this.stddev(),b[i]=c;b[0]=this.min();b[a]=this.max();this.setBounds(b);this.setRanges();return this.bounds}};this.getArithmeticProgression=function(a){if(!this._nodata()){this.method=_t("arithmetic progression")+
" ("+a+" "+_t("classes")+")";var b=0;for(i=1;i<=a;i++)b+=i;var c=[],d=this.min(),b=(this.max()-d)/b;for(i=0;i<=a;i++)c[i]=0==i?d:c[i-1]+i*b;this.setBounds(c);this.setRanges();return this.bounds}};this.getJenks=function(a){if(!this._nodata()){this.method=_t("Jenks")+" ("+a+" "+_t("classes")+")";dataList=this.sorted();for(var b=[],c=0,d=dataList.length+1;c<d;c++){for(var g=[],f=0,e=a+1;f<e;f++)g.push(0);b.push(g)}c=[];d=0;for(g=dataList.length+1;d<g;d++){for(var f=[],e=0,l=a+1;e<l;e++)f.push(0);c.push(f)}d=
1;for(g=a+1;d<g;d++){b[0][d]=1;c[0][d]=0;for(var h=1,f=dataList.length+1;h<f;h++)c[h][d]=Infinity;h=0}d=2;for(g=dataList.length+1;d<g;d++){for(var l=e=f=0,m=1,q=d+1;m<q;m++){var n=d-m+1,h=parseFloat(dataList[n-1]),e=e+h*h,f=f+h,l=l+1,h=e-f*f/l,p=n-1;if(0!=p)for(var k=2,r=a+1;k<r;k++)c[d][k]>=h+c[p][k-1]&&(b[d][k]=n,c[d][k]=h+c[p][k-1])}b[d][1]=1;c[d][1]=h}h=dataList.length;c=[];d=0;for(g=a+1;d<g;d++)c.push(0);c[a]=parseFloat(dataList[dataList.length-1]);for(c[0]=parseFloat(dataList[0]);2<=a;)d=parseInt(b[h][a]-
2),c[a-1]=dataList[d],h=parseInt(b[h][a]-1),a-=1;c[0]==c[1]&&(c[0]=0);this.setBounds(c);this.setRanges();return this.bounds}};this.getUniqueValues=function(){if(!this._nodata()){this.method=_t("unique values");this.is_uniqueValues=!0;var a=this.sorted(),b=[];for(i=0;i<this.pop();i++)inArray(a[i],b)||b.push(a[i]);return this.bounds=b}};this.getClass=function(a){for(i=0;i<this.bounds.length;i++)if(!0==this.is_uniqueValues){if(a==this.bounds[i])return i}else if(parseFloat(a)<=this.bounds[i+1])return i;
return _t("Unable to get value's class.")};this.getRanges=function(){return this.ranges};this.getRangeNum=function(a){var b,c;for(c=0;c<this.ranges.length;c++)if(b=this.ranges[c].split(/ - /),a<=parseFloat(b[1]))return c};this.getInnerRanges=function(){if(null!=this.inner_ranges)return this.inner_ranges;var a=[],b=this.sorted(),c=1;for(i=0;i<b.length;i++){if(0==i)var d=b[i];parseFloat(b[i])>parseFloat(this.bounds[c])&&(a[c-1]=""+d+this.separator+b[i-1],d=b[i],c++);if(c==this.bounds.length-1)return a[c-
1]=""+d+this.separator+b[b.length-1],this.inner_ranges=a}};this.getSortedlist=function(){return this.sorted().join(", ")};this.getHtmlLegend=function(a,b,c,d,e){var f="";this.doCount();ccolors=null!=a?a:this.colors;lg=null!=b?b:"Legend";getcounter=null!=c?!0:!1;fn=null!=d?d:function(a){return a};null==e&&(e="default");if("discontinuous"==e&&(this.getInnerRanges(),-1!==this.counter.indexOf(0))){alert(_t("Geostats cannot apply 'discontinuous' mode to the getHtmlLegend() method because some classes are not populated.\nPlease switch to 'default' or 'distinct' modes. Exit!"));
return}if(ccolors.length<this.ranges.length)alert(_t("The number of colors should fit the number of ranges. Exit!"));else{a='<div class="geostats-legend"><div class="geostats-legend-title">'+_t(lg)+"</div>";if(!1==this.is_uniqueValues)for(i=0;i<this.ranges.length;i++)!0===getcounter&&(f=' <span class="geostats-legend-counter">('+this.counter[i]+")</span>"),c=this.ranges[i].split(this.separator),b=parseFloat(c[0]).toFixed(this.precision),c=parseFloat(c[1]).toFixed(this.precision),"distinct"==e&&0!=
i&&(isInt(b)?b=parseInt(b)+1:(b=parseFloat(b)+1/Math.pow(10,this.precision),b=parseFloat(b).toFixed(this.precision))),"discontinuous"==e&&(c=this.inner_ranges[i].split(this.separator),console.log("Ranges : "+this.inner_ranges[i]),b=parseFloat(c[0]).toFixed(this.precision),c=parseFloat(c[1]).toFixed(this.precision)),b=fn(b)+this.legendSeparator+fn(c),a+='<div><div class="geostats-legend-block" style="background-color:'+ccolors[i]+'"></div> '+b+f+"</div>";else for(i=0;i<this.bounds.length;i++)!0===
getcounter&&(f=' <span class="geostats-legend-counter">('+this.counter[i]+")</span>"),b=fn(this.bounds[i]),a+='<div><div class="geostats-legend-block" style="background-color:'+ccolors[i]+'"></div> '+b+f+"</div>";return a+"</div>"}};this.objectID=(new Date).getUTCMilliseconds();this.log("Creating new geostats object");"undefined"!==typeof e&&0<e.length?(this.serie=e,this.setPrecision(),this.log("Setting serie ("+e.length+") : "+e.join())):this.serie=[]};

},{}],3:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var chroma = require('chroma'),
    Geostats = require('geostats'),
    myPolyfills = require('../libs/myPolyfills.js');
myPolyfills();
/**
 * This constructor method returns a new object of class {@linkcode MyLayer}.
 *
 * Requires the modules {@link https://github.com/gka/chroma.js}, {@link https://github.com/simogeo/geostats}, and
 * {@linkcode module:myPolyfills}.
 *
 * @method newLayer
 * @memberof! socioscapes
 * @return {Object} MyLayer
 */
module.exports = function newLayer() {
    /**
     * Each MyLayer consists of the two store members {@linkcode MyLayer.data} and {@linkcode MyLayer.geom}, and the
     * configuration members {@linkcode MyLayer.breaks}, {@linkcode MyLayer.classes}, {@linkcode MyLayer.classification},
     * {@linkcode MyLayer.colourscale}, {@linkcode MyLayer.domain}, {@linkcode MyLayer.geostats}, and
     * {@linkcode MyLayer.status}.
     *
     * @namespace MyLayer
     */
    var MyLayer = function() {
        var _myBreaks = 5,
            _myClasses,
            _myClassification = 'getJenks',
            _myColourscaleName = "YlOrRd",
            _myColourScaleFunction,
            _myData,
            _myDomain,
            _myGeom,
            _myGeostats,
            _myViews = {},
            _myLayerStatus = {},
            that = this;
        Object.defineProperty(_myLayerStatus, 'breaks', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'classification', {
            value: true,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'colourscale', {
            value: true,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'data', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'domain', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'geom', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'geostats', {
            value: false,
            configurable: true
        });
        Object.defineProperty(_myLayerStatus, 'readyGis', {
            value: false,
            configurable: true
        });

        /**
         * This method returns a boolean status for each configurable member of {@linkcode MyLayer}.
         *
         * @example
         * // returns the status of the 'data' member of MyLayer.
         * MyLayer.status('data')
         *
         * @example
         * // returns the status of all members of MyLayer.
         * MyLayer.status()
         *
         * @example
         * // sets the status of 'data' to true.
         * MyLayer.status('data', true)
         *
         * @method status
         * @memberof! MyLayer
         */
        Object.defineProperty(this, 'status', {
            value: function(name, state) {
                if (!name) {
                    return _myLayerStatus
                }
                if (typeof _myLayerStatus[name] === 'boolean' && !state) {
                    return _myLayerStatus[name]
                }
                if (typeof _myLayerStatus[name] === 'boolean' && typeof state === 'boolean') {
                    delete _myLayerStatus[name];
                    Object.defineProperty(_myLayerStatus, name, {
                        value: state,
                        configurable: true
                    });

                    if (_myLayerStatus.breaks &&
                        _myLayerStatus.classification &&
                        _myLayerStatus.colourscale &&
                        _myLayerStatus.data &&
                        _myLayerStatus.geom) {
                        delete _myLayerStatus.readyGis;
                        Object.defineProperty(_myLayerStatus, 'readyGis', {
                            value: true,
                            configurable: true
                        });
                        //TODO an api-wide event firing strategy so status events like this can trigger renders in the dom
                    }
                }
            }
        });
        /**
         * This method sets the data store of the the associated {@linkcode MyLayer}. If the fetch is succesful,
         * MyLayer.status('data') and MyLayer.status('geostats') will both return true. If no parameters are provided,
         * the method returns the currently stored data values, if any exist.The method can take two parameters, the
         * first can be a string name for any valid socioscapes data fetcher, a function that returns a valid
         * {@linkcode socioscapes-data-object}, or a valid {@linkcode socioscapes-data-object}. The second parameter
         * should be an object that provides all necessary configuration options for the first.
         *
         * @example
         * // calls socioscapes.fetchGoogleBq and passes the 'config' object as parameter.
         * MyLayer.data('fetchGoogleBq', config)
         *
         * @example
         * // calls myFetchFunction and passes the 'config' object as parameter.
         * MyLayer.data(myFetchFunction, config)
         *
         * @example
         * // returns _myData.values
         * MyLayer.data()
         *
         * @method data
         * @memberof! MyLayer
         * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-data-object} and
         * status boolean (result, success).
         * @parameter {object} config - All arguments that the fetcher method requires.
         */
        Object.defineProperty(this, 'data', {
            value: function(fetcher, config) {
                //set the statuses for data and geostats to false so that any dom components that react to a fully
                //ready status state can do what they need to do when these objects are not ready (eg. go from a green
                // 'ready' button to a faded red 'loading' button.
                var _statusBackupData = _myLayerStatus.data,
                    _statusBackupGeostats = _myLayerStatus.geostats;
                if (!fetcher || !config) {
                    return _myData.values;
                }
                if (fetcher && config && typeof fetcher === "function" ) {
                    that.status('data', false);
                    that.status('geostats', false);
                    fetcher(config, function (result) {
                        if (typeof result.values[0] !== 'number') {
                            alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                            that.status('data', _statusBackupData);
                            that.status('data', _statusBackupGeostats);
                            return
                        }
                        _myData = result;
                        _myGeostats = new Geostats(result.values);
                        that.status('data', true);
                        that.status('geostats', true);
                    });
                } else if (fetcher && !config && typeof fetcher === "object" ) {
                    if (fetcher.url && fetcher.id && fetcher.values) {
                        if (typeof result.values[0] !== 'number') {
                            alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                            that.status('data', _statusBackupData);
                            that.status('data', _statusBackupGeostats);
                            return
                        }
                        that.status('data', false);
                        that.status('geostats', false);
                        _myData = fetcher;
                        _myGeostats = new Geostats(result.values);
                        that.status('data', true);
                        that.status('geostats', true);
                    }
                } else if (fetcher && config && typeof fetcher === "string" ) {
                    if (typeof socioscapes[fetcher] === "function") {
                        that.status('data', false);
                        that.status('geostats', false);
                        socioscapes[fetcher](config, function (result) {
                            if (typeof result.values[0] !== 'number') {
                                alert(result.values[0] + ' is not a numerical value. Please select a data column with numerical values.')
                                that.status('data', _statusBackupData);
                                that.status('data', _statusBackupGeostats);
                                return
                            }
                            _myData = result;
                            _myGeostats = new Geostats(result.values);
                            that.status('data', true);
                            that.status('geostats', true);
                        });
                    }
                } else {
                    that.status('data', _statusBackupData);
                    that.status('data', _statusBackupGeostats);
                }
            }
        });
        /**
         * This method sets the geom store of {@linkcode MyLayer}. If the fetch is successful, MyLayer.status('geom')
         * will return true. If no parameters are provided, the method returns the currently stored geom features, if
         * any exist. The method can take two parameters, the first can be a string name for any valid socioscapes data
         * fetcher, a function that returns a valid {@linkcode socioscapes-geom-object}, or a valid
         * {@linkcode socioscapes-geom-object}. The second parameter should be an object that provides all necessary
         * configuration options for the first.
         *
         * @example
         * // Calls socioscapes.fetchWfs and passes the 'config' object as parameter.
         * MyLayer.geom(s.fetchWfs, config)
         *
         * @example
         * // calls myFetchFunction and passes the 'config' object as parameter.
         * MyLayer.geom(myFetchFunction, config)
         *
         * @example
         * // returns _myGeom.features
         * MyLayer.geom()
         *
         * @method geom
         * @memberof! MyLayer
         * @parameter {function} fetcher - Any function that returns a valid {@linkcode socioscapes-geom-object} and a
         * status boolean (result, success).
         * @parameter {object} config - All arguments that the fetcher method requires.
         */
        Object.defineProperty(this, 'geom', {
            value: function(fetcher, config) {
                var _statusBackup = _myLayerStatus.geom;
                if (!fetcher || !config) {
                    return _myGeom.features;
                }
                if (fetcher && config && typeof fetcher === "function" ) {
                    that.status('geom', false);
                    fetcher(config, function (geom) {
                        _myGeom = geom;
                        that.status('geom', true);
                        that.status('geom', _statusBackup);
                    });
                } else if (fetcher && !config && typeof fetcher === "object" ) {
                    if (fetcher.url && fetcher.id && fetcher.features) {
                        that.status('geom', false);
                        _myGeom = fetcher;
                        that.status('geom', true);
                    }
                } else if (fetcher && config && typeof fetcher === "string" ) {
                    if (typeof socioscapes[fetcher] === "function") {
                        that.status('geom', false);
                        socioscapes[fetcher](config, function (geom) {
                            _myGeom = geom;
                            that.status('geom', true);
                        });
                    }
                }
            }
        });
        /**
         * This method sets the number of breaks for the data in {@linkcode MyLayer}. This setting, along with
         * {@linkcode MyLayer.classification} and {@linkcode MyLayer.colourscale} constitute the core GIS visualization
         * settings. See {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/html/comp_class.html} for general
         * information about geospatial classification and groupings.
         *
         * @example
         * // sets three breaks
         * MyLayer.breaks(3)
         *
         * @method breaks
         * @memberof! MyLayer
         * @parameter {integer} breaks - The number of groups for the layer's symbology. Typically, this is set to < = 5.
         */
        Object.defineProperty(this, 'breaks', {
            value: function(breaks) {
                if (!breaks) {
                    return _myBreaks;
                }
                if (Number.isInteger(breaks)) {
                    _myBreaks = breaks;
                    that.status('breaks', true);
                }
            }
        });
        /**
         * This method is used to set a colour scale and to calculate colours for individual data points based on that
         * scale. socioscapes includes support for all valid colourbrew colour scales {@link http://colorbrewer2.org/}.
         * This setting, along with {@linkcode MyLayer.breaks} and {@linkcode MyLayer.classifications} constitute the
         * core GIS visualization settings. See {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/47_f.html} for
         * general information about geospatial visualization.
         *
         * @example
         * // returns the hexadecimal value for '100' given the ColourBrew spectrum 'YlOrRd' and five breaks.
         * MyLayer.breaks(5)
         * MyLayer.colourscale('SET', 'YlOrRd')
         * MyLayer.colourscale('GET HEX', 100)
         *
         * @example
         * // returns the current colourscale name
         * MyLayer.colourscale()
         *
         * @method colourscale
         * @memberof! MyLayer
         * @parameter {string} action - Can be 'SET', 'GET HEX', or 'GET INDEX'.
         * @parameter {number} value - Any value that falls within the bounds of {@linkcode MyLayer.data}.
         */
        Object.defineProperty(this, 'colourscale', {
            value: function(action, value) {
                if (action === 'SET' ) {
                    that.status('colourscale', false);
                    _myColourscaleName = value;
                    that.status('colourscale', true);
                }
                if (action === 'GET HEX' && value) {
                    _myColourScaleFunction = chroma.scale(_myColourscaleName).domain(_myDomain).out('hex');
                    return _myColourScaleFunction(value);
                }
                if (action === 'GET INDEX' && value) {
                    _myColourScaleFunction = chroma.scale(_myColourscaleName).domain(_myDomain, _myBreaks).colors();
                    return _myColourScaleFunction(value);
                }
                return _myColourscaleName;
            }
        });
        /**
         * This method classifies {@linkcode MyLayer.data} based on a geostats classification function. See
         * {@link https://github.com/simogeo/geostats} for more on geostats classification functions and
         * {@link http://www.ncgia.ucsb.edu/cctp/units/unit47/47_f.html} for general data classification guidelines.
         *
         * @example
         * // set classification to Jenks
         * MyLayer.classification('getEqInterval')
         *
         * @example
         * // set classification to standard deviation and change breaks to 3
         * MyLayer.classification('getStdDeviation', 3)
         *
         * @method classification
         * @memberof! MyLayer
         * @parameter {string} classification - Any valid geostats classification function.
         * @parameter {integer} [breaks] - The number of classifications for the layer symbology. Convention suggests
         * setting this to < = 5.
         */
        Object.defineProperty(this, 'classification', {
            value: function (classification, breaks) {
                var i;
                if (!classification) {
                    return _myClassification;
                }
                if (_myData && _myGeostats[classification]) {
                    console.log('yes');
                    that.status('breaks', false);
                    that.status('classification', false);
                    that.status('domain', false);
                    if (breaks) {
                        that.breaks(breaks);
                    }
                    _myDomain = [];
                    _myClassification = {};
                    _myClassification.name = classification;
                    _myClassification.classes = _myGeostats[classification](_myBreaks);
                    for (i = 0; i < _myBreaks; i++) {
                        _myDomain.push(parseFloat(_myClasses[i]));
                    }
                    that.status('breaks', true);
                    that.status('domain', true);
                    that.status('classification', true);
                }
            }
        });
        /**
         * This method returns the data domain. The data domain stores the spread of the data and is used in many GIS
         * calculations.
         *
         * @method domain
         * @memberof! MyLayer
         */
        Object.defineProperty(this, 'domain', {
            value: function () {
                return _myDomain;
            }
        });
        /**
         * This container stores the {@linkcode MyLayer} instance's geostats object. It is calculated each time
         * {@linkcode MyLayer.data} is successfully set. See {@link https://github.com/simogeo/geostats} for more on
         * geostats
         *
         * @member geostats
         * @memberof! MyLayer
         */
        Object.defineProperty(this, 'geostats', {
            value: _myGeostats
        });
        /**
         * This method gets or sets a new view based on {@linkcode MyLayer}'s {@linkcode MyLayer.data} and
         * {@linkcode MyLayer.geom} stores. Views associated with {@linkcode MyLayer} share the same
         * {@linkcode MyLayer.data} and {@linkcode MyLayer.geom} but can each visualize the values in those stores in
         * unique and complimentary ways.
         *
         * @member views
         * @memberof! MyLayer
         */
        Object.defineProperty(this, 'views', {
            value: function (viewName, viewFunction, viewConfig) {
                if (!viewName) {
                    return _myViews;
                }
                if (viewName && !viewFunction) {
                    if (_myViews[viewName]) {
                        _myViews[viewName]();
                    } else {
                        return _myViews;
                    }
                }
                if (_myViews[viewName] && viewFunction === "DELETE") {
                    delete(_myViews[viewName]);
                    return _myViews;
                }
                Object.defineProperty(_myViews, viewName, {
                    value: viewFunction(viewConfig),
                    enumerable: true,
                    configurable: true
                });
            }
        });
    };
    if (name) {
      this[name] = new MyLayer;
    }
    return new MyLayer;
};
},{"../libs/myPolyfills.js":9,"chroma":1,"geostats":2}],4:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This function requests authorization to use a Google API, and if received, loads that API client. For more information
 * on Google APIs, see {@link http://developers.google.com/api-client-library/javascript/reference/referencedocs}.
 *
 * @function fetchGoogleAuth
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for Google APIs.
 * @param {Object} config.auth - Configuration options for the auth request (eg. .client_id, .scope, .immediate)
 * @param {Object} config.client.name - The name of the Google API client to load.
 * @param {Object} config.client.version - The version of the Google API client to load.
 * @param {Function} callback - This is an optional callback that returns the result of the client load.
 * @return this {Object}
 */
module.exports = function fetchGoogleAuth(config, callback) {
    callback = (typeof callback === 'function') ? callback : function () { };
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function (result) {
                callback(result);
            });
        }
    });
};

},{}],5:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');
/**
 * This method authorizes and fetches a BigQuery request, parses the results, and returns them to a callback.
 *
 * @function fetchGoogleBq
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Big Query fetch.
 * @param {String} config.clientId - The Google Big Query client id.
 * @param {String} config.projectId - The Google Big Query project id.
 * @param {String} config.queryString - The Google Big Query query string.
 * @param {String} config.id - The id column (the values in this column are used to match the geom id property).
 * @return {Array} data - An object with .values, .url, and .id members. This can be used to populate myLayer.data.
 */
module.exports = function fetchGoogleBq(config, callback) {
    var data = {},
        _clientId = config.clientId,
        _dataId = config.id,
        _projectId = config.projectId,
        _queryString = config.queryString,
        _request,
        _totalRows,
        _values = [],
        _gapiConfig = {
            auth: {
                "client_id": _clientId,
                'scope': ['https://www.googleapis.com/auth/bigquery'],
                'immediate': true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': _projectId,
                'timeoutMs': '30000',
                'query': _queryString
            }
        };
    callback = (typeof callback === 'function') ? callback : function () { };

    fetchGoogleAuth(_gapiConfig, function () {
        _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
        _request.execute(function (bqResult) {
            _totalRows = parseFloat(bqResult.result.totalRows);
            fetchGoogleBq_Sort(bqResult, function (sortedResult) {
                _values.push(sortedResult);
                if (_values.length === _totalRows) {
                    data.values = _values;
                    data.url = _queryString;
                    data.id = _dataId;
                    callback(data);
                }
            });
        });
    });
};
},{"./fetchGoogleAuth.js":4,"./fetchGoogleBq_Sort.js":6}],6:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This method parses and sorts the results of a Google Big Query fetch to fit the format [key: value].
 *
 * @function fetchGoogleBq_Sort
 * @memberof! socioscapes
 * @param {Object} bqResult - The results of a Google Big Query fetch.
 * @param {Function} callback - This is a mandatory callback that returns each row of the asynchronous fetch.
 */
module.exports = function fetchGoogleBq_Sort(bqResult, callback) {
    var i,
        thisRow = {};
    if (!callback) {
        return;
    }
    callback = (typeof callback === 'function') ? callback : function () { };
    bqResult.result.rows.forEach(function (row) {
        for (i = 0; i < row.f.length; i++) {
            thisRow[i] = row.f[i].v;
        }
        callback(thisRow);
    });
};
},{}],7:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require, geocode, maps*/
'use strict';
/**
 * This method executes a Google Geocoder query for 'address' and returns the results in an object.
 *
 * Make sure you obtain Google auth and load the GAPI client first.
 *
 * @function fetchGoogleGeocode
 * @memberof! socioscapes
 * @param {String} address - The address around which the map around (eg. 'Toronto, Canada').
 * @return {Object} geocode - An object with latitude and longitude coordinates.
 */
module.exports = function fetchGoogleGeocode(address) {
    var geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = results[0].geometry.location.lat();
            geocode.long = results[0].geometry.location.lng();
            return geocode;
        }
        alert('Error: Google Geocoder was unable to locate ' + address);
    });
};
},{}],8:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This method asynchronously fetches geometry from a Web Feature Service server. It expects GeoJson and returns the
 * queried url, the id parameter, and the fetched features.
 *
 * @function fetchWfs
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Web Feature Service fetch.
 * @param {String} config.url - The Web Feature Service query url.
 * @param {String} config.id - The id property (these values are matched to the values of a corresponding data column).
 * @param {Object} callback - This is a mandatory callback that returns the results of the asynchronous fetch.
 * @return {Object} geom - An object with .features, .url, and .id members. This can be used to populate myLayer.geom.
 */
module.exports = function fetchWfs(config, callback) {
    var _xobj = new XMLHttpRequest(),
        geom;
    callback = (typeof callback === 'function') ? callback : function () { };
    _xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    _xobj.open('GET', config.url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState == 4 && _xobj.status == "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = config.url;
            geom.id = config.id;
            callback(geom);
        }
    };
    _xobj.send(null);
};
},{}],9:[function(require,module,exports){
/**
 *
 * Polyfills for compatibility
 *
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
module.exports = function () {
    if (!Number.isInteger) {
        Number.isInteger = function isInteger (nVal) {
            return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
        };
    }
};
},{}],10:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, feature, event, require*/
'use strict';
var fetchGoogleGeocode = require('../fetchers/fetchGoogleGeocode.js'),
    viewGmap_Labels = require('./newViewGmap_Labels.js'),
    viewGmap_Map = require('./newViewGmap_Map.js');
/**
 * This constructor method appends a new Google Maps object of class {@linkcode MyGmapView} to {@linkcode myLayer}.
 *
 * @method newViewGmap
 * @memberof! socioscapes
 * @param {Object} config - An object with configuration options for the Google Map view.
 * @param {String} config.div - The id of an html div element that will store the map
 * @param {String} config.address - The address around which the map around (eg. 'Toronto, Canada').
 * @param {String} config.styles - An optional array of {"feature": "rule"} declarative styles for map features.
 * @param {String} config.options - An array of valid Google Maps map option.
 * @param {String} config.labelStyles - An optional array of {"feature": "rule"} declarative styles for map labels.
 * @return {Object} MyGmapView - The rendered and configured view object.
 */
module.exports = function newViewGmap(config) {
    /**
     * Each instance of this class consists of a Google Map object, {@linkcode MyLayer.MyGmapView.map}, a
     * corresponding div container, {@linkcode MyLayer.MyGmapView.div}, and an arbitrary number of Google Map
     * data layers, {@linkcode MyGmapDataLayer}.
     *
     * @namespace MyGmapView
     */
    var MyGmapView = function () {
        var _myMap,
            _myGmapDataLayer,
            _myGmapDataLayers,
            _myStyle,
            _myHoverListenerSet,
            _myHoverListenerReset,
            _myOnClickListener,
            _mySelectedFeatures,
            _mySelectionLimit,
            _mySelectionCount,
            _myFeatureId,
            _myDiv = document.getElementById(config.div),
            that = this;

        fetchGoogleGeocode(config.address, function (returnedAddress) {
            viewGmap_Map(returnedAddress, _myDiv, config.styles, config.options, function (returnedMap) {
                viewGmap_Labels(returnedMap, config.labelStyles, function (returnedLabeledMap) {
                    _myMap = returnedLabeledMap;
                    /**
                     * This container stores the Google Map data object and all related methods. To learn more about the
                     * Google Maps object, see {@link https://developers.google.com/maps/documentation/javascript/reference}.
                     *
                     * @member map
                     * @memberof! MyGmapView
                     */
                    Object.defineProperty(that, 'map', {
                        value: _myMap
                    });
                    /**
                     * This method sets or returns the DOM div object that stores the Google Map object.
                     *
                     * @example
                     * // set the google maps div to 'map-container'
                     * MyLayer.MyGmapView.div('map-container')
                     *
                     * @method div
                     * @memberof! MyGmapView
                     */
                    Object.defineProperty(that, 'div', {
                        value: function (div) {
                            if (!div) {
                                return _myDiv;
                            }
                            if (document.getElementById(div)) {
                                _myDiv = document.getElementById(div);
                                if (_myMap) {
                                //TODO add code that moves GMap to a new div and rerenders all existing layers.
                                }
                            }
                        }
                    });
                });
            });
        });

        /**
         * This constructor method appends a new Google Maps data layer ({@linkcode MyGmapDataLayer}) to
         * {@linkcode MyGmapView}. It expects three arguments: a name for the new layer, the property by which geometry
         * features should be identified, and a link to a valid GeoJSON URL. To learn more about Google Maps data layers,
         * see {@link https://developers.google.com/maps/documentation/javascript/datalayer}.
         *
         * @example
         * //fetches and loads GeoJSON features using the 'dauid' property as an identifier
         * MyGmapDataLayer('myLayerName', 'dauid', 'http://www.mygeojsonfiles.com/myfile.json')
         *
         * @method newGmapDataLayer
         * @memberof! MyGmapView
         * @return {Object} MyGmapDataLayer
         */
        Object.defineProperty(this, 'newGmapDataLayer', {
            value: function (name, id, url) {
                if (!_myGmapDataLayers) {
                    _myGmapDataLayers = {};
                }
                if (!name) {
                    return _myGmapDataLayers;
                }
                if (that[name] && id === "DELETE") {
                    delete(_myGmapDataLayers[name]);
                    delete(that[name]);
                } else if (!that[name] && id !== "DELETE") {
                    /**
                     * Each MyGmapDataLayer is made up of a Google Maps Data Layer object as well as the
                     * {@link MyGmapDataLayer.on}, {@link MyGmapDataLayer.off}, {@link MyGmapDataLayer.onHover},
                     * {@link MyGmapDataLayer.onClick}, and {@link MyGmapDataLayer.style} methods. To learn more about
                     * Google Map Data Layers, see
                     * {@link https://developers.google.com/maps/documentation/javascript/datalayer}.
                     *
                     * @namespace MyGmapDataLayer
                     */
                    _myGmapDataLayer = new google.maps.Data();
                    _myGmapDataLayer.loadGeoJson(url, {idPropertyName: id});
                    /**
                     * This method calls the Google Maps Data Layer setStyle() function to create declarative style rules
                     * for {@linkcode MyGmapDataLayer}. To learn more about styling Google Maps Data Layers, see
                     * {@linkcode https://developers.google.com/maps/documentation/javascript/datalayer}.
                     *
                     * @method style
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'style', {
                        value: function (styleFunction) {
                            if (!styleFunction) {
                                return _myStyle;
                            }
                            _myGmapDataLayer.setStyle(styleFunction);
                            _myStyle = styleFunction;
                        }
                    });
                    /**
                     * This method renders {@linkcode MyGmapDataLayer} in {@linkcode MyGmapView.div}.
                     *
                     * @example
                     * // shows MyGmapDataLayer
                     * MyGmapDataLayer.on()
                     *
                     * @method on
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'on', {
                        value: function () { _myGmapDataLayer.setMap(_myDiv); }
                    });
                    /**
                     * This method hides {@linkcode MyGmapDataLayer}.
                     *
                     * @example
                     * // hides MyGmapDataLayer
                     * MyGmapDataLayer.off()
                     *
                     * @method off
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'off', {
                        value: function () { _myGmapDataLayer.setMap(null); }
                    });
                    /**
                     * This method creates a Google Maps listener that sets the 'hover' property of a
                     * {@linkcode MyGmapDataLayer} feature to 'true' when a user hovers over it. To learn more about
                     * Google Map listeners, see {@link https://developers.google.com/maps/documentation/javascript/events}.
                     *
                     * @example
                     * // turns on the onHover listener
                     * MyGmapDataLayer.onHover()
                     *
                     * @method onHover
                     * @memberof! MyGmapDataLayer
                     * @param {Function} [callback] - This is an optional callback to send 'event.feature' to.
                     */
                    Object.defineProperty(that[name], 'onHover', {
                        value: function (callback) {
                            if (_myHoverListenerSet !== undefined) {
                                _myHoverListenerSet.remove();
                                _myHoverListenerReset.remove();
                            }
                            if (callback === "OFF") {
                                return;
                            }
                            // Set
                            _myHoverListenerSet = _myGmapDataLayer.addListener('mouseover', function (event) {
                                event.feature.setProperty('hover', true);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                            // Reset
                            _myHoverListenerReset = _myGmapDataLayer.addListener('mouseout', function (event) {
                                event.feature.setProperty('hover', false);
                                if (typeof callback === "function") {
                                    callback(event.feature);
                                }
                            });
                        }
                    });
                    /**
                     * This method creates a Google Maps listener that sets the 'selected' property of a
                     * {@linkcode MyGmapDataLayer} feature to 'true' when a user clicks it. When a geometry feature is
                     * clicked, it remains in a selected state until it is clicked again. Calling this method with an
                     * integer parameter sets a limit for the total number of simultaneously selected geometry features.
                     * To learn more about Google Map listeners, see
                     * {@link https://developers.google.com/maps/documentation/javascript/events}.
                     *
                     * @example
                     * // turns on the onClick listener
                     * MyGmapDataLayer.onClick()
                     *
                     * @example
                     * // turns off the onClick listener
                     * MyGmapDataLayer.onClick('OFF')
                     *
                     * @example
                     * // turns on the onClick listener and sets the maximum number of selected geometry features to 2
                     * MyGmapDataLayer.onClick(2)
                     *
                     * @method onClick
                     * @memberof! MyGmapDataLayer
                     * @param {Number} [limit] - This optional parameter can be used either to set a limit for the total
                     * number of simultaneously selected features, by entering an integer value, or to turn off the
                     * listener, by entering the string 'OFF'.
                     * @param {Function} [callback] - This is an optional callback to send 'event.feature' to.
                     */
                    Object.defineProperty(that[name], 'onClick', {
                        value: function (limit, callback) {
                            // Check for existing listener
                            if (_myOnClickListener !== undefined) {
                                _myOnClickListener.remove();
                                for (var _selectedFeature in _mySelectedFeatures) {
                                    if (_mySelectedFeatures.hasOwnProperty(_selectedFeature)) {
                                        _mySelectedFeatures[_selectedFeature].setProperty('selected', false);
                                        delete _mySelectedFeatures[_selectedFeature];
                                    }
                                }
                            }
                            if (limit === 'OFF') {
                                return;
                            }
                            if (limit !== undefined && Number.isInteger(limit) === true) {
                                _mySelectionLimit = limit;
                            }
                            _mySelectionCount = 0;
                            _myOnClickListener = this.addListener('click', function(event) {
                                _myFeatureId = event.feature.getProperty(id);
                                if (event.feature.getProperty('selected') === true) {
                                    event.feature.setProperty('selected', false);
                                    delete _mySelectedFeatures[_myFeatureId];
                                    if (_mySelectionLimit !== undefined && _mySelectionLimit > 0) {
                                        _mySelectionCount  = _mySelectionCount  - 1;
                                    }
                                    if (typeof callback === "function") {
                                        callback(event.feature, false);
                                    }
                                } else {
                                    if (_mySelectionLimit > _mySelectionCount ) {
                                        event.feature.setProperty('selected', true);
                                        _mySelectionCount  = _mySelectionCount  + 1;
                                        _mySelectedFeatures[_myFeatureId] = event.feature;
                                    } else if (!_mySelectionLimit){
                                        event.feature.setProperty('selected', true);
                                        _mySelectedFeatures[_myFeatureId] = event.feature;
                                    }
                                    if (typeof callback === "function") {
                                        callback(event.feature, true);
                                    }
                                }
                            });
                        }
                    });
                    /**
                     * This container stores all features that have been set to a 'selected' state by
                     * {@linkcode MyGmapDataLayer.onClick}.
                     *
                     * @member selectedFeatures
                     * @memberof! MyGmapDataLayer
                     */
                    Object.defineProperty(that[name], 'selectedFeatures', {
                        value: _mySelectedFeatures
                    });
                }
            }
        });
    };
    return new MyGmapView;
};
},{"../fetchers/fetchGoogleGeocode.js":7,"./newViewGmap_Labels.js":11,"./newViewGmap_Map.js":12}],11:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This method creates a new google.maps.OverlayView and loads it on top of the other layers; all map elements except
 * labels are hidden.
 *
 * @function viewGmap_Labels
 * @memberof! socioscapes
 * @param {Object} myMap - The map to append this OverlayView to.
 * @param {Array} [styles] - An optional array of {"feature": "rule"} declarative styles for map labels.
 * @return {Object} myMap - The rendered Google Maps object.
 */
module.exports = function viewGmap_Labels(myMap, styles) {
    var dom, LayerHack;
    styles = styles || [
        {
            "elementType": "all",
            "stylers": [
                { "visibility": "off" }
            ]
        },  {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [
                { "visibility": "on" },
                { "color": "#ffffff" },
                { "weight": 5 }
            ]
        },{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                { "visibility": "on" },
                { "color": "#000000" }
            ]
        }
    ];

    // Create a custom OverlayView class and declare rules that will ensure it appears above all other map content
    LayerHack = new google.maps.OverlayView();
    LayerHack.onAdd = function () {
        dom = this.getPanes();
        dom.mapPane.style.zIndex = 150;
    };
    LayerHack.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
    LayerHack.draw = function () { };
    LayerHack.setMap(myMap);

    // Create and set the label layer
    myMap.labels = new google.maps.StyledMapType(styles);
    myMap.overlayMapTypes.insertAt(0, myMap.labels);
    return myMap;
};
},{}],12:[function(require,module,exports){
/*jslint node: true */
/*global socioscapes, module, google, require*/
'use strict';
/**
 * This method creates a new google.maps object and assigns it to the specified div.
 *
 * @function viewGmap_Map
 * @memberof! socioscapes
 * @param {Object} geocode - An object with latitude and longitude coordinates.
 * @param {Object} geocode.lat - The latitude around which the map should be centered.
 * @param {Object} geocode.long - The longitude around which the map should be centered.
 * @param {Object} div - The html div element that will store the map ( document.getElementById('divId') ).
 * @param {Array} styles - An optional array of {"feature": "rule"} declarative styles for map features.
 * @param {Array} options - An array of valid Google Maps map option.
 * @return {Object} myMap - The rendered Google Maps object.
 */
module.exports = function (geocode, div, styles, options) {
    var myMap;
    styles = styles || [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {"color": "#444444"}
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text",
            "stylers":
                [
                    {"visibility": "on"}
                ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text",
            "stylers":
                [
                    {"visibility": "off"},
                    {"hue": "#ff0000"}
                ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers":
                [
                    {"color": "#f2f2f2"}
                ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers":
                [
                    {"visibility": "off"}
                ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers":
                [
                    {"saturation": -100},
                    {"lightness": 45}
                ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers":
                [
                    {"visibility": "simplified"}
                ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers":
                [
                    {"visibility": "on"}
                ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers":
                [
                    {"visibility": "on"}
                ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers":
                [
                    {"visibility": "off"}
                ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers":
                [
                    {"visibility": "off"}
                ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers":
                [
                    {"color": "#46bcec"},
                    {"visibility": "on"}
                ]
        },
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers":
                [
                    {"visibility": "off"}
                ]
        }
    ];
    options = options || {
        zoom: 13,
        center: new google.maps.LatLng(geocode.lat, geocode.long),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        MapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE], style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        scaleControl: true,
        disableDoubleClickZoom: true,
        streetViewControl: true,
        overviewMapControl: true,
        styles: styles
    };
    myMap = new google.maps.Map(div, options);
    myMap.setTilt(45);
    return myMap;
};
},{}],13:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],14:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],16:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":15,"_process":14,"inherits":13}],17:[function(require,module,exports){
/*jslint node: true */
/*global module, google, require, define, define.amd*/
'use strict';
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * extendable sandbox.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at the
 * University of Toronto.
 */
var fetchGoogleAuth = require('./fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./fetchers/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./fetchers/fetchGoogleBq.js'),
    fetchWfs = require('./fetchers/fetchWfs.js'),
    newLayer = require('./core/newLayer.js'),
    newViewGmap = require('./views/newViewGmap.js');
/**
 * This is the root socioscapes namespace and object.
 *
 * Requires the modules {@link socioscapes.fetchGoogleAuth}, {@link socioscapes.fetchGoogleGeocode},
 * {@link socioscapes.fetchGoogleBq}, {@link socioscapes.fetchWfs}, {@link socioscapes.newLayer}, and
 * {@link socioscapes.newViewGmap}.
 *
 * @namespace socioscapes
 * @requires module:fetchGoogleAuth
 * @requires module:fetchGoogleGeocode
 * @requires module:fetchGoogleBq
 * @requires module:fetchWfs
 * @requires module:newLayer
 * @requires module:newViewGmap
 */
var socioscapes = {};
Object.defineProperty(socioscapes, 'fetchGoogleAuth', {
    value: fetchGoogleAuth
});
Object.defineProperty(socioscapes, 'fetchGoogleGeocode', {
    value: fetchGoogleGeocode
});
Object.defineProperty(socioscapes, 'fetchGoogleBq', {
    value: fetchGoogleBq
});
Object.defineProperty(socioscapes, 'fetchWfs', {
    value: fetchWfs
});
Object.defineProperty(socioscapes, 'newLayer', {
    value: newLayer
});
Object.defineProperty(socioscapes, 'newViewGmap', {
    value: newViewGmap
});
module.exports = socioscapes;
},{"./core/newLayer.js":3,"./fetchers/fetchGoogleAuth.js":4,"./fetchers/fetchGoogleBq.js":5,"./fetchers/fetchGoogleGeocode.js":7,"./fetchers/fetchWfs.js":8,"./views/newViewGmap.js":10}]},{},[17]);
