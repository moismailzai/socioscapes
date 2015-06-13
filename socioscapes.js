(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.socioscapes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * This METHOD creates a new layer which is either returned: myLayer = s.newLayer() or appended to the root socioscapes
 * object: (s.newLayer('myLayer'). Layers are a simple way to organize related data, geometry, and settings; they allow
 * you to easily access your data, analyze it, associate it with specific geometry, and connect it to various views.
 *
 * To create a new layer: s.newLayer('myLayer')
 * To add data: s.myLayer(
 *
 * @function newLayer
 * @param name {String} The name to be used for the layer (eg. s.name).
 * @return myLayer {Object}
 */
var chroma = require('../libs/chroma.js'),
    Geostats = require('../libs/Geostats.js'),
    myPolyfills = require('../libs/myPolyfills.js');
myPolyfills();

module.exports = function (name) {
    var myLayer,
        _myBreaks = 5,
        _myClasses,
        _myClassification = 'getClassJenks',
        _myColourscale = "YlOrRd",
        _myData,
        _myDomain,
        _myGeom,
        _myGeostats,
        _myViews = {},
        _myLayerStatus = {};
    Object.defineProperty(_myLayerStatus, 'breaks', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'classes', {
        value: false,
        configurable: true
    });
    Object.defineProperty(_myLayerStatus, 'colourscale', {
        value: false,
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

    myLayer = {};
    myLayer.views = _myViews;
    console.log(this);
    Object.defineProperty(myLayer, 'status', {
        value: function (name, state) {
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
                _myLayerStatus.classes &&
                _myLayerStatus.colourscale &&
                _myLayerStatus.data &&
                _myLayerStatus.domain &&
                _myLayerStatus.geom &&
                _myLayerStatus.geostats) {
                    delete _myLayerStatus.readyGis;
                    Object.defineProperty(_myLayerStatus, 'readyGis', {
                        value: true,
                        configurable: true
                    });
                }
            }
        }
    });

    Object.defineProperty(myLayer, 'data', {
        value: function (fetcher, config) {
            var _statusBackup;
            if (!fetcher || !config) {
                return _myData.values;
            }
            _statusBackup = _myLayerStatus.data;
            myLayer.status('data', false);
            fetcher(config, function (result, success) {
                if (success) {
                    _myData = result;
                    _myGeostats = new Geostats(result.values);
                    myLayer.status('data', true);
                } else {
                    myLayer.status('data', _statusBackup);
                }
            });
        }
    });

    Object.defineProperty(myLayer, 'geom', {
        value: function (fetcher, config) {
            var _statusBackup;
            if (!fetcher || !config) {
                return _myGeom.features;
            }
            _statusBackup = _myLayerStatus.geom;
            myLayer.status('geom', false);
            fetcher(config, function (result, success) {
                if (success) {
                    _myGeom = result;
                    myLayer.status('geom', true);
                } else {
                    myLayer.status('geom', _statusBackup);
                }
            });
        }
    });

    Object.defineProperty(myLayer, 'breaks', {
        value: function (breaks) {
            if (!breaks) {
                return _myBreaks;
            }
            if (Number.isInteger(breaks)) {
                _myBreaks = breaks;
                myLayer.status('breaks', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'chromaScale', {
        value: chroma.scale(_myColourscale).domain(_myDomain).out('hex')
    });

    Object.defineProperty(myLayer, 'chromaScaleIndex', {
        value: chroma.scale(_myColourscale).domain(_myDomain, _myBreaks).colors()
    });

    Object.defineProperty(myLayer, 'classes', {
        value: function (classes) {
            if (!classes) {
                return _myClasses;
            }
            if (Object.prototype.toString.call(classes) === '[object Array]') { // http://stackoverflow.com/questions/4775722/check-if-object-is-array
                _myClasses = classes;
                myLayer.status('classes', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'classification', {
        value: function (classification) {
            var i;
            if (!classification) {
                return _myClassification;
            }
            if (_myGeostats[classification] && _myData) {
                myLayer.status('classes', false);
                myLayer.status('domain', false);
                _myDomain = [];
                _myClassification = classification;
                myLayer.classes(_myGeostats[classification](_myBreaks));
                for (i = 0; i < _myBreaks; i++) {
                    _myDomain.push(parseFloat(_myClasses[i]));
                }
                myLayer.status('domain', true);
                myLayer.status('classes', true);
            }
        }
    });

    Object.defineProperty(myLayer, 'domain', {
        value: function () { return _myDomain; }
    });

    Object.defineProperty(myLayer, 'geostats', {
        value: _myGeostats
    });

    Object.defineProperty(myLayer, 'colourscale', {
        value: function (colourscale) {
            if (!colourscale) {
                return _myColourscale;
            }
            myLayer.status('colourscale', false);
            _myColourscale = colourscale;
            myLayer.status('colourscale', true);
        }
    });

    Object.defineProperty(myLayer, 'views', {
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
                value: function () {
                    viewFunction(viewConfig)
                },
                enumerable: true,
                configurable:true
            });
        }
    });
    if (name) {
      this[name] = myLayer;
    }
    return myLayer;
};
},{"../libs/Geostats.js":7,"../libs/chroma.js":8,"../libs/myPolyfills.js":9}],2:[function(require,module,exports){
/**
 * This function requests authorization for the Google APIs.
 *
 * See http://developers.google.com/api-client-library/javascript/reference/referencedocs.
 *
 * @function getGoogleAuth
 * @param config {Object} Configuration parameters (.auth and .client) for the gapi.auth and gapi.client apis.
 * @param [callback] {Function} Optional callback.
 * @return this {Object}
 */
module.exports = function (config, callback) {
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function () {
                if (callback) {
                    callback();
                }
            });
        }
    });
};

},{}],3:[function(require,module,exports){
/**
 * This METHOD authorizes and fetches a BigQuery request, then sends the returned data to be error checked and parsed.
 *
 * @function fetchGoogleBq
 * @param config {Object} Configuration parameters for Google Big Query (bqClientId, bqProjectId, bqQueryString).
 * @return this {Object}
 */

var fetchGoogleAuth = require('./fetchGoogleAuth.js'),
    fetchGoogleBq_Sort = require('./fetchGoogleBq_Sort.js');

module.exports = function (config) {
    var data, _values, _gapiConfig, _bqClientId, _bqProjectId, _bqQueryString, _gapiConfig, _request, _totalRows, _currentRow;
    _currentRow = 0;
    _values = [];
    _bqClientId = config.bqClientId;
    _bqProjectId = config.bqProjectId;
    _bqQueryString = config.bqQueryString;
    _dataId = config.id;
    _bqQueryColumns = config.bqQueryColumns || 2;
    _gapiConfig = {
        auth: {
            "client_id": _bqClientId,
            'scope': ['https://www.googleapis.com/auth/bigquery'],
            'immediate': true
        },
        client: {
            'name': 'bigquery',
            'version': 'v2'
        },
        query: {
            'projectId': _bqProjectId,
            'timeoutMs': '30000',
            'query': _bqQueryString
        }
    };

    fetchGoogleAuth(_gapiConfig, function () {
        _request = gapi.client.bigquery.jobs.query(_gapiConfig.query);
        _request.execute(function (queryResult) {
            console.log(queryResult);
            _totalRows = queryResult.result.totalRows;
            fetchGoogleBq_Sort(queryResult, _bqQueryColumns, function(sortedResult) {
                _values.push(sortedResult);
                _currentRow++;
                if (_currentRow === _totalRows) {
                    data = {};
                    data.values = _values;
                    data.url = _bqQueryString;
                    data.id = _dataId;
                    return [data, true];
                }
            });
        });
    });
};
},{"./fetchGoogleAuth.js":2,"./fetchGoogleBq_Sort.js":4}],4:[function(require,module,exports){
/**
 * This METHOD sorts the results of a Google Big Query fetch to fit the format [key: value].
 *
 * @function sortBigQuery
 * @param bq {Object} The results of a Google Big Query fetch.
 * @param [callback] {Function} Optional callback.
 * @return this {Object}
 */

module.exports = function (bq, columns, callback){
    var thisRow = {};
    bq.result.rows.forEach (function(row) {
        thisRow[columns[0]] = parseFloat(row.f[0].v);
        for (i = 1; i < row.f.length; i++) {
            thisRow[columns[i]] = parseFloat(row.f[i].v);
        }
        callback(thisRow);
    });
};
},{}],5:[function(require,module,exports){
/**
 * This METHOD executes a Google Geocoder query for 'address' and appends the results to the calling object's
 * .geo_cache.lat and .geo_cache.long members.
 *
 * Make sure you obtain a google auth token and load the appropriate client first.
 *
 * @function getLatLong
 * @param address {String}
 * @param [callback] {Function} Optional callback.
 * @return this {Object}
 */
module.exports = function (address) {

    var geocoder = new google.maps.Geocoder(),
        geoCodedAddress = {};

    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geoCoded.lat = results[0].geometry.location.lat();
            geoCoded.long = results[0].geometry.location.lng();
            return geoCodedAddress;
        } else {
            alert('Error: Google Geocoder was unable to locate ' + address);
        }
    });
};
},{}],6:[function(require,module,exports){
/**
 * This METHOD asonchronously fetches geometry from a WFS feature server. It expects GeoJson geometry and stores the
 * result in this.data.geoJson and can optionally return it in a callback.
 *
 * @function fetchWfsGeoJson
 * @param queryString {String} The query (as an escaped CQL string).
 * @param [queryBaseUrl] {String} A valid WFS feature server URL. If an URL is not provided, defaults to
 *                                this.data.wfsUrl.
 * @param [callback] {Object} An optional callback.
 * @return this {Object}
 */

// From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
module.exports = function (config, callback) {
    var _xobj = new XMLHttpRequest(),
        _url = config.url,
        _id = config.id;
    _xobj.overrideMimeType("application/json");
    _xobj.open('GET', _url, true);
    _xobj.onreadystatechange = function () {
        if (_xobj.readyState == 4 && _xobj.status == "200") {
            geom = {};
            geom.features = _xobj.responseText;
            geom.url = _url;
            geom.id = _id;
            callback(geom, true);
        }
    };
    _xobj.send(null);
};
},{}],7:[function(require,module,exports){
/**
* geostats() is a tiny and standalone javascript library for classification 
* Project page - https://github.com/simogeo/geostats
* Copyright (c) 2011 Simon Georget, http://www.empreinte-urbaine.eu
* Licensed under the MIT license
*/


(function (definition) {
    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.

    // CommonJS
    if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // <script>
    } else {
        geostats = definition();
    }

})(function () {

var isInt = function(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
} // 6 characters

var _t = function(str) {
	return str;
};

//taking from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
var isNumber = function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
}



//indexOf polyfill
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }

var geostats = function(a) {

	this.objectId = '';
	this.separator = ' - ';
	this.legendSeparator = this.separator;
	this.method  = '';
	this.precision = 0;
	this.precisionflag = 'auto';
	this.roundlength 	= 2; // Number of decimals, round values
	this.is_uniqueValues = false;
	this.debug =  false;
	
	this.bounds  = Array();
	this.ranges  = Array();
	this.inner_ranges  = null;
	this.colors  = Array();
	this.counter = Array();
	
	// statistics information
	this.stat_sorted	= null;
	this.stat_mean 		= null;
	this.stat_median 	= null;
	this.stat_sum 		= null;
	this.stat_max 		= null;
	this.stat_min 		= null;
	this.stat_pop 		= null;
	this.stat_variance	= null;
	this.stat_stddev	= null;
	this.stat_cov		= null;

	
	/**
	 * logging method
	 */
	this.log = function(msg) {
	
		if(this.debug == true)
			console.log(this.objectID + "(object id) :: " + msg);
		
	};
	
	/**
	 * Set bounds
	 */
	this.setBounds = function(a) {
		
		this.log('Setting bounds (' + a.length + ') : ' + a.join());
	
		this.bounds = Array() // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))
		
		this.bounds = a;
		//this.bounds = this.decimalFormat(a);
		
	};
	
	/**
	 * Set a new serie
	 */
	this.setSerie = function(a) {
		
		this.log('Setting serie (' + a.length + ') : ' + a.join());
	
		this.serie = Array() // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))
		this.serie = a;
		this.setPrecision();
		
	};
	
	/**
	 * Set colors
	 */
	this.setColors = function(colors) {
		
		this.log('Setting color ramp (' + colors.length + ') : '  + colors.join());
		
		this.colors = colors;
		
	};
	
	/**
	 * Get feature count
	 * With bounds array(0, 0.75, 1.5, 2.25, 3); 
	 * should populate this.counter with 5 keys
	 * and increment counters for each key
	 */
	this.doCount = function() {

		if (this._nodata())
			return;
		

		var tmp = this.sorted();
		
		this.counter = new Array();
		
		// we init counter with 0 value
		for(i = 0; i < this.bounds.length -1; i++) {
			this.counter[i]= 0;
		}
		
		for(j=0; j < tmp.length; j++) {
			
			// get current class for value to increment the counter
			var cclass = this.getClass(tmp[j]);
			this.counter[cclass]++;

		}

	};
	
	/**
	 * Set decimal precision according to user input
	 * or automatcally determined according
	 * to the given serie.
	 */
	this.setPrecision = function(decimals) {
		
		// only when called from user
		if(typeof decimals !== "undefined") {
			this.precisionflag = 'manual';
			this.precision = decimals;
		}
		
		// we calculate the maximal decimal length on given serie
		if(this.precisionflag == 'auto') {
			
			for (var i = 0; i < this.serie.length; i++) {
				
				// check if the given value is a number and a float
				if (!isNaN((this.serie[i]+"")) && (this.serie[i]+"").toString().indexOf('.') != -1) {
					var precision = (this.serie[i] + "").split(".")[1].length;
				} else {
					var precision = 0;
				}
				
				if(precision > this.precision) {
					this.precision = precision;
				}
				
			}
			
		}

		this.log('Calling setPrecision(). Mode : ' + this.precisionflag + ' - Decimals : '+ this.precision);
		
		this.serie = this.decimalFormat(this.serie);
		
	};
	
	/**
	 * Format array numbers regarding to precision
	 */
	this.decimalFormat = function(a) {
		
		var b = new Array();
		
		for (var i = 0; i < a.length; i++) {
			// check if the given value is a number
			if (isNumber(a[i])) {
                b[i] = parseFloat(a[i]).toFixed(this.precision);
			} else {
				b[i] = a[i];
			}
		}
		
		return b;
	}
	
	/**
	 * Transform a bounds array to a range array the following array : array(0,
	 * 0.75, 1.5, 2.25, 3); becomes : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	this.setRanges = function() {
	
		this.ranges = Array(); // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))
		
		for (i = 0; i < (this.bounds.length - 1); i++) {
			this.ranges[i] = this.bounds[i] + this.separator + this.bounds[i + 1];
		}
	};

	/** return min value */
	this.min = function() {
		
		if (this._nodata())
			return;
		
		this.stat_min = Math.min.apply(null, this.serie);
		
		return this.stat_min;
	};

	/** return max value */
	this.max = function() {
		
		this.stat_max = Math.max.apply(null, this.serie);
		
		return this.stat_max;
	};

	/** return sum value */
	this.sum = function() {
		
		if (this._nodata())
			return;
		
		if (this.stat_sum  == null) {
			
			this.stat_sum = 0;
			for (i = 0; i < this.pop(); i++) {
				this.stat_sum += parseFloat(this.serie[i]);
			}
			
		}
		
		return this.stat_sum;
	};

	/** return population number */
	this.pop = function() {
		
		if (this._nodata())
			return;
		
		if (this.stat_pop  == null) {
			
			this.stat_pop = this.serie.length;
			
		}
		
		return this.stat_pop;
	};

	/** return mean value */
	this.mean = function() {
		
		if (this._nodata())
			return;

		if (this.stat_mean  == null) {
			
			this.stat_mean = parseFloat(this.sum() / this.pop());
			
		}
		
		return this.stat_mean;
	};

	/** return median value */
	this.median = function() {
		
		if (this._nodata())
			return;
		
		if (this.stat_median  == null) {
			
			this.stat_median = 0;
			var tmp = this.sorted();
			
			// serie pop is odd
			if (tmp.length % 2) {
				this.stat_median = parseFloat(tmp[(Math.ceil(tmp.length / 2) - 1)]);
				
			// serie pop is even
			} else {
				this.stat_median = ( parseFloat(tmp[((tmp.length / 2) - 1)]) + parseFloat(tmp[(tmp.length / 2)]) ) / 2;
			}
			
		}
		
		return this.stat_median;
	};

	/** return variance value */
	this.variance = function() {
		
		round = (typeof round === "undefined") ? true : false;
		
		if (this._nodata())
			return;
		
		if (this.stat_variance  == null) {

			var tmp = 0;
			for (var i = 0; i < this.pop(); i++) {
				tmp += Math.pow( (this.serie[i] - this.mean()), 2 );
			}

			this.stat_variance =  tmp /	this.pop();
			
			if(round == true) {
				this.stat_variance = Math.round(this.stat_variance * Math.pow(10,this.roundlength) )/ Math.pow(10,this.roundlength);
			}
			
		}
		
		return this.stat_variance;
	};
	
	/** return standard deviation value */
	this.stddev = function(round) {
		
		round = (typeof round === "undefined") ? true : false;
		
		if (this._nodata())
			return;
		
		if (this.stat_stddev  == null) {
			
			this.stat_stddev = Math.sqrt(this.variance());
			
			if(round == true) {
				this.stat_stddev = Math.round(this.stat_stddev * Math.pow(10,this.roundlength) )/ Math.pow(10,this.roundlength);
			}
			
		}
		
		return this.stat_stddev;
	};
	
	/** coefficient of variation - measure of dispersion */
	this.cov = function(round) {
		
		round = (typeof round === "undefined") ? true : false;
		
		if (this._nodata())
			return;
		
		if (this.stat_cov  == null) {
			
			this.stat_cov = this.stddev() / this.mean();
			
			if(round == true) {
				this.stat_cov = Math.round(this.stat_cov * Math.pow(10,this.roundlength) )/ Math.pow(10,this.roundlength);
			}
			
		}
		
		return this.stat_cov;
	};
	
	/** data test */
	this._nodata = function() {
		if (this.serie.length == 0) {
			
			alert("Error. You should first enter a serie!");
			return 1;
		} else
			return 0;
		
	};
	
	/** check if the serie contains negative value */
	this._hasNegativeValue = function() {
		
		for (i = 0; i < this.serie.length; i++) {
	    	if(this.serie[i] < 0)
	    		return true;
	    }

		return false;
	};
	
	/** check if the serie contains zero value */
	this._hasZeroValue = function() {
		
		for (i = 0; i < this.serie.length; i++) {
	    	if(parseFloat(this.serie[i]) === 0)
	    		return true;
	    }

		return false;
	};

	/** return sorted values (as array) */
	this.sorted = function() {
		
		if (this.stat_sorted  == null) {
			
			if(this.is_uniqueValues == false) {
				this.stat_sorted = this.serie.sort(function(a, b) {
					return a - b;
				});
			} else {
				this.stat_sorted = this.serie.sort(function(a,b){
					var nameA=a.toString().toLowerCase(), nameB=b.toString().toLowerCase();
				    if(nameA < nameB) return -1;
				    if(nameA > nameB) return 1;
				    return 0;
				})
			}
		}
		
		return this.stat_sorted;
		
	};

	/** return all info */
	this.info = function() {
		
		if (this._nodata())
			return;
		
		var content = '';
		content += _t('Population') + ' : ' + this.pop() + ' - [' + _t('Min')
				+ ' : ' + this.min() + ' | ' + _t('Max') + ' : ' + this.max()
				+ ']' + "\n";
		content += _t('Mean') + ' : ' + this.mean() + ' - ' + _t('Median')	+ ' : ' + this.median() + "\n";
		content += _t('Variance') + ' : ' + this.variance() + ' - ' + _t('Standard deviation')	+ ' : ' + this.stddev()  
				+ ' - ' + _t('Coefficient of variation')	+ ' : ' + this.cov() + "\n";

		return content;
	};
	
	/**
	 * Set Manual classification Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 * Set ranges and prepare data for displaying legend
	 * 
	 */
	this.setClassManually = function(array) {

		if (this._nodata())
	        return;

	    if(array[0] !== this.min() || array[array.length-1] !== this.max()) {
	    	alert(_t('Given bounds may not be correct! please check your input.\nMin value : ' + this.min() + ' / Max value : ' + this.max()));
	    	return; 
	    }

	    this.setBounds(array);
	    this.setRanges();
	    
	    // we specify the classification method
	    this.method = _t('manual classification') + ' (' + (array.length -1) + ' ' + _t('classes') + ')';

	    return this.bounds;
	};

	/**
	 * Equal intervals classification Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	this.getClassEqInterval = function(nbClass, forceMin, forceMax) {

		if (this._nodata())
	        return;

		var tmpMin = (typeof forceMin === "undefined") ? this.min() : forceMin;
		var tmpMax = (typeof forceMax === "undefined") ? this.max() : forceMax;
		
	    var a = Array();
	    var val = tmpMin;
	    var interval = (tmpMax - tmpMin) / nbClass;

	    for (i = 0; i <= nbClass; i++) {
	        a[i] = val;
	        val += interval;
	    }

	    //-> Fix last bound to Max of values
	    a[nbClass] = tmpMax;

	    this.setBounds(a);
	    this.setRanges();
	    
	    // we specify the classification method
	    this.method = _t('eq. intervals') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds;
	};
	

	this.getQuantiles = function(nbClass) {
		var tmp = this.sorted();
		var quantiles = [];

		var step = this.pop() / nbClass;
		for (var i = 1; i < nbClass; i++) {
			var qidx = Math.round(i*step+0.49);
			quantiles.push(tmp[qidx-1]); // zero-based
		}

		return quantiles;
	};

	/**
	 * Quantile classification Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	this.getClassQuantile = function(nbClass) {

		if (this._nodata())
			return;

		var tmp = this.sorted();
		var bounds = this.getQuantiles(nbClass);
		bounds.unshift(tmp[0]);

		if (bounds[tmp.length - 1] !== tmp[tmp.length - 1])
			bounds.push(tmp[tmp.length - 1]);

		this.setBounds(bounds);
		this.setRanges();

		// we specify the classification method
		this.method = _t('quantile') + ' (' + nbClass + ' ' + _t('classes') + ')';

		return this.bounds;

	};
	
	/**
	 * Standard Deviation classification
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	this.getClassStdDeviation = function(nbClass) {

		if (this._nodata())
	        return;

	    var tmpMax = this.max();
	    var tmpMin = this.min();
	    
	    var a = Array();
	    
	    // number of classes is odd
	    if(nbClass % 2 == 1) {

	    	// Euclidean division to get the inferior bound
	    	var infBound = Math.floor(nbClass / 2);
	    	
	    	var supBound = infBound + 1;
	    	
	    	// we set the central bounds
	    	a[infBound] = this.mean() - ( this.stddev() / 2);
	    	a[supBound] = this.mean() + ( this.stddev() / 2);
	    	
	    	// Values < to infBound, except first one
	    	for (i = infBound - 1; i > 0; i--) {
	    		var val = a[i+1] - this.stddev();
		        a[i] = val;
		    }
	    	
	    	// Values > to supBound, except last one
	    	for (i = supBound + 1; i < nbClass; i++) {
	    		var val = a[i-1] + this.stddev();
		        a[i] = val;
		    }
	    	
	    	// number of classes is even
	    } else {
	    	
	    	var meanBound = nbClass / 2;
	    	
	    	// we get the mean value
	    	a[meanBound] = this.mean();
	    	
	    	// Values < to the mean, except first one
	    	for (i = meanBound - 1; i > 0; i--) {
	    		var val = a[i+1] - this.stddev();
		        a[i] = val;
		    }
	    	
	    	// Values > to the mean, except last one
	    	for (i = meanBound + 1; i < nbClass; i++) {
	    		var val = a[i-1] + this.stddev();
		        a[i] = val;
		    }
	    }
	    
	    
	    // we finally set the first value
    	a[0] = this.min();
    	
    	// we finally set the last value
    	a[nbClass] = this.max();

	    this.setBounds(a);
	    this.setRanges();
	    
	    // we specify the classification method
	    this.method = _t('std deviation') + ' (' + nbClass + ' ' + _t('classes')+ ')'; 
	    
	    return this.bounds;
	};
	
	
	/**
	 * Geometric Progression classification 
	 * http://en.wikipedia.org/wiki/Geometric_progression
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	this.getClassGeometricProgression = function(nbClass) {

		if (this._nodata())
	        return;

	    if(this._hasNegativeValue() || this._hasZeroValue()) {
	    	alert(_t('geometric progression can\'t be applied with a serie containing negative or zero values.'));
	    	return;
	    }
	    
	    var a = Array();
	    var tmpMin = this.min();
	    var tmpMax = this.max();
	    
	    var logMax = Math.log(tmpMax) / Math.LN10; // max decimal logarithm (or base 10)
	    var logMin = Math.log(tmpMin) / Math.LN10;; // min decimal logarithm (or base 10)
	    
	    var interval = (logMax - logMin) / nbClass;
	    
	    // we compute log bounds
	    for (i = 0; i < nbClass; i++) {
	    	if(i == 0) {
	    		a[i] = logMin;
	    	} else {
	    		a[i] = a[i-1] + interval;
	    	}
	    }
	    
	    // we compute antilog
	    a = a.map(function(x) { return Math.pow(10, x); });
	    
	    // and we finally add max value
	    a.push(this.max());
	    
	    this.setBounds(a);
	    this.setRanges();
	    
	    // we specify the classification method
	    this.method = _t('geometric progression') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds;
	};
	
	/**
	 * Arithmetic Progression classification 
	 * http://en.wikipedia.org/wiki/Arithmetic_progression
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	this.getClassArithmeticProgression = function(nbClass) {

		if (this._nodata())
	        return;
	    
	    var denominator = 0;
	    
	    // we compute the (french) "Raison"
	    for (i = 1; i <= nbClass; i++) {
	        denominator += i;
	    }

	    var a = Array();
	    var tmpMin = this.min();
	    var tmpMax = this.max();
	    
	    var interval = (tmpMax - tmpMin) / denominator;

	    for (i = 0; i <= nbClass; i++) {
	    	if(i == 0) {
	    		a[i] = tmpMin;
	    	} else {
	    		a[i] = a[i-1] + (i * interval);
	    	}
	    }

	    this.setBounds(a);
	    this.setRanges();
	    
	    // we specify the classification method
	    this.method = _t('arithmetic progression') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds;
	};
	
	/**
	 * Credits : Doug Curl (javascript) and Daniel J Lewis (python implementation)
	 * http://www.arcgis.com/home/item.html?id=0b633ff2f40d412995b8be377211c47b
	 * http://danieljlewis.org/2010/06/07/jenks-natural-breaks-algorithm-in-python/
	 */
	this.getClassJenks = function(nbClass) {
	
		if (this._nodata())
			return;
		
		dataList = this.sorted();

		// now iterate through the datalist:
		// determine mat1 and mat2
		// really not sure how these 2 different arrays are set - the code for
		// each seems the same!
		// but the effect are 2 different arrays: mat1 and mat2
		var mat1 = []
		for ( var x = 0, xl = dataList.length + 1; x < xl; x++) {
			var temp = []
			for ( var j = 0, jl = nbClass + 1; j < jl; j++) {
				temp.push(0)
			}
			mat1.push(temp)
		}

		var mat2 = []
		for ( var i = 0, il = dataList.length + 1; i < il; i++) {
			var temp2 = []
			for ( var c = 0, cl = nbClass + 1; c < cl; c++) {
				temp2.push(0)
			}
			mat2.push(temp2)
		}

		// absolutely no idea what this does - best I can tell, it sets the 1st
		// group in the
		// mat1 and mat2 arrays to 1 and 0 respectively
		for ( var y = 1, yl = nbClass + 1; y < yl; y++) {
			mat1[0][y] = 1
			mat2[0][y] = 0
			for ( var t = 1, tl = dataList.length + 1; t < tl; t++) {
				mat2[t][y] = Infinity
			}
			var v = 0.0
		}

		// and this part - I'm a little clueless on - but it works
		// pretty sure it iterates across the entire dataset and compares each
		// value to
		// one another to and adjust the indices until you meet the rules:
		// minimum deviation
		// within a class and maximum separation between classes
		for ( var l = 2, ll = dataList.length + 1; l < ll; l++) {
			var s1 = 0.0
			var s2 = 0.0
			var w = 0.0
			for ( var m = 1, ml = l + 1; m < ml; m++) {
				var i3 = l - m + 1
				var val = parseFloat(dataList[i3 - 1])
				s2 += val * val
				s1 += val
				w += 1
				v = s2 - (s1 * s1) / w
				var i4 = i3 - 1
				if (i4 != 0) {
					for ( var p = 2, pl = nbClass + 1; p < pl; p++) {
						if (mat2[l][p] >= (v + mat2[i4][p - 1])) {
							mat1[l][p] = i3
							mat2[l][p] = v + mat2[i4][p - 1]
						}
					}
				}
			}
			mat1[l][1] = 1
			mat2[l][1] = v
		}

		var k = dataList.length
		var kclass = []

		// fill the kclass (classification) array with zeros:
		for (i = 0; i <= nbClass; i++) {
			kclass.push(0);
		}

		// this is the last number in the array:
		kclass[nbClass] = parseFloat(dataList[dataList.length - 1])
		// this is the first number - can set to zero, but want to set to lowest
		// to use for legend:
		kclass[0] = parseFloat(dataList[0])
		var countNum = nbClass
		while (countNum >= 2) {
			var id = parseInt((mat1[k][countNum]) - 2)
			kclass[countNum - 1] = dataList[id]
			k = parseInt((mat1[k][countNum] - 1))
			// spits out the rank and value of the break values:
			// console.log("id="+id,"rank = " + String(mat1[k][countNum]),"val =
			// " + String(dataList[id]))
			// count down:
			countNum -= 1
		}
		// check to see if the 0 and 1 in the array are the same - if so, set 0
		// to 0:
		if (kclass[0] == kclass[1]) {
			kclass[0] = 0
		}

		this.setBounds(kclass);
		this.setRanges();

		
		this.method = _t('Jenks') + ' (' + nbClass + ' ' + _t('classes') + ')';
		
		return this.bounds; //array of breaks
	}
	
	
	/**
	 * Quantile classification Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	this.getClassUniqueValues = function() {

		if (this._nodata())
			return;
		
		this.is_uniqueValues = true;
		
		var tmp = this.sorted(); // display in alphabetical order

		var a = Array();

		for (i = 0; i < this.pop(); i++) {
			if(a.indexOf(tmp[i]) === -1)
				a.push(tmp[i]);
		}
		
		this.bounds = a;
		
		// we specify the classification method
		this.method = _t('unique values');
		
		return a;

	};
	
	
	/**
	 * Return the class of a given value.
	 * For example value : 6
	 * and bounds array = (0, 4, 8, 12);
	 * Return 2
	 */
	this.getClass = function(value) {

		for(i = 0; i < this.bounds.length; i++) {
			
			
			if(this.is_uniqueValues == true) {
				if(value == this.bounds[i])
					return i;
			} else {
				// parseFloat() is necessary
				if(parseFloat(value) <= this.bounds[i + 1]) {
					return i;
				}
			}
		}
		
		return _t("Unable to get value's class.");
		
	};

	/**
	 * Return the ranges array : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	this.getRanges = function() {
		
		return this.ranges;
		
	};

	/**
	 * Returns the number/index of this.ranges that value falls into
	 */
	this.getRangeNum = function(value) {
		
		var bounds, i;

		for (i = 0; i < this.ranges.length; i++) {
			bounds = this.ranges[i].split(/ - /);
			if (value <= parseFloat(bounds[1])) {
				return i;
			}
		}
	}
	
	/*
	 * Compute inner ranges based on serie. 
	 * Produce discontinous ranges used for legend - return an array similar to : 
	 * array('0.00-0.74', '0.98-1.52', '1.78-2.25', '2.99-3.14');
	 * If inner ranges already computed, return array values.
	 */
	this.getInnerRanges = function() {
		
		// if already computed, we return the result
		if(this.inner_ranges != null)
			return this.inner_ranges;

		
		var a = new Array();
		var tmp = this.sorted();
		
		var cnt = 1; // bounds array counter
		
		for (i = 0; i < tmp.length; i++) {
			
			if(i == 0) var range_firstvalue = tmp[i]; // we init first range value
			
			if(parseFloat(tmp[i]) > parseFloat(this.bounds[cnt])) {
				
				a[cnt - 1] = '' + range_firstvalue + this.separator + tmp[i-1];
				
				var range_firstvalue =  tmp[i];
				
				cnt++;

			}
			
			// we reach the last range, we finally complete manually
			// and return the array
			if(cnt == (this.bounds.length - 1)) {
				// we set the last value
				a[cnt - 1] = '' + range_firstvalue + this.separator + tmp[tmp.length-1];
				
				this.inner_ranges = a;
				return this.inner_ranges;
			}
			

		}
		
	};
	
	this.getSortedlist = function() {
		
		return this.sorted().join(', ');
		
	};
	
	/**
	 * Return an html legend
	 * colors : specify an array of color (hexadecimal values)
	 * legend :  specify a text input for the legend. By default, just displays 'legend'
	 * counter : if not null, display counter value
	 * callback : if not null, callback function applied on legend boundaries
	 * mode : 	null, 'default', 'distinct', 'discontinuous' : 
	 * 			- if mode is null, will display legend as 'default mode'
	 * 			- 'default' : displays ranges like in ranges array (continuous values), sample :  29.26 - 378.80 / 378.80 - 2762.25 /  2762.25 - 6884.84
	 * 			- 'distinct' : Add + 1 according to decimal precision to distinguish classes (discrete values), sample :  29.26 - 378.80 / 378.81 - 2762.25 /  2762.26 - 6884.84 
	 * 			- 'discontinuous' : indicates the range of data actually falling in each class , sample :  29.26 - 225.43 / 852.12 - 2762.20 /  3001.25 - 6884.84 / not implemented yet
	 */
	this.getHtmlLegend = function(colors, legend, counter, callback, mode) {
		
		var cnt= '';
		
		this.doCount(); // we do count, even if not displayed
		
		if(colors != null) {
			ccolors = colors;
		}
		else {
			ccolors = this.colors;
		}
		
		if(legend != null) {
			lg = legend;
		}
		else {
			lg =  'Legend';
		}
		
		if(counter != null) {
			getcounter = true;
		}
		else {
			getcounter = false;
		}
		
		if(callback != null) {
			fn = callback;
		}
		else {
			fn = function(o) {return o;};
		}
		if(mode == null) {
			mode = 'default';
		}
		if(mode == 'discontinuous') {
			this.getInnerRanges();
			// check if some classes are not populated / equivalent of in_array function
			if(this.counter.indexOf(0) !== -1) {
				alert(_t("Geostats cannot apply 'discontinuous' mode to the getHtmlLegend() method because some classes are not populated.\nPlease switch to 'default' or 'distinct' modes. Exit!"));
				return;
			}

		}
		
		
		if(ccolors.length < this.ranges.length) {
			alert(_t('The number of colors should fit the number of ranges. Exit!'));
			return;
		}
		
		var content  = '<div class="geostats-legend"><div class="geostats-legend-title">' + _t(lg) + '</div>';
		
		if(this.is_uniqueValues == false) {
			
			for (i = 0; i < (this.ranges.length); i++) {
				if(getcounter===true) {
					cnt = ' <span class="geostats-legend-counter">(' + this.counter[i] + ')</span>';
				}
				//console.log("Ranges : " + this.ranges[i]);
				
				// default mode 
				var tmp = this.ranges[i].split(this.separator);
					
				var start_value = parseFloat(tmp[0]).toFixed(this.precision);
				var end_value = parseFloat(tmp[1]).toFixed(this.precision);
					
				
				// if mode == 'distinct' and we are not working on the first value
				if(mode == 'distinct' && i != 0) {

					if(isInt(start_value)) {
						start_value = parseInt(start_value) + 1;
					} else {

						start_value = parseFloat(start_value) + (1 / Math.pow(10,this.precision));
						// strangely the formula above return sometimes long decimal values, 
						// the following instruction fix it
						start_value = parseFloat(start_value).toFixed(this.precision);
					}
				}
				
				// if mode == 'discontinuous'
				if(mode == 'discontinuous') {
										
					var tmp = this.inner_ranges[i].split(this.separator);
					// console.log("Ranges : " + this.inner_ranges[i]);
					
					var start_value = parseFloat(tmp[0]).toFixed(this.precision);
					var end_value = parseFloat(tmp[1]).toFixed(this.precision);
					
				}
				
				// we apply callback function
				var el = fn(start_value) + this.legendSeparator + fn(end_value);
					

				content += '<div><div class="geostats-legend-block" style="background-color:' + ccolors[i] + '"></div> ' + el + cnt + '</div>';
			}
			
		} else {
			
			// only if classification is done on unique values
			for (i = 0; i < (this.bounds.length); i++) {
				if(getcounter===true) {
					cnt = ' <span class="geostats-legend-counter">(' + this.counter[i] + ')</span>';
				}
				var el = fn(this.bounds[i]);
				content += '<div><div class="geostats-legend-block" style="background-color:' + ccolors[i] + '"></div> ' + el + cnt + '</div>';
			}
			
		}
		
		content += '</div>';
    
		return content;
	};

	
	
	// object constructor
	// At the end of script. If not setPrecision() method is not known
	
	// we create an object identifier for debugging
	this.objectID = new Date().getUTCMilliseconds();
	this.log('Creating new geostats object');
	
	if(typeof a !== 'undefined' && a.length > 0) {
		this.serie = a;
		this.setPrecision();
		this.log('Setting serie (' + a.length + ') : ' + a.join());
	} else {
		this.serie = Array();

	};
	
	// creating aliases on classification function for backward compatibility
	this.getJenks = this.getClassJenks;
	this.getGeometricProgression = this.getClassGeometricProgression;
	this.getEqInterval = this.getClassEqInterval;
	this.getQuantile = this.getClassQuantile;
	this.getStdDeviation = this.getClassStdDeviation;
	this.getUniqueValues = this.getClassUniqueValues;
	this.getArithmeticProgression = this.getClassArithmeticProgression;

};


return geostats;
});

},{}],8:[function(require,module,exports){
/** echo  * @license echo  * while read i do echo  *  done echo
*/
!function(){var Color,K,PITHIRD,TWOPI,X,Y,Z,bezier,brewer,chroma,clip_rgb,colors,cos,css2rgb,hex2rgb,hsi2rgb,hsl2rgb,hsv2rgb,lab2lch,lab2rgb,lab_xyz,lch2lab,lch2rgb,limit,luminance,luminance_x,rgb2hex,rgb2hsi,rgb2hsl,rgb2hsv,rgb2lab,rgb2lch,rgb_xyz,root,type,unpack,xyz_lab,xyz_rgb,_ref;chroma=function(x,y,z,m){return new Color(x,y,z,m)};if(typeof module!=="undefined"&&module!==null&&module.exports!=null){module.exports=chroma}if(typeof define==="function"&&define.amd){define([],function(){return chroma})}else{root=typeof exports!=="undefined"&&exports!==null?exports:this;root.chroma=chroma}chroma.color=function(x,y,z,m){return new Color(x,y,z,m)};chroma.hsl=function(h,s,l,a){return new Color(h,s,l,a,"hsl")};chroma.hsv=function(h,s,v,a){return new Color(h,s,v,a,"hsv")};chroma.rgb=function(r,g,b,a){return new Color(r,g,b,a,"rgb")};chroma.hex=function(x){return new Color(x)};chroma.css=function(x){return new Color(x)};chroma.lab=function(l,a,b){return new Color(l,a,b,"lab")};chroma.lch=function(l,c,h){return new Color(l,c,h,"lch")};chroma.hsi=function(h,s,i){return new Color(h,s,i,"hsi")};chroma.gl=function(r,g,b,a){return new Color(r*255,g*255,b*255,a,"gl")};chroma.interpolate=function(a,b,f,m){if(a==null||b==null){return"#000"}if(type(a)==="string"){a=new Color(a)}if(type(b)==="string"){b=new Color(b)}return a.interpolate(f,b,m)};chroma.mix=chroma.interpolate;chroma.contrast=function(a,b){var l1,l2;if(type(a)==="string"){a=new Color(a)}if(type(b)==="string"){b=new Color(b)}l1=a.luminance();l2=b.luminance();if(l1>l2){return(l1+.05)/(l2+.05)}else{return(l2+.05)/(l1+.05)}};chroma.luminance=function(color){return chroma(color).luminance()};chroma._Color=Color;Color=function(){function Color(){var a,arg,args,m,me,me_rgb,x,y,z,_i,_len,_ref,_ref1,_ref2,_ref3,_ref4;me=this;args=[];for(_i=0,_len=arguments.length;_i<_len;_i++){arg=arguments[_i];if(arg!=null){args.push(arg)}}if(args.length===0){_ref=[255,0,255,1,"rgb"],x=_ref[0],y=_ref[1],z=_ref[2],a=_ref[3],m=_ref[4]}else if(type(args[0])==="array"){if(args[0].length===3){_ref1=args[0],x=_ref1[0],y=_ref1[1],z=_ref1[2];a=1}else if(args[0].length===4){_ref2=args[0],x=_ref2[0],y=_ref2[1],z=_ref2[2],a=_ref2[3]}else{throw"unknown input argument"}m=(_ref3=args[1])!=null?_ref3:"rgb"}else if(type(args[0])==="string"){x=args[0];m="hex"}else if(type(args[0])==="object"){_ref4=args[0]._rgb,x=_ref4[0],y=_ref4[1],z=_ref4[2],a=_ref4[3];m="rgb"}else if(args.length>=3){x=args[0];y=args[1];z=args[2]}if(args.length===3){m="rgb";a=1}else if(args.length===4){if(type(args[3])==="string"){m=args[3];a=1}else if(type(args[3])==="number"){m="rgb";a=args[3]}}else if(args.length===5){a=args[3];m=args[4]}if(a==null){a=1}if(m==="rgb"){me._rgb=[x,y,z,a]}else if(m==="gl"){me._rgb=[x*255,y*255,z*255,a]}else if(m==="hsl"){me._rgb=hsl2rgb(x,y,z);me._rgb[3]=a}else if(m==="hsv"){me._rgb=hsv2rgb(x,y,z);me._rgb[3]=a}else if(m==="hex"){me._rgb=hex2rgb(x)}else if(m==="lab"){me._rgb=lab2rgb(x,y,z);me._rgb[3]=a}else if(m==="lch"){me._rgb=lch2rgb(x,y,z);me._rgb[3]=a}else if(m==="hsi"){me._rgb=hsi2rgb(x,y,z);me._rgb[3]=a}me_rgb=clip_rgb(me._rgb)}Color.prototype.rgb=function(){return this._rgb.slice(0,3)};Color.prototype.rgba=function(){return this._rgb};Color.prototype.hex=function(){return rgb2hex(this._rgb)};Color.prototype.toString=function(){return this.name()};Color.prototype.hsl=function(){return rgb2hsl(this._rgb)};Color.prototype.hsv=function(){return rgb2hsv(this._rgb)};Color.prototype.lab=function(){return rgb2lab(this._rgb)};Color.prototype.lch=function(){return rgb2lch(this._rgb)};Color.prototype.hsi=function(){return rgb2hsi(this._rgb)};Color.prototype.gl=function(){return[this._rgb[0]/255,this._rgb[1]/255,this._rgb[2]/255,this._rgb[3]]};Color.prototype.luminance=function(lum,mode){var cur_lum,eps,max_iter,test;if(mode==null){mode="rgb"}if(!arguments.length){return luminance(this._rgb)}if(lum===0){this._rgb=[0,0,0,this._rgb[3]]}if(lum===1){this._rgb=[255,255,255,this._rgb[3]]}cur_lum=luminance(this._rgb);eps=1e-7;max_iter=20;test=function(l,h){var lm,m;m=l.interpolate(.5,h,mode);lm=m.luminance();if(Math.abs(lum-lm)<eps||!max_iter--){return m}if(lm>lum){return test(l,m)}return test(m,h)};this._rgb=(cur_lum>lum?test(new Color("black"),this):test(this,new Color("white"))).rgba();return this};Color.prototype.name=function(){var h,k;h=this.hex();for(k in chroma.colors){if(h===chroma.colors[k]){return k}}return h};Color.prototype.alpha=function(alpha){if(arguments.length){this._rgb[3]=alpha;return this}return this._rgb[3]};Color.prototype.css=function(mode){var hsl,me,rgb,rnd;if(mode==null){mode="rgb"}me=this;rgb=me._rgb;if(mode.length===3&&rgb[3]<1){mode+="a"}if(mode==="rgb"){return mode+"("+rgb.slice(0,3).map(Math.round).join(",")+")"}else if(mode==="rgba"){return mode+"("+rgb.slice(0,3).map(Math.round).join(",")+","+rgb[3]+")"}else if(mode==="hsl"||mode==="hsla"){hsl=me.hsl();rnd=function(a){return Math.round(a*100)/100};hsl[0]=rnd(hsl[0]);hsl[1]=rnd(hsl[1]*100)+"%";hsl[2]=rnd(hsl[2]*100)+"%";if(mode.length===4){hsl[3]=rgb[3]}return mode+"("+hsl.join(",")+")"}};Color.prototype.interpolate=function(f,col,m){var dh,hue,hue0,hue1,lbv,lbv0,lbv1,me,res,sat,sat0,sat1,xyz0,xyz1;me=this;if(m==null){m="rgb"}if(type(col)==="string"){col=new Color(col)}if(m==="hsl"||m==="hsv"||m==="lch"||m==="hsi"){if(m==="hsl"){xyz0=me.hsl();xyz1=col.hsl()}else if(m==="hsv"){xyz0=me.hsv();xyz1=col.hsv()}else if(m==="hsi"){xyz0=me.hsi();xyz1=col.hsi()}else if(m==="lch"){xyz0=me.lch();xyz1=col.lch()}if(m.substr(0,1)==="h"){hue0=xyz0[0],sat0=xyz0[1],lbv0=xyz0[2];hue1=xyz1[0],sat1=xyz1[1],lbv1=xyz1[2]}else{lbv0=xyz0[0],sat0=xyz0[1],hue0=xyz0[2];lbv1=xyz1[0],sat1=xyz1[1],hue1=xyz1[2]}if(!isNaN(hue0)&&!isNaN(hue1)){if(hue1>hue0&&hue1-hue0>180){dh=hue1-(hue0+360)}else if(hue1<hue0&&hue0-hue1>180){dh=hue1+360-hue0}else{dh=hue1-hue0}hue=hue0+f*dh}else if(!isNaN(hue0)){hue=hue0;if((lbv1===1||lbv1===0)&&m!=="hsv"){sat=sat0}}else if(!isNaN(hue1)){hue=hue1;if((lbv0===1||lbv0===0)&&m!=="hsv"){sat=sat1}}else{hue=Number.NaN}if(sat==null){sat=sat0+f*(sat1-sat0)}lbv=lbv0+f*(lbv1-lbv0);if(m.substr(0,1)==="h"){res=new Color(hue,sat,lbv,m)}else{res=new Color(lbv,sat,hue,m)}}else if(m==="rgb"){xyz0=me._rgb;xyz1=col._rgb;res=new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]),xyz0[1]+f*(xyz1[1]-xyz0[1]),xyz0[2]+f*(xyz1[2]-xyz0[2]),m)}else if(m==="lab"){xyz0=me.lab();xyz1=col.lab();res=new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]),xyz0[1]+f*(xyz1[1]-xyz0[1]),xyz0[2]+f*(xyz1[2]-xyz0[2]),m)}else{throw"color mode "+m+" is not supported"}res.alpha(me.alpha()+f*(col.alpha()-me.alpha()));return res};Color.prototype.premultiply=function(){var a,rgb;rgb=this.rgb();a=this.alpha();return chroma(rgb[0]*a,rgb[1]*a,rgb[2]*a,a)};Color.prototype.darken=function(amount){var lch,me;if(amount==null){amount=20}me=this;lch=me.lch();lch[0]-=amount;return chroma.lch(lch).alpha(me.alpha())};Color.prototype.darker=function(amount){return this.darken(amount)};Color.prototype.brighten=function(amount){if(amount==null){amount=20}return this.darken(-amount)};Color.prototype.brighter=function(amount){return this.brighten(amount)};Color.prototype.saturate=function(amount){var lch,me;if(amount==null){amount=20}me=this;lch=me.lch();lch[1]+=amount;return chroma.lch(lch).alpha(me.alpha())};Color.prototype.desaturate=function(amount){if(amount==null){amount=20}return this.saturate(-amount)};return Color}();clip_rgb=function(rgb){var i;for(i in rgb){if(i<3){if(rgb[i]<0){rgb[i]=0}if(rgb[i]>255){rgb[i]=255}}else if(i===3){if(rgb[i]<0){rgb[i]=0}if(rgb[i]>1){rgb[i]=1}}}return rgb};css2rgb=function(css){var hsl,i,m,rgb,_i,_j,_k,_l;css=css.toLowerCase();if(chroma.colors!=null&&chroma.colors[css]){return hex2rgb(chroma.colors[css])}if(m=css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)){rgb=m.slice(1,4);for(i=_i=0;_i<=2;i=++_i){rgb[i]=+rgb[i]}rgb[3]=1}else if(m=css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)){rgb=m.slice(1,5);for(i=_j=0;_j<=3;i=++_j){rgb[i]=+rgb[i]}}else if(m=css.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)){rgb=m.slice(1,4);for(i=_k=0;_k<=2;i=++_k){rgb[i]=Math.round(rgb[i]*2.55)}rgb[3]=1}else if(m=css.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)){rgb=m.slice(1,5);for(i=_l=0;_l<=2;i=++_l){rgb[i]=Math.round(rgb[i]*2.55)}rgb[3]=+rgb[3]}else if(m=css.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)){hsl=m.slice(1,4);hsl[1]*=.01;hsl[2]*=.01;rgb=hsl2rgb(hsl);rgb[3]=1}else if(m=css.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)){hsl=m.slice(1,4);hsl[1]*=.01;hsl[2]*=.01;rgb=hsl2rgb(hsl);rgb[3]=+m[4]}return rgb};hex2rgb=function(hex){var a,b,g,r,rgb,u;if(hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)){if(hex.length===4||hex.length===7){hex=hex.substr(1)}if(hex.length===3){hex=hex.split("");hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]}u=parseInt(hex,16);r=u>>16;g=u>>8&255;b=u&255;return[r,g,b,1]}if(hex.match(/^#?([A-Fa-f0-9]{8})$/)){if(hex.length===9){hex=hex.substr(1)}u=parseInt(hex,16);r=u>>24&255;g=u>>16&255;b=u>>8&255;a=u&255;return[r,g,b,a]}if(rgb=css2rgb(hex)){return rgb}throw"unknown color: "+hex};hsi2rgb=function(h,s,i){var b,g,r,_ref;_ref=unpack(arguments),h=_ref[0],s=_ref[1],i=_ref[2];h/=360;if(h<1/3){b=(1-s)/3;r=(1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3;g=1-(b+r)}else if(h<2/3){h-=1/3;r=(1-s)/3;g=(1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3;b=1-(r+g)}else{h-=2/3;g=(1-s)/3;b=(1+s*cos(TWOPI*h)/cos(PITHIRD-TWOPI*h))/3;r=1-(g+b)}r=limit(i*r*3);g=limit(i*g*3);b=limit(i*b*3);return[r*255,g*255,b*255]};hsl2rgb=function(){var b,c,g,h,i,l,r,s,t1,t2,t3,_i,_ref,_ref1;_ref=unpack(arguments),h=_ref[0],s=_ref[1],l=_ref[2];if(s===0){r=g=b=l*255}else{t3=[0,0,0];c=[0,0,0];t2=l<.5?l*(1+s):l+s-l*s;t1=2*l-t2;h/=360;t3[0]=h+1/3;t3[1]=h;t3[2]=h-1/3;for(i=_i=0;_i<=2;i=++_i){if(t3[i]<0){t3[i]+=1}if(t3[i]>1){t3[i]-=1}if(6*t3[i]<1){c[i]=t1+(t2-t1)*6*t3[i]}else if(2*t3[i]<1){c[i]=t2}else if(3*t3[i]<2){c[i]=t1+(t2-t1)*(2/3-t3[i])*6}else{c[i]=t1}}_ref1=[Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255)],r=_ref1[0],g=_ref1[1],b=_ref1[2]}return[r,g,b]};hsv2rgb=function(){var b,f,g,h,i,p,q,r,s,t,v,_ref,_ref1,_ref2,_ref3,_ref4,_ref5,_ref6;_ref=unpack(arguments),h=_ref[0],s=_ref[1],v=_ref[2];v*=255;if(s===0){r=g=b=v}else{if(h===360){h=0}if(h>360){h-=360}if(h<0){h+=360}h/=60;i=Math.floor(h);f=h-i;p=v*(1-s);q=v*(1-s*f);t=v*(1-s*(1-f));switch(i){case 0:_ref1=[v,t,p],r=_ref1[0],g=_ref1[1],b=_ref1[2];break;case 1:_ref2=[q,v,p],r=_ref2[0],g=_ref2[1],b=_ref2[2];break;case 2:_ref3=[p,v,t],r=_ref3[0],g=_ref3[1],b=_ref3[2];break;case 3:_ref4=[p,q,v],r=_ref4[0],g=_ref4[1],b=_ref4[2];break;case 4:_ref5=[t,p,v],r=_ref5[0],g=_ref5[1],b=_ref5[2];break;case 5:_ref6=[v,p,q],r=_ref6[0],g=_ref6[1],b=_ref6[2]}}r=Math.round(r);g=Math.round(g);b=Math.round(b);return[r,g,b]};K=18;X=.95047;Y=1;Z=1.08883;lab2lch=function(){var a,b,c,h,l,_ref;_ref=unpack(arguments),l=_ref[0],a=_ref[1],b=_ref[2];c=Math.sqrt(a*a+b*b);h=Math.atan2(b,a)/Math.PI*180;return[l,c,h]};lab2rgb=function(l,a,b){var g,r,x,y,z,_ref,_ref1;if(l!==void 0&&l.length===3){_ref=l,l=_ref[0],a=_ref[1],b=_ref[2]}if(l!==void 0&&l.length===3){_ref1=l,l=_ref1[0],a=_ref1[1],b=_ref1[2]}y=(l+16)/116;x=y+a/500;z=y-b/200;x=lab_xyz(x)*X;y=lab_xyz(y)*Y;z=lab_xyz(z)*Z;r=xyz_rgb(3.2404542*x-1.5371385*y-.4985314*z);g=xyz_rgb(-.969266*x+1.8760108*y+.041556*z);b=xyz_rgb(.0556434*x-.2040259*y+1.0572252*z);return[limit(r,0,255),limit(g,0,255),limit(b,0,255),1]};lab_xyz=function(x){if(x>.206893034){return x*x*x}else{return(x-4/29)/7.787037}};xyz_rgb=function(r){return Math.round(255*(r<=.00304?12.92*r:1.055*Math.pow(r,1/2.4)-.055))};lch2lab=function(){var c,h,l,_ref;_ref=unpack(arguments),l=_ref[0],c=_ref[1],h=_ref[2];h=h*Math.PI/180;return[l,Math.cos(h)*c,Math.sin(h)*c]};lch2rgb=function(l,c,h){var L,a,b,g,r,_ref,_ref1;_ref=lch2lab(l,c,h),L=_ref[0],a=_ref[1],b=_ref[2];_ref1=lab2rgb(L,a,b),r=_ref1[0],g=_ref1[1],b=_ref1[2];return[limit(r,0,255),limit(g,0,255),limit(b,0,255)]};luminance=function(r,g,b){var _ref;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];r=luminance_x(r);g=luminance_x(g);b=luminance_x(b);return.2126*r+.7152*g+.0722*b};luminance_x=function(x){x/=255;if(x<=.03928){return x/12.92}else{return Math.pow((x+.055)/1.055,2.4)}};rgb2hex=function(){var b,g,r,str,u,_ref;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];u=r<<16|g<<8|b;str="000000"+u.toString(16);return"#"+str.substr(str.length-6)};rgb2hsi=function(){var TWOPI,b,g,h,i,min,r,s,_ref;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];TWOPI=Math.PI*2;r/=255;g/=255;b/=255;min=Math.min(r,g,b);i=(r+g+b)/3;s=1-min/i;if(s===0){h=0}else{h=(r-g+(r-b))/2;h/=Math.sqrt((r-g)*(r-g)+(r-b)*(g-b));h=Math.acos(h);if(b>g){h=TWOPI-h}h/=TWOPI}return[h*360,s,i]};rgb2hsl=function(r,g,b){var h,l,max,min,s,_ref;if(r!==void 0&&r.length>=3){_ref=r,r=_ref[0],g=_ref[1],b=_ref[2]}r/=255;g/=255;b/=255;min=Math.min(r,g,b);max=Math.max(r,g,b);l=(max+min)/2;if(max===min){s=0;h=Number.NaN}else{s=l<.5?(max-min)/(max+min):(max-min)/(2-max-min)}if(r===max){h=(g-b)/(max-min)}else if(g===max){h=2+(b-r)/(max-min)}else if(b===max){h=4+(r-g)/(max-min)}h*=60;if(h<0){h+=360}return[h,s,l]};rgb2hsv=function(){var b,delta,g,h,max,min,r,s,v,_ref;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];min=Math.min(r,g,b);max=Math.max(r,g,b);delta=max-min;v=max/255;if(max===0){h=Number.NaN;s=0}else{s=delta/max;if(r===max){h=(g-b)/delta}if(g===max){h=2+(b-r)/delta}if(b===max){h=4+(r-g)/delta}h*=60;if(h<0){h+=360}}return[h,s,v]};rgb2lab=function(){var b,g,r,x,y,z,_ref;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];r=rgb_xyz(r);g=rgb_xyz(g);b=rgb_xyz(b);x=xyz_lab((.4124564*r+.3575761*g+.1804375*b)/X);y=xyz_lab((.2126729*r+.7151522*g+.072175*b)/Y);z=xyz_lab((.0193339*r+.119192*g+.9503041*b)/Z);return[116*y-16,500*(x-y),200*(y-z)]};rgb_xyz=function(r){if((r/=255)<=.04045){return r/12.92}else{return Math.pow((r+.055)/1.055,2.4)}};xyz_lab=function(x){if(x>.008856){return Math.pow(x,1/3)}else{return 7.787037*x+4/29}};rgb2lch=function(){var a,b,g,l,r,_ref,_ref1;_ref=unpack(arguments),r=_ref[0],g=_ref[1],b=_ref[2];_ref1=rgb2lab(r,g,b),l=_ref1[0],a=_ref1[1],b=_ref1[2];return lab2lch(l,a,b)};chroma.scale=function(colors,positions){var classifyValue,f,getClass,getColor,resetCache,setColors,setDomain,tmap,_colorCache,_colors,_correctLightness,_domain,_fixed,_max,_min,_mode,_nacol,_numClasses,_out,_pos,_spread;_mode="rgb";_nacol=chroma("#ccc");_spread=0;_fixed=false;_domain=[0,1];_colors=[];_out=false;_pos=[];_min=0;_max=1;_correctLightness=false;_numClasses=0;_colorCache={};setColors=function(colors,positions){var c,col,_i,_j,_ref,_ref1,_ref2;if(colors==null){colors=["#ddd","#222"]}if(colors!=null&&type(colors)==="string"&&((_ref=chroma.brewer)!=null?_ref[colors]:void 0)!=null){colors=chroma.brewer[colors]}if(type(colors)==="array"){colors=colors.slice(0);for(c=_i=0,_ref1=colors.length-1;0<=_ref1?_i<=_ref1:_i>=_ref1;c=0<=_ref1?++_i:--_i){col=colors[c];if(type(col)==="string"){colors[c]=chroma(col)}}if(positions!=null){_pos=positions}else{_pos=[];for(c=_j=0,_ref2=colors.length-1;0<=_ref2?_j<=_ref2:_j>=_ref2;c=0<=_ref2?++_j:--_j){_pos.push(c/(colors.length-1))}}}resetCache();return _colors=colors};setDomain=function(domain){if(domain==null){domain=[]}_domain=domain;_min=domain[0];_max=domain[domain.length-1];resetCache();if(domain.length===2){return _numClasses=0}else{return _numClasses=domain.length-1}};getClass=function(value){var i,n;if(_domain!=null){n=_domain.length-1;i=0;while(i<n&&value>=_domain[i]){i++}return i-1}return 0};tmap=function(t){return t};classifyValue=function(value){var i,maxc,minc,n,val;val=value;if(_domain.length>2){n=_domain.length-1;i=getClass(value);minc=_domain[0]+(_domain[1]-_domain[0])*(0+_spread*.5);maxc=_domain[n-1]+(_domain[n]-_domain[n-1])*(1-_spread*.5);val=_min+(_domain[i]+(_domain[i+1]-_domain[i])*.5-minc)/(maxc-minc)*(_max-_min)}return val};getColor=function(val,bypassMap){var c,col,f0,i,k,p,t,_i,_ref;if(bypassMap==null){bypassMap=false}if(isNaN(val)){return _nacol}if(!bypassMap){if(_domain.length>2){c=getClass(val);t=c/(_numClasses-1)}else{t=f0=_min!==_max?(val-_min)/(_max-_min):0;t=f0=(val-_min)/(_max-_min);t=Math.min(1,Math.max(0,t))}}else{t=val}if(!bypassMap){t=tmap(t)}k=Math.floor(t*1e4);if(_colorCache[k]){col=_colorCache[k]}else{if(type(_colors)==="array"){for(i=_i=0,_ref=_pos.length-1;0<=_ref?_i<=_ref:_i>=_ref;i=0<=_ref?++_i:--_i){p=_pos[i];if(t<=p){col=_colors[i];break}if(t>=p&&i===_pos.length-1){col=_colors[i];break}if(t>p&&t<_pos[i+1]){t=(t-p)/(_pos[i+1]-p);col=chroma.interpolate(_colors[i],_colors[i+1],t,_mode);break}}}else if(type(_colors)==="function"){col=_colors(t)}_colorCache[k]=col}return col};resetCache=function(){return _colorCache={}};setColors(colors,positions);f=function(v){var c;c=getColor(v);if(_out&&c[_out]){return c[_out]()}else{return c}};f.domain=function(domain,classes,mode,key){var d;if(mode==null){mode="e"}if(!arguments.length){return _domain}if(classes!=null){d=chroma.analyze(domain,key);if(classes===0){domain=[d.min,d.max]}else{domain=chroma.limits(d,mode,classes)}}setDomain(domain);return f};f.mode=function(_m){if(!arguments.length){return _mode}_mode=_m;resetCache();return f};f.range=function(colors,_pos){setColors(colors,_pos);return f};f.out=function(_o){_out=_o;return f};f.spread=function(val){if(!arguments.length){return _spread}_spread=val;return f};f.correctLightness=function(v){if(!arguments.length){return _correctLightness}_correctLightness=v;resetCache();if(_correctLightness){tmap=function(t){var L0,L1,L_actual,L_diff,L_ideal,max_iter,pol,t0,t1;L0=getColor(0,true).lab()[0];L1=getColor(1,true).lab()[0];pol=L0>L1;L_actual=getColor(t,true).lab()[0];L_ideal=L0+(L1-L0)*t;L_diff=L_actual-L_ideal;t0=0;t1=1;max_iter=20;while(Math.abs(L_diff)>.01&&max_iter-->0){!function(){if(pol){L_diff*=-1}if(L_diff<0){t0=t;t+=(t1-t)*.5}else{t1=t;t+=(t0-t)*.5}L_actual=getColor(t,true).lab()[0];return L_diff=L_actual-L_ideal}()}return t}}else{tmap=function(t){return t}}return f};f.colors=function(out){var i,samples,_i,_j,_len,_ref;if(out==null){out="hex"}colors=[];samples=[];if(_domain.length>2){for(i=_i=1,_ref=_domain.length;1<=_ref?_i<_ref:_i>_ref;i=1<=_ref?++_i:--_i){samples.push((_domain[i-1]+_domain[i])*.5)}}else{samples=_domain}for(_j=0,_len=samples.length;_j<_len;_j++){i=samples[_j];colors.push(f(i)[out]())}return colors};return f};if((_ref=chroma.scales)==null){chroma.scales={}}chroma.scales.cool=function(){return chroma.scale([chroma.hsl(180,1,.9),chroma.hsl(250,.7,.4)])};chroma.scales.hot=function(){return chroma.scale(["#000","#f00","#ff0","#fff"],[0,.25,.75,1]).mode("rgb")};chroma.analyze=function(data,key,filter){var add,k,r,val,visit,_i,_len;r={min:Number.MAX_VALUE,max:Number.MAX_VALUE*-1,sum:0,values:[],count:0};if(filter==null){filter=function(){return true}}add=function(val){if(val!=null&&!isNaN(val)){r.values.push(val);r.sum+=val;if(val<r.min){r.min=val}if(val>r.max){r.max=val}r.count+=1}};visit=function(val,k){if(filter(val,k)){if(key!=null&&type(key)==="function"){return add(key(val))}else if(key!=null&&type(key)==="string"||type(key)==="number"){return add(val[key])}else{return add(val)}}};if(type(data)==="array"){for(_i=0,_len=data.length;_i<_len;_i++){val=data[_i];visit(val)}}else{for(k in data){val=data[k];visit(val,k)}}r.domain=[r.min,r.max];r.limits=function(mode,num){return chroma.limits(r,mode,num)};return r};chroma.limits=function(data,mode,num){var assignments,best,centroids,cluster,clusterSizes,dist,i,j,kClusters,limits,max,max_log,min,min_log,mindist,n,nb_iters,newCentroids,p,pb,pr,repeat,sum,tmpKMeansBreaks,value,values,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r,_ref1,_ref10,_ref11,_ref12,_ref13,_ref14,_ref15,_ref2,_ref3,_ref4,_ref5,_ref6,_ref7,_ref8,_ref9,_s,_t,_u,_v,_w;if(mode==null){mode="equal"}if(num==null){num=7}if(type(data)==="array"){data=chroma.analyze(data)}min=data.min;max=data.max;sum=data.sum;values=data.values.sort(function(a,b){return a-b});limits=[];if(mode.substr(0,1)==="c"){limits.push(min);limits.push(max)}if(mode.substr(0,1)==="e"){limits.push(min);for(i=_i=1,_ref1=num-1;1<=_ref1?_i<=_ref1:_i>=_ref1;i=1<=_ref1?++_i:--_i){limits.push(min+i/num*(max-min))}limits.push(max)}else if(mode.substr(0,1)==="l"){if(min<=0){throw"Logarithmic scales are only possible for values > 0"}min_log=Math.LOG10E*Math.log(min);max_log=Math.LOG10E*Math.log(max);limits.push(min);for(i=_j=1,_ref2=num-1;1<=_ref2?_j<=_ref2:_j>=_ref2;i=1<=_ref2?++_j:--_j){limits.push(Math.pow(10,min_log+i/num*(max_log-min_log)))}limits.push(max)}else if(mode.substr(0,1)==="q"){limits.push(min);for(i=_k=1,_ref3=num-1;1<=_ref3?_k<=_ref3:_k>=_ref3;i=1<=_ref3?++_k:--_k){p=values.length*i/num;pb=Math.floor(p);if(pb===p){limits.push(values[pb])}else{pr=p-pb;limits.push(values[pb]*pr+values[pb+1]*(1-pr))}}limits.push(max)}else if(mode.substr(0,1)==="k"){n=values.length;assignments=new Array(n);clusterSizes=new Array(num);repeat=true;nb_iters=0;centroids=null;centroids=[];centroids.push(min);for(i=_l=1,_ref4=num-1;1<=_ref4?_l<=_ref4:_l>=_ref4;i=1<=_ref4?++_l:--_l){centroids.push(min+i/num*(max-min))}centroids.push(max);while(repeat){for(j=_m=0,_ref5=num-1;0<=_ref5?_m<=_ref5:_m>=_ref5;j=0<=_ref5?++_m:--_m){clusterSizes[j]=0}for(i=_n=0,_ref6=n-1;0<=_ref6?_n<=_ref6:_n>=_ref6;i=0<=_ref6?++_n:--_n){value=values[i];mindist=Number.MAX_VALUE;for(j=_o=0,_ref7=num-1;0<=_ref7?_o<=_ref7:_o>=_ref7;j=0<=_ref7?++_o:--_o){dist=Math.abs(centroids[j]-value);if(dist<mindist){mindist=dist;best=j}}clusterSizes[best]++;assignments[i]=best}newCentroids=new Array(num);for(j=_p=0,_ref8=num-1;0<=_ref8?_p<=_ref8:_p>=_ref8;j=0<=_ref8?++_p:--_p){newCentroids[j]=null}for(i=_q=0,_ref9=n-1;0<=_ref9?_q<=_ref9:_q>=_ref9;i=0<=_ref9?++_q:--_q){cluster=assignments[i];if(newCentroids[cluster]===null){newCentroids[cluster]=values[i]}else{newCentroids[cluster]+=values[i]}}for(j=_r=0,_ref10=num-1;0<=_ref10?_r<=_ref10:_r>=_ref10;j=0<=_ref10?++_r:--_r){newCentroids[j]*=1/clusterSizes[j]}repeat=false;for(j=_s=0,_ref11=num-1;0<=_ref11?_s<=_ref11:_s>=_ref11;j=0<=_ref11?++_s:--_s){if(newCentroids[j]!==centroids[i]){repeat=true;break}}centroids=newCentroids;nb_iters++;if(nb_iters>200){repeat=false}}kClusters={};for(j=_t=0,_ref12=num-1;0<=_ref12?_t<=_ref12:_t>=_ref12;j=0<=_ref12?++_t:--_t){kClusters[j]=[]}for(i=_u=0,_ref13=n-1;0<=_ref13?_u<=_ref13:_u>=_ref13;i=0<=_ref13?++_u:--_u){cluster=assignments[i];kClusters[cluster].push(values[i])}tmpKMeansBreaks=[];for(j=_v=0,_ref14=num-1;0<=_ref14?_v<=_ref14:_v>=_ref14;j=0<=_ref14?++_v:--_v){tmpKMeansBreaks.push(kClusters[j][0]);tmpKMeansBreaks.push(kClusters[j][kClusters[j].length-1])}tmpKMeansBreaks=tmpKMeansBreaks.sort(function(a,b){return a-b});limits.push(tmpKMeansBreaks[0]);for(i=_w=1,_ref15=tmpKMeansBreaks.length-1;_w<=_ref15;i=_w+=2){if(!isNaN(tmpKMeansBreaks[i])){limits.push(tmpKMeansBreaks[i])}}}return limits};/**
  	ColorBrewer colors for chroma.js
  
  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  	Pennsylvania State University.
  
  	Licensed under the Apache License, Version 2.0 (the "License"); 
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at	
  	http://www.apache.org/licenses/LICENSE-2.0
  
  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.
  
      @preserve
  */
chroma.brewer=brewer={OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],Set2:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"],Accent:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],Set1:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],Set3:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"],Dark2:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"],Paired:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],Pastel2:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"],Pastel1:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]};chroma.colors=colors={indigo:"#4b0082",gold:"#ffd700",hotpink:"#ff69b4",firebrick:"#b22222",indianred:"#cd5c5c",yellow:"#ffff00",mistyrose:"#ffe4e1",darkolivegreen:"#556b2f",olive:"#808000",darkseagreen:"#8fbc8f",pink:"#ffc0cb",tomato:"#ff6347",lightcoral:"#f08080",orangered:"#ff4500",navajowhite:"#ffdead",lime:"#00ff00",palegreen:"#98fb98",darkslategrey:"#2f4f4f",greenyellow:"#adff2f",burlywood:"#deb887",seashell:"#fff5ee",mediumspringgreen:"#00fa9a",fuchsia:"#ff00ff",papayawhip:"#ffefd5",blanchedalmond:"#ffebcd",chartreuse:"#7fff00",dimgray:"#696969",black:"#000000",peachpuff:"#ffdab9",springgreen:"#00ff7f",aquamarine:"#7fffd4",white:"#ffffff",orange:"#ffa500",lightsalmon:"#ffa07a",darkslategray:"#2f4f4f",brown:"#a52a2a",ivory:"#fffff0",dodgerblue:"#1e90ff",peru:"#cd853f",lawngreen:"#7cfc00",chocolate:"#d2691e",crimson:"#dc143c",forestgreen:"#228b22",darkgrey:"#a9a9a9",lightseagreen:"#20b2aa",cyan:"#00ffff",mintcream:"#f5fffa",silver:"#c0c0c0",antiquewhite:"#faebd7",mediumorchid:"#ba55d3",skyblue:"#87ceeb",gray:"#808080",darkturquoise:"#00ced1",goldenrod:"#daa520",darkgreen:"#006400",floralwhite:"#fffaf0",darkviolet:"#9400d3",darkgray:"#a9a9a9",moccasin:"#ffe4b5",saddlebrown:"#8b4513",grey:"#808080",darkslateblue:"#483d8b",lightskyblue:"#87cefa",lightpink:"#ffb6c1",mediumvioletred:"#c71585",slategrey:"#708090",red:"#ff0000",deeppink:"#ff1493",limegreen:"#32cd32",darkmagenta:"#8b008b",palegoldenrod:"#eee8aa",plum:"#dda0dd",turquoise:"#40e0d0",lightgrey:"#d3d3d3",lightgoldenrodyellow:"#fafad2",darkgoldenrod:"#b8860b",lavender:"#e6e6fa",maroon:"#800000",yellowgreen:"#9acd32",sandybrown:"#f4a460",thistle:"#d8bfd8",violet:"#ee82ee",navy:"#000080",magenta:"#ff00ff",dimgrey:"#696969",tan:"#d2b48c",rosybrown:"#bc8f8f",olivedrab:"#6b8e23",blue:"#0000ff",lightblue:"#add8e6",ghostwhite:"#f8f8ff",honeydew:"#f0fff0",cornflowerblue:"#6495ed",slateblue:"#6a5acd",linen:"#faf0e6",darkblue:"#00008b",powderblue:"#b0e0e6",seagreen:"#2e8b57",darkkhaki:"#bdb76b",snow:"#fffafa",sienna:"#a0522d",mediumblue:"#0000cd",royalblue:"#4169e1",lightcyan:"#e0ffff",green:"#008000",mediumpurple:"#9370db",midnightblue:"#191970",cornsilk:"#fff8dc",paleturquoise:"#afeeee",bisque:"#ffe4c4",slategray:"#708090",darkcyan:"#008b8b",khaki:"#f0e68c",wheat:"#f5deb3",teal:"#008080",darkorchid:"#9932cc",deepskyblue:"#00bfff",salmon:"#fa8072",darkred:"#8b0000",steelblue:"#4682b4",palevioletred:"#db7093",lightslategray:"#778899",aliceblue:"#f0f8ff",lightslategrey:"#778899",lightgreen:"#90ee90",orchid:"#da70d6",gainsboro:"#dcdcdc",mediumseagreen:"#3cb371",lightgray:"#d3d3d3",mediumturquoise:"#48d1cc",lemonchiffon:"#fffacd",cadetblue:"#5f9ea0",lightyellow:"#ffffe0",lavenderblush:"#fff0f5",coral:"#ff7f50",purple:"#800080",aqua:"#00ffff",whitesmoke:"#f5f5f5",mediumslateblue:"#7b68ee",darkorange:"#ff8c00",mediumaquamarine:"#66cdaa",darksalmon:"#e9967a",beige:"#f5f5dc",blueviolet:"#8a2be2",azure:"#f0ffff",lightsteelblue:"#b0c4de",oldlace:"#fdf5e6"};type=function(){var classToType,name,_i,_len,_ref1;classToType={};_ref1="Boolean Number String Function Array Date RegExp Undefined Null".split(" ");for(_i=0,_len=_ref1.length;_i<_len;_i++){name=_ref1[_i];classToType["[object "+name+"]"]=name.toLowerCase()}return function(obj){var strType;strType=Object.prototype.toString.call(obj);return classToType[strType]||"object"}}();limit=function(x,min,max){if(min==null){min=0}if(max==null){max=1}if(x<min){x=min}if(x>max){x=max}return x};unpack=function(args){if(args.length>=3){return args}else{return args[0]}};TWOPI=Math.PI*2;PITHIRD=Math.PI/3;cos=Math.cos;bezier=function(colors){var I,I0,I1,c,lab0,lab1,lab2,lab3,_ref1,_ref2,_ref3;colors=function(){var _i,_len,_results;_results=[];for(_i=0,_len=colors.length;_i<_len;_i++){c=colors[_i];_results.push(chroma(c))}return _results}();if(colors.length===2){_ref1=function(){var _i,_len,_results;_results=[];for(_i=0,_len=colors.length;_i<_len;_i++){c=colors[_i];_results.push(c.lab())}return _results}(),lab0=_ref1[0],lab1=_ref1[1];I=function(t){var i,lab;lab=function(){var _i,_results;_results=[];for(i=_i=0;_i<=2;i=++_i){_results.push(lab0[i]+t*(lab1[i]-lab0[i]))}return _results}();return chroma.lab.apply(chroma,lab)}}else if(colors.length===3){_ref2=function(){var _i,_len,_results;_results=[];for(_i=0,_len=colors.length;_i<_len;_i++){c=colors[_i];_results.push(c.lab())}return _results}(),lab0=_ref2[0],lab1=_ref2[1],lab2=_ref2[2];I=function(t){var i,lab;lab=function(){var _i,_results;_results=[];for(i=_i=0;_i<=2;i=++_i){_results.push((1-t)*(1-t)*lab0[i]+2*(1-t)*t*lab1[i]+t*t*lab2[i])}return _results}();return chroma.lab.apply(chroma,lab)}}else if(colors.length===4){_ref3=function(){var _i,_len,_results;_results=[];for(_i=0,_len=colors.length;_i<_len;_i++){c=colors[_i];_results.push(c.lab())}return _results}(),lab0=_ref3[0],lab1=_ref3[1],lab2=_ref3[2],lab3=_ref3[3];I=function(t){var i,lab;lab=function(){var _i,_results;_results=[];for(i=_i=0;_i<=2;i=++_i){_results.push((1-t)*(1-t)*(1-t)*lab0[i]+3*(1-t)*(1-t)*t*lab1[i]+3*(1-t)*t*t*lab2[i]+t*t*t*lab3[i])}return _results}();return chroma.lab.apply(chroma,lab)}}else if(colors.length===5){I0=bezier(colors.slice(0,3));I1=bezier(colors.slice(2,5));I=function(t){if(t<.5){return I0(t*2)}else{return I1((t-.5)*2)}}}return I};chroma.interpolate.bezier=bezier}.call(this);
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
/**
 * This METHOD appends a new Google Maps view to the socioscapes object and places it inside the specified div.
 *
 * @method setViewGmap
 * @param viewName {String} This is the name for the new view.
 * @param latLong {Object} Object with latitude and longitude coordinates. [.lat .long]
 * @param div {String} The DIV ID to place this view in (no #).
 * @param [mapOptions] {Object} Optional object with google maps options. See google api docs for formatting.
 * @param callback {Function} Callback.
 * @return this {Object}
 */

