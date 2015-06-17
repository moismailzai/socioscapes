'use strict';
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