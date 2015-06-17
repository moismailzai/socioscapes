'use strict';
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