var fetchGoogleAuth = require('../fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('../fetchers/fetchGoogleGeocode.js'),
    setViewGmap_Labels = require('./viewGmap_Labels.js'),
    setViewGmap_Map = require('./viewGmap_Map.js');

module.exports = function (config) {
    var myGmapView, _myDiv, _myMap, _myGmapLayer, _myGmapLayers, _myStyle, _myHoverListenerSet, _myHoverListenerReset, _myOnClickListener, _mySelectedFeatures, _mySelectionLimit, _mySelectionCount, _myFeatureId;
    _myDiv = document.getElementById(config.div);

    fetchGoogleGeocode(config.address, function (geocodedAddress) {
        setViewGmap_Map(geocodedAddress, _myDiv, config.styles, config.options, function (mappedAddress) {
            setViewGmap_Labels(mappedAddress, config.labels, function (myMap) {
                myGmapView = {};
                _myMap = myMap;
                Object.defineProperty(myGmapView, 'div', {
                    get: function () { return _myDiv; },
                    set: function (div) {
                        if (document.getElementById(div)) {
                            _myDiv = document.getElementById(div);
                        }
                    }
                });
                Object.defineProperty(myGmapView, 'map', {
                    value: function () { return _myMap; }
                });
                Object.defineProperty(myGmapView.map, 'newLayer', {
                    get: function () { return _myGmapLayers; },
                    set: function (name, id, url) {
                        if (!myGmapView.map.layers) {
                            myGmapView.map.layers = {};
                        }
                        if (myGmapView.map.layers[name] && id === "DELETE") {
                            delete(_myGmapLayers[layerName]);
                            delete(myGmapView.map.layers[name]);
                        } else if (!myGmapView.map.layers[name] && id !== "DELETE") {
                            _myGmapLayer = new google.maps.Data();
                            _myGmapLayer.loadGeoJson(url, {idPropertyName: id});
                            Object.defineProperty(myGmapView.map.layers, name, {
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'setStyle', {
                                get: function () { return _myStyle; },
                                set: function (styleFunction) {
                                    _myGmapLayer.setStyle(styleFunction);
                                    _myStyle = styleFunction;
                                }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'on', {
                                value: function () { _myGmapLayer.setMap(_myDiv); }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'off', {
                                value: function () { _myGmapLayer.setMap(null); }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'onHover', {
                                value: function (callback) {
                                    if (_myHoverListenerSet !== undefined) {
                                        _myHoverListenerSet.remove();
                                        _myHoverListenerReset.remove();
                                    }
                                    if (callback === "OFF") {
                                        return;
                                    }
                                    // Set
                                    _myHoverListenerSet = _myGmapLayer.addListener('mouseover', function (event) {
                                        event.feature.setProperty('hover', true);
                                        if (typeof callback === "function") {
                                            callback(event.feature);
                                        }
                                    });
                                    // Reset
                                    _myHoverListenerReset = _myGmapLayer.addListener('mouseout', function (event) {
                                        event.feature.setProperty('hover', false);
                                        if (typeof callback === "function") {
                                            callback(event.feature);
                                        }
                                    });
                                }
                            });
                            Object.defineProperty(myGmapView.map.layers.name, 'onClick', {
                                value: function (limit, callback) {
                                    // Check to see if a click listener already exists for this layer and remove it / reset properties
                                    if (_myOnClickListener !== undefined) {
                                        _myOnClickListener.remove();
                                        for (var _selectedFeature in _mySelectedFeatures) {
                                            if (_mySelectedFeatures.hasOwnProperty(_selectedFeature)) {
                                                _mySelectedFeatures[_selectedFeature].setProperty('selected', false);
                                                delete _mySelectedFeatures[_selectedFeature];
                                            }
                                        }
                                    }
                                    if (limit === "OFF") {
                                        return;
                                    }
                                    if (limit !== undefined && Number.isInteger(limit) === true) {
                                        _mySelectionLimit = limit;
                                    }
                                    // Create the listener
                                    _mySelectionCount = 0;
                                    _myOnClickListener = this.addListener('click', function(event) {
                                        _myFeatureId = event.feature.getProperty(id);
                                        // If the clicked feature's isSelected property is TRUE
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
                        }
                        return myGmapView;
                    }
                });
            });
        });
    });
};
},{"../fetchers/fetchGoogleAuth.js":2,"../fetchers/fetchGoogleGeocode.js":5,"./setViewGmap_Labels.js":11,"./setViewGmap_Map.js":12}],11:[function(require,module,exports){
/**
 * This METHOD creates a new google.maps.OverlayView which is loaded on top of the symbology layer as labels.
 *
 * @function setLabels
 * @param mapObject {Object} The map to append this OverlayView to.
 * @param [styles] {Array} Optional array of {"feature": "rule"} declarative styles.
 * @return this {Object}
 */

module.exports = function (mapObject, styles) {

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
    LayerHack.onAdd = function() {
        dom = this.getPanes();
        dom.mapPane.style.zIndex = 150;
    };
    LayerHack.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
    LayerHack.draw = function() {};
    LayerHack.setMap(mapObject);

    // Create and set the label layer
    mapObject.labels = new google.maps.StyledMapType(styles);
    mapObject.overlayMapTypes.insertAt(0, mapObject.labels);

    return mapObject;
};
},{}],12:[function(require,module,exports){
/**
 * This METHOD creates a new google.maps object and assigns it to the specified view.
 *
 * @function setGmap
 * @param viewName {String} The name to use for this map view.
 * @param [latLong] {Object} Optional object with latitude and longitude coordinates. .lat .long
 * @param [options] {Object} Optional object with google maps options. See google api docs for formatting.
 * @param [styles] {Array} Optional array of {"feature": "rule"} declarative styles.
 * @return this {Object}
 */

module.exports = function (geocode, div, styles, options) {

    var myMap;

    styles = styles || [
            {
                "featureType":"administrative",
                "elementType":"labels.text.fill",
                "stylers":[
                    {"color":"#444444"}
                ]
            },
            {
                "featureType":"administrative.locality",
                "elementType":"labels.text",
                "stylers":
                    [
                        {"visibility":"on"}
                    ]
            },
            {
                "featureType":"administrative.neighborhood",
                "elementType":"labels.text",
                "stylers":
                    [
                        {"visibility":"off"},
                        {"hue":"#ff0000"}
                    ]
            },
            {
                "featureType":"landscape",
                "elementType":"all",
                "stylers":
                    [
                        {"color":"#f2f2f2"}
                    ]
            },
            {
                "featureType":"poi",
                "elementType":"all",
                "stylers":
                    [
                        {"visibility":"off"}
                    ]
            },
            {
                "featureType":"road",
                "elementType":"all",
                "stylers":
                    [
                        {"saturation":-100},
                        {"lightness":45}
                    ]
            },
            {
                "featureType":"road.highway",
                "elementType":"all",
                "stylers":
                    [
                        {"visibility":"simplified"}
                    ]
            },
            {
                "featureType":"road.highway",
                "elementType":"labels.text",
                "stylers":
                    [
                        {"visibility":"on"}
                    ]
            },
            {
                "featureType":"road.highway",
                "elementType":"labels.icon",
                "stylers":
                    [
                        {"visibility":"on"}
                    ]
            },
            {
                "featureType":"road.arterial",
                "elementType":"labels.icon",
                "stylers":
                    [
                        {"visibility":"off"}
                    ]
            },
            {
                "featureType":"transit",
                "elementType":"all",
                "stylers":
                    [
                        {"visibility":"off"}
                    ]
            },
            {
                "featureType":"water",
                "elementType":"all",
                "stylers":
                    [
                        {"color":"#46bcec"},
                        {"visibility":"on"}
                    ]
            },
            {
                "featureType":"all",
                "elementType":"labels",
                "stylers":
                    [
                        {"visibility":"off"}
                    ]
            }
        ];

    options = options || {
            zoom: 13,
            center: new google.maps.LatLng(geocode.lat, geocode.long),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:true,
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
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/SocioscapesGIS
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ Copies have no rights
 *
 * This software was written as partial fulfilment of the degree requirements for the Masters of Arts in Sociology at the
 * University of Toronto.
 */
var fetchGoogleAuth = require('./fetchers/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./fetchers/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./fetchers/fetchGoogleBq.js'),
    fetchWfs = require('./fetchers/fetchWfs.js'),
    newLayer = require('./core/newLayer.js'),
    setViewGmap = require('./views/viewGmap.js');

module.exports = function (pluginModule) {

    var s = {};

    Object.defineProperty(s, 'fetchGoogleAuth', {
        value: fetchGoogleAuth
    });
    Object.defineProperty(s, 'fetchGoogleGeocode', {
        value: fetchGoogleGeocode
    });
    Object.defineProperty(s, 'fetchGoogleBq', {
        value: fetchGoogleBq
    });
    Object.defineProperty(s, 'fetchWfs', {
        value: fetchWfs
    });
    Object.defineProperty(s, 'newLayer', {
        value: newLayer
    });
    Object.defineProperty(s, 'setViewGmap', {
        value: setViewGmap
    });

    if (pluginModule) {
        return pluginModule(s);
    }
    return s;
};

},{"./core/newLayer.js":1,"./fetchers/fetchGoogleAuth.js":2,"./fetchers/fetchGoogleBq.js":3,"./fetchers/fetchGoogleGeocode.js":5,"./fetchers/fetchWfs.js":6,"./views/setViewGmap.js":10}]},{},[13])(13)
});