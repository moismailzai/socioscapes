/**
 * SocioscapesGIS is a JavasScript library meant to provide an alternative to desktop geographic information systems
 * and proprietary data visualization software. The purpose of this API is to provide a unified interface for
 * open-source JavaScript data visualization libraries, including d3, crossfilter, geostats, chroma, and datatables.
 * SocioscapesGIS operates as a set of structured objects and helper functions.  SocioscapesGIS includes native support
 * for Google Maps and Google BigQuery. Each new SocioscapesGIS object is a sandboxed environment that can be used to
 * store an arbitrary number of Layers, Views, and Scapes, each of which can be quickly assigned to DOM elements, saved
 * for later use, shared, reloaded, and altered.
 *
 * Project page - https://github.com/moismailzai/SocioscapesGIS
 *
 * Copyright (c) 2015 Mo Ismailzai, http://www.moismailzai.com
 *
 * Licensed under the MIT license
 */

// Add a polyfill for Number.isInteger method if it doesn't exist
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
if (!Number.isInteger) {
    Number.isInteger = function isInteger (nVal) {
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    };
}

function SOCIOSCAPES() {
    var SOCIOSCAPES_ROOT = this;
    /**
     * This FUNCTION requests user authorization for Google API access.
     *
     * @function getGapiAuth
     * @param gapi_config {Object} Configuration parameters for .auth, .client, .query, and .callback
     * @param [getGapiAuthCallback] {Function} Optional callback parameter.
     */
    this.getGapiAuth = function (gapi_config, getGapiAuthCallback) {
        var that = this;
        gapi.auth.authorize(gapi_config.auth, function () {
            gapi.client.load(gapi_config.client.name, gapi_config.client.version, function () {
                if (getGapiAuthCallback !== undefined) {
                    getGapiAuthCallback(that);
                }
            });
        });
        return this;
    };

    /**
     * This METHOD executes a Google Geocoder query and returns the fetched bq_query_results.
     *
     * @function getLatLong
     * @param place {String}
     * @param country {String}
     * @param geo_config {Object} This object will be appended with .map_lat and .map_long
     * @param [getLatLongCallback] {Function} Optional callback parameter.
     * @return geo_config {Object}
     */
    this.getLatLong = function (getlatlong_address, getLatLongCallback) {
        var geocoder = new google.maps.Geocoder();
        this.geo_cache = {};
        var that = this;
        geocoder.geocode({'address': getlatlong_address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.geo_cache.lat = results[0].geometry.location.lat();
                that.geo_cache.long = results[0].geometry.location.lng();
                if (getLatLongCallback !== undefined){
                    getLatLongCallback(that);
                } else {
                    return that;
                }
            } else {
                alert('Error: Google Geocoder was unable to locate ' + getlatlong_address);
            }
        });
    };

    this.getGmap = function (scape_name, view_name, gmap_geocode, gmap_options){
        gmap_options = gmap_options || [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]}];
        if (gmap_options){
            var gmap_zoom = gmap_options.zoom || 13;
        } else {
            var gmap_zoom = 13;
        }
        this[scape_name].views[view_name] = new google.maps.Map(this[scape_name].views[view_name].getDiv, {
            zoom: gmap_zoom,
            center: new google.maps.LatLng(gmap_geocode.geo_cache.lat, gmap_geocode.geo_cache.long),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:true,
            MapTypeControlOptions: {
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.SATELLITE
                ],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            },
            scaleControl: true,
            disableDoubleClickZoom: true,
            streetViewControl: true,
            overviewMapControl: true,
            styles: gmap_options
        });

        this.setGmapLabels(this[scape_name].views[view_name]);
        this[scape_name].views[view_name].setTilt(45);
        return this;
    };

    this.setGmapLabels = function (gmap_object, gmap_labels_options){
            gmap_labels_options = gmap_labels_options || [
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
            var dummyLayer = new google.maps.OverlayView();

            dummyLayer.onAdd = function() {
                var panes = this.getPanes();
                panes.mapPane.style.zIndex = 500;
            };

            dummyLayer.onRemove = function() {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            };

            dummyLayer.draw = function() {};

            dummyLayer.setMap(gmap_object);

            gmap_object.getGmapViewLabels = new google.maps.StyledMapType(gmap_labels_options);
            gmap_object.overlayMapTypes.insertAt(0, gmap_object.getGmapViewLabels);
            return this;
    };
    /**
     * This METHOD appends a new SCAPE to the parent SOCIOSCAPES object.
     *
     * Scapes are intended as repositories that store geometry, data, and visualizations. These objects can in turn be
     * combined in non-destructive ways to create LAYERS and VIEWS. Think of Scapes as working directories or asset
     * stores for a set of related projects.
     *
     * @method setScape
     * @param scape {String}
     */
    this.setScape = function (scape) {

        // Create a new Scape and set its scape_name property
        this[scape] = {};
        this[scape].layers = {};
        this[scape].views = {};
        this[scape].getNameSelf = scape;
        var SCAPE_ROOT = this[scape];

        /**
         * This METHOD appends a new Google Maps VIEW to the parent SCAPE object.
         *
         * Views are visualizations created from the elements in a Scape and are intended to promote object reuse, to
         * simplify DOM assignment and management, and to facilitate the creation of complex visualizations through a
         * single method call.
         *
         * @method setViewGmap
         * @param view_name {String} This is the name for the new View.
         * @param [view_config] {Object} This is the primary configuration object.
         * @param view_config.map_lat
         * @param view_config.map_long
         * @param view_config.zoom
         * @param view_config.map_div_name
         * @param [view_config.map_options]
         * @param [view_config.overwrite] This needs to be set to true if you want to overwrite a view.
         */
        this[scape].setViewGmap = function (view_name, view_geocoded_lat_long, view_div, view_map_options, ViewGmapCallback) {
            // Check to see if a view by this name already exists. If so, only proceed if overwrite flag is true
            if (this.views[view_name]) {
                console.log('A View by this name already exists. Please use the .remove method');
                return
            }

            this.views[view_name] = {};
            this.views[view_name].getDiv = document.getElementById(view_div);
            var that = this;
            SOCIOSCAPES_ROOT.getLatLong(view_geocoded_lat_long, function(geocoded_results){
                SOCIOSCAPES_ROOT.getGmap(that.getNameSelf, view_name, geocoded_results, view_map_options, function(gmap_results){
                    if (ViewGmapCallback !== undefined){
                        ViewGmapCallback(gmap_results);
                    }
                });
            });
            return this;
        };

        /**
         * This METHOD fetches JSON geometry from map_layer_config.geomUrl.
         *
         * The geometry is filtered according to map_layer_config.id_property, styled, and applied to a layer.
         *
         * @param map_layer_config.geomUrl
         * @param map_layer_config.symbology_id
         * @param [map_layer_config.style_options_default]
         * @param [map_layer_config.style_options_hover]
         * @param [map_layer_config.style_options_click]
         * @param [map_layer_config.overwrite] This needs to be set to true if you want to overwrite a Map Layer.
         */
        this[scape].setLayerGmap = function (layer_name, view_name, geometry_id, geometry_url, gMapLayerCallback) {

            // If no layers exist, create the layers container
            this.layers[layer_name] = new google.maps.Data();
            this.layers[layer_name].getNameView = view_name;
            this.layers[layer_name].getNameScape = this.getNameSelf;
            this.layers[layer_name].getNameSelf = layer_name;
            this.layers[layer_name].getGeometrySource = geometry_url;
            this.layers[layer_name].getSymbologyId = geometry_id;
            this.layers[layer_name].getView = view_name;
            this.layers[layer_name].getSelectedFeatures = {};
            this.layers[layer_name].getStyleOptionsDefault = {
                fillOpacity: 0.55,
                fillColor: "purple",
                strokeOpacity: 0.8,
                strokeColor: "black",
                strokeWeight: 3,
                zIndex: 5,
                visible: true,
                clickable: true
            };
            this.layers[layer_name].getStyleOptionsHover = {
                fillOpacity: 0.75,
                fillColor: "purple",
                strokeOpacity: 1,
                strokeColor: "black",
                        strokeWeight: 3,
                        zIndex: 10,
                        visible: true,
                        clickable: true
            };
            this.layers[layer_name].getStyleOptionsClick = {
                fillOpacity: 1,
                fillColor: "purple",
                strokeOpacity: 1,
                strokeColor: "black",
                strokeWeight: 4,
                zIndex: 15,
                visible: true,
                clickable: true
            };

            var LAYER_ROOT = this.layers[layer_name];

            // Fetch the geometry and create a layer
            this.layers[layer_name].loadGeoJson(this.layers[layer_name].getGeometrySource, {idPropertyName: this.layers[layer_name].getSymbologyId});

            // Create a mouseover listener for geometry features in the layer
            this.layers[layer_name].setHoverEffect = function (setHoverEffectCallback) {

                    // Check to see if a hover listener already exists for this layer and remove it.
                    if (this.onHoverListenerSetter !== undefined) {
                        this.onHoverListenerSetter.remove();
                        this.onHoverListenerResetter.remove();
                    }
                    // Set
                    this.onHoverListenerSetter = this.addListener('mouseover', function (event) {
                        event.feature.setProperty('hover', true);
                        if (typeof setHoverEffectCallback === "function") {
                            setHoverEffectCallback(event.feature);
                        }
                    });
                    // Reset
                    this.onHoverListenerResetter = this.addListener('mouseout', function (event) {
                        event.feature.setProperty('hover', false);
                        if (typeof setHoverEffectCallback === "function") {
                            setHoverEffectCallback(event.feature);
                        }
                    });
                    return this;
            };

            // Create a click listener for geometry in the layer
            this.layers[layer_name].setClickEffect = function (selection_limit, setClickEffectCallback) {
                // Check to see if a click listener already exists for this layer and remove it / reset properties
                if (this.onClickListener !== undefined) {
                    this.onClickListener.remove();
                    for (var selected_item_key in this.getSelectedFeatures) {
                        if (this.getSelectedFeatures.hasOwnProperty(selected_item_key)) {
                            this.getSelectedFeatures[selected_item_key].setProperty('isSelected', false);
                            delete this.getSelectedFeatures[selected_item_key];
                        }
                    }
                }

                if (selection_limit !== undefined && Number.isInteger(selection_limit) === true) {
                    this.selection_limit = selection_limit;
                }

                // Create the listener
                this.getSelectionCount = 0;
                this.onClickListener = this.addListener('click', function(event) {
                    var feature_id = event.feature.getProperty(this.getSymbologyId);
                    // If the clicked feature's isSelected property is TRUE
                    if (event.feature.getProperty('isSelected') === true) {
                        event.feature.setProperty('isSelected', false);
                        delete this.getSelectedFeatures[feature_id];
                        if (this.selection_limit !== undefined && this.selection_limit > 0) {
                            this.getSelectionCount = this.getSelectionCount - 1;
                        }
                        if (typeof setClickEffectCallback === "function") {
                            setClickEffectCallback(event.feature, false);
                        }
                    } else {
                        if (!this.selection_limit){
                            event.feature.setProperty('isSelected', true);
                            this.getSelectedFeatures[feature_id] = event.feature;
                        } else {
                            if (this.selection_limit > this.getSelectionCount) {
                                event.feature.setProperty('isSelected', true);
                                this.getSelectionCount = this.getSelectionCount + 1;
                                this.getSelectedFeatures[feature_id] = event.feature;
                            }
                        }
                        if (typeof setClickEffectCallback === "function") {
                            setClickEffectCallback(event.feature, true);
                        }
                    }
                });

                return this;
            };

            // This method adds the layer to a view
            this.layers[layer_name].on = function(view_object, layerOnCallback) {
                    view_object =  view_object || this.getLastView;
                    this.setMap(SCAPE_ROOT.views[this.getView]);
                    if (layerOnCallback !== undefined) {
                        layerOnCallback(this);
                    }
                return this;
            };

            // This method removes the layer from the view
            this.layers[layer_name].off = function(layerOffCallback) {
                var view = this.getMap();
                if (view !== undefined){
                    this.getLastView = view;
                    this.setMap(null);
                    if (layerOffCallback !== undefined) {
                        layerOffCallback(this);
                    }
                }
                return this;
            };

            // This METHOD authorizes and fetches a BigQuery request, then sends the returned data to be error checked
            // and parsed by an optionally specified sorting_function. If no such function is specified, use a default
            // one.
            this.layers[layer_name].setDataBigQuery = function (bigquery_config, sortingCallback, bigQueryCallback) {
                // do something only the first time the map is loaded

                    this.data = {};
                    this.data.getBqResults = [];
                    this.data.getDataset = [{}];
                    this.data.getDatasetOmitted = [{}];
                    this.data.getBqClientId = bigquery_config.bqClientId;
                    this.data.getBqProjectId = bigquery_config.bqProjectId;
                    this.data.getBqQueryString = bigquery_config.bqQueryString;
                    var that = this;
                    var gapi_config = {
                        auth: {
                            "client_id": this.data.getBqClientId,
                            'scope': ['https://www.googleapis.com/auth/bigquery'],
                            'immediate': true
                        },
                        client: {
                            'name': 'bigquery',
                            'version': 'v2'
                        },
                        query: {
                            'projectId': this.data.getBqProjectId,
                            'timeoutMs': '30000',
                            'query': this.data.getBqQueryString
                        }
                    };
                    SOCIOSCAPES_ROOT.getGapiAuth(gapi_config, function () {
                        that.data.request = gapi.client.bigquery.jobs.query(gapi_config.query);
                        that.data.request.execute(function (response) {
                            that.sortBigQuery(response, function(geostat_object){
                                geostat_object.setPrecision(6);
                            });
                        });
                    });
                return this;
            };

            // This METHOD is automatically called to parse the results of a bigQueryLoad request. Stores the parsed
            // data in arrays and appends a geostats instance ".geostats" to the layer upon which it is applied.
            this.layers[layer_name].sortBigQuery = function (response, sortBigQueryCallback){
                var that = this;
                response.result.rows.forEach (function(item) {

                    // Fetch the feature and attribute value for this geo_id
                    var geo_id = parseFloat(item.f[0].v);
                    var attribute_value = parseFloat(item.f[1].v);

                    // If a normalization column was specified, set the normalization attribute
                    if (that.data.normalization_column !== "") {
                        var normalization_value = parseFloat(item.f[2].v);
                    }

                    // Identify the feature that corresponds to this geo_id
                    var the_feature = that.getFeatureById(geo_id);

                    // If a feature DOES NOT exist for this geo_id, move to the next feature
                    if (the_feature === undefined) {
                        console.log("There is no geometry for this data point: " + attribute_value);

                        // If the feature DOES exist but the data is missing, do one of two things:
                    } else if (attribute_value === 0 || "" || !isFinite(attribute_value)) {

                        // For RAW measures...
                        if (that.data.normalization_column !== "") {
                            that.data.getDatasetOmitted.push({
                                "geo_id": geo_id,
                                "census_attribute": attribute_value
                            });
                            // For NORMALIZED measures...
                        } else {
                            that.data.getDatasetOmitted.push({
                                "geo_id": geo_id,
                                "census_attribute": attribute_value,
                                "census_normalization_attribute": normalization_value
                            });
                        }
                        console.log("There is no data for this geometry id: " + geo_id);

                        // If the feature and data BOTH EXIST, do one of two things:
                    } else {

                        // For RAW measures...
                        if (that.data.normalization_column !== "") {
                            the_feature.setProperty("census-attribute", attribute_value);
                            the_feature.setProperty("census-symbology-value", attribute_value);
                            that.data.getBqResults.push(attribute_value);
                            that.data.getDataset.push({
                                "geo_id": geo_id,
                                "census_attribute": attribute_value
                            });

                            // For NORMALIZED measures...
                        } else {

                            // Check to make sure the normalized value is valid, then save it...
                            var data_corruption_test = attribute_value / normalization_value;
                            if (isFinite(data_corruption_test)) {
                                the_feature.setProperty("census-normalization-attribute", normalization_value);
                                the_feature.setProperty("census-symbology-value", data_corruption_test);
                                that.data.getBqResults.push(data_corruption_test);
                                that.data.getDataset.push({
                                    "geo_id": geo_id,
                                    "census_attribute": attribute_value,
                                    "census_normalization_attribute": normalization_value,
                                    "normalized_attribute": data_corruption_test
                                });

                                // Otherwise, exclude it.
                            } else {
                                that.data.getDatasetOmitted.push({
                                    "geo_id": geo_id,
                                    "census_attribute": attribute_value,
                                    "census_normalization_attribute": normalization_value,
                                    "normalized_attribute": data_corruption_test
                                });
                                console.log("There was a problem with the normalization calculation for DA: " + geo_id + " (it works out to be " + data_corruption_test + " which doesn't make much sense. We've excluded it.");
                            }
                        }
                    }
                });
                this.geostats = new geostats(this.data.getBqResults);
                return this.geostats
            };

            // This METHOD classifies the data based on the requested style. This is a geostats wrapper.
            this.layers[layer_name].setClassifications = function (classifications_colour_scale, classifications_function_name, classifications_breaks, setClassificationsCallback) {
                    // Turn the layer off
                    var layer_map = this.getMap();
                    if (layer_map !== undefined) {
                        this.off();
                    }
                    this.classification_colour_scale = classifications_colour_scale || this.classification_colour_scale || "YlOrRd";
                    this.classification_function = classifications_function_name || this.classification_function || "getClassJenks";
                    this.classification_breaks = classifications_breaks || this.classification_breaks || 5;
                    this.classifications = this.geostats[this.classification_function](this.classification_breaks);
                    // Populate an array with the values that compose the data domain
                    this.domain = [];
                    this.breaks = this.classifications.length;
                    var i = 0;
                    while (i < this.breaks) {
                        this.domain.push(parseFloat(this.classifications[i]));
                        i++;
                    }

                    this.colour_scale = chroma.scale(this.classification_colour_scale).domain(this.domain).out('hex');
                    this.colour_scale_index = chroma.scale(this.classification_colour_scale).domain(this.domain, this.breaks).colors();

                    // Turn the layer back on
                    if (layer_map !== undefined) {
                        this.on(layer_map);
                    }
                return this;
            };

            // This METHOD sets the geometry colour rules
            this.layers[layer_name].setGeometryColours = function (geometry_colours_config) {
                    this.setStyle(function (feature) {
                        var geomtery_colours_config = geometry_colours_config || {};
                        var feature_attribute_value = feature.getProperty('census-symbology-value');
                        fill_colour = LAYER_ROOT.colour_scale(feature_attribute_value);
                        stroke_colour = "black";
                        if (geometry_colours_config !== undefined) {
                            stroke_colour = geometry_colours_config.stroke_colour_override;
                        }
                        LAYER_ROOT.getStyleOptionsDefault.fillOpacity = geomtery_colours_config.fillOpacity_default || LAYER_ROOT.getStyleOptionsDefault.fillOpacity;
                        LAYER_ROOT.getStyleOptionsDefault.fillColor = fill_colour;
                        LAYER_ROOT.getStyleOptionsDefault.strokeOpacity = geomtery_colours_config.strokeOpacity_default || LAYER_ROOT.getStyleOptionsDefault.strokeOpacity;
                        LAYER_ROOT.getStyleOptionsDefault.strokeColor = stroke_colour;
                        LAYER_ROOT.getStyleOptionsDefault.strokeWeight = geomtery_colours_config.strokeWeight_default || 0;
                        LAYER_ROOT.getStyleOptionsDefault.zIndex = geomtery_colours_config.zIndex_default || LAYER_ROOT.getStyleOptionsDefault.zIndex;
                        LAYER_ROOT.getStyleOptionsDefault.visible = geomtery_colours_config.visible_default || LAYER_ROOT.getStyleOptionsDefault.visible;
                        LAYER_ROOT.getStyleOptionsDefault.clickable = geomtery_colours_config.clickable_default || LAYER_ROOT.getStyleOptionsDefault.clickable;
                        LAYER_ROOT.getStyleOptionsHover.fillOpacity = geomtery_colours_config.fillOpacity_hover || LAYER_ROOT.getStyleOptionsHover.fillOpacity;
                        LAYER_ROOT.getStyleOptionsHover.fillColor = fill_colour;
                        LAYER_ROOT.getStyleOptionsHover.strokeOpacity = geomtery_colours_config.strokeOpacity_hover || LAYER_ROOT.getStyleOptionsHover.strokeOpacity;
                        LAYER_ROOT.getStyleOptionsHover.strokeColor = stroke_colour;
                        LAYER_ROOT.getStyleOptionsHover.strokeWeight = geomtery_colours_config.strokeWeight_hover || LAYER_ROOT.getStyleOptionsHover.strokeWeight;
                        LAYER_ROOT.getStyleOptionsHover.zIndex = geomtery_colours_config.zIndex_hover || LAYER_ROOT.getStyleOptionsHover.zIndex;
                        LAYER_ROOT.getStyleOptionsHover.visible = geomtery_colours_config.visible_hover || LAYER_ROOT.getStyleOptionsHover.visible;
                        LAYER_ROOT.getStyleOptionsHover.clickable = geomtery_colours_config.clickable_hover || LAYER_ROOT.getStyleOptionsHover.clickable;
                        LAYER_ROOT.getStyleOptionsClick.fillOpacity = geomtery_colours_config.fillOpacity_click || LAYER_ROOT.getStyleOptionsClick.fillOpacity;
                        LAYER_ROOT.getStyleOptionsClick.fillColor = fill_colour;
                        LAYER_ROOT.getStyleOptionsClick.strokeOpacity = geomtery_colours_config.strokeOpacity_click || LAYER_ROOT.getStyleOptionsClick.strokeOpacity;
                        LAYER_ROOT.getStyleOptionsClick.strokeColor = stroke_colour;
                        LAYER_ROOT.getStyleOptionsClick.strokeWeight = geomtery_colours_config.strokeWeight_click || LAYER_ROOT.getStyleOptionsClick.strokeWeight;
                        LAYER_ROOT.getStyleOptionsClick.zIndex = geomtery_colours_config.zIndex_click || LAYER_ROOT.getStyleOptionsClick.zIndex;
                        LAYER_ROOT.getStyleOptionsClick.visible = geomtery_colours_config.visible_click || LAYER_ROOT.getStyleOptionsClick.visible;
                        LAYER_ROOT.getStyleOptionsClick.clickable = geomtery_colours_config.clickable_click || LAYER_ROOT.getStyleOptionsClick.clickable;
                        export_options_default = {
                            fillOpacity: LAYER_ROOT.getStyleOptionsDefault.fillOpacity,
                            fillColor: LAYER_ROOT.getStyleOptionsDefault.fillColor,
                            strokeOpacity: LAYER_ROOT.getStyleOptionsDefault.strokeOpacity,
                            strokeColor: LAYER_ROOT.getStyleOptionsDefault.strokeColor,
                            strokeWeight: LAYER_ROOT.getStyleOptionsDefault.strokeWeight,
                            zIndex: LAYER_ROOT.getStyleOptionsDefault.zIndex,
                            visible: LAYER_ROOT.getStyleOptionsDefault.visible,
                            clickable: LAYER_ROOT.getStyleOptionsDefault.clickable
                        };
                        export_options_hover = {
                            fillOpacity: LAYER_ROOT.getStyleOptionsHover.fillOpacity,
                            fillColor: LAYER_ROOT.getStyleOptionsHover.fillColor,
                            strokeOpacity: LAYER_ROOT.getStyleOptionsHover.strokeOpacity,
                            strokeColor: LAYER_ROOT.getStyleOptionsHover.strokeColor,
                            strokeWeight: LAYER_ROOT.getStyleOptionsHover.strokeWeight,
                            zIndex: LAYER_ROOT.getStyleOptionsHover.zIndex,
                            visible: LAYER_ROOT.getStyleOptionsHover.visible,
                            clickable: LAYER_ROOT.getStyleOptionsHover.clickable
                        };
                        export_options_click = {
                            fillOpacity: LAYER_ROOT.getStyleOptionsClick.fillOpacity,
                            fillColor: LAYER_ROOT.getStyleOptionsClick.fillColor,
                            strokeOpacity: LAYER_ROOT.getStyleOptionsClick.strokeOpacity,
                            strokeColor: LAYER_ROOT.getStyleOptionsClick.strokeColor,
                            strokeWeight: LAYER_ROOT.getStyleOptionsClick.strokeWeight,
                            zIndex: LAYER_ROOT.getStyleOptionsClick.zIndex,
                            visible: LAYER_ROOT.getStyleOptionsClick.visible,
                            clickable: LAYER_ROOT.getStyleOptionsClick.clickable
                        };

                        var export_options = export_options_default;
                        if (feature.getProperty('isSelected')) {
                            export_options = export_options_click;
                        } else if (feature.getProperty('hover')) {
                            export_options = export_options_hover;
                        }
                        return /** @type {google.maps.Data.StyleOptions} */(export_options);
                    });
                return this;
            };

            // This METHOD creates a datatable
            this.layers[layer_name].setDatatable = function (datatable_column_names) {
                var columns_includeds = [];
                var columns_excludeds = [];

                var i = 0;
                var no_of_cols = datatable_column_names.includeds.length;
                while (i < arguments.length) {
                    columns_includeds.push({"data": arguments[i]});
                    i++;
                }

                var i = 0;
                var no_of_cols = datatable_column_names.includeds.length;
                while (i < arguments.length) {
                    columns_includeds.push({"data": arguments[i]});
                    i++;
                }

                if ($.fn.dataTable.isDataTable(datatable_includeds_div)) {
                    LAYER_ROOT.data.datatable = $(datatable_includeds_div).DataTable();
                    LAYER_ROOT.data.datatable_excludeds = $(datatable_excludeds_div).DataTable();
                } else {
                    $(datatable_includeds_div).dataTable({
                        "data": LAYER_ROOT.data.getDataset,
                        "columns": columns
                    });

                    $(datatable_excludeds_div).dataTable({
                        "data": LAYER_ROOT.data.getDatasetOmitted,
                        "columns": columns
                    });
                }
            return this;
            };

            // Set the default layer style
            this.layers[layer_name].addListener('addfeature', function(event) {
                this.setStyle(function(feature) {
                    var export_options = LAYER_ROOT.export_options_default;
                    if (feature.getProperty('isSelected')) {
                        export_options = LAYER_ROOT.export_options_click;
                    } else if (feature.getProperty('hover')) {
                        export_options = LAYER_ROOT.export_options_hover;
                    }
                    return /** @type {google.maps.Data.StyleOptions} */(export_options);
                });
            });

            if (gMapLayerCallback !== undefined){
                gMapLayerCallback(this.layers[layer_name]);
            }
            return this.layers[layer_name];
        };
        return this[scape];
    };
}
var testing = function (bqClientId) {

    bqClientId = (bqClientId) ? bqClientId:'424138972496-tneu947741ib22jh0dlnqpp400q2ps36.apps.googleusercontent.com';
    bqProjectId = '424138972496';
    mo = new SOCIOSCAPES();
        mo  .setScape('soci')
            .setViewGmap('tdot', 'Toronto, Canada', 'map-canvas')
            .setLayerGmap('pop', 'tdot', 'DAUID', 'http://storage.googleapis.com/socioscapesgis/geojson/torontocmadas.geojson.gz')
            .setDataBigQuery({
                    bqClientId: bqClientId,
                    bqProjectId: bqProjectId,
                    bqQueryString: "SELECT COL0, COL5, COL8 FROM socioscapesgis:census.2011shortform WHERE (REGEXP_MATCH(COL0, '^3518') OR REGEXP_MATCH(COL0, '^3519') OR REGEXP_MATCH(COL0, '^3520') OR REGEXP_MATCH(COL0, '^3521') OR REGEXP_MATCH(COL0, '^3524') OR REGEXP_MATCH(COL0, '^3543')) AND (LENGTH(COL0) > 4) ORDER BY COL0 ASC;" })


};

var testing2 = function(){
    mo.soci.layers.pop.setClassifications()
        .setGeometryColours()
        .setHoverEffect()
        .setClickEffect(3)
        .on();
};
