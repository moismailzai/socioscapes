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
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? arguments[arguments.length - 1]:function(result) { return result;},
        dom,
        LayerHack;
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
    callback(myMap);
    return myMap;
};