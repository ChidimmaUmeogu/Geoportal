// liberies to work with:
/**
 * leaflet plugins: https://leafletjs.com/plugins.html
 * Advanced geospatial analysis for browsers and Node.js: http://turfjs.org/
 * Google map APIs: https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
 * convert shapefile to geojason: https://mapshaper.org/
 * styles: https://web.archive.org/web/20160804043852/https://www.mapbox.com/tilemill/docs/guides/styling-lines/
 * Geojson layers: https://leafletjs.com/reference.html#geojson 
 * 
 */
// Initialize Map; https://leafletjs.com/examples/quick-start/
var map = L.map('map').setView([7.0, -1.09], 6.5);

// Add OSM tile layer to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add Google maps to the map; 
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Add marker to map
var marker = L.marker([7.0, -1.09]).addTo(map);

// Add Geojson layers

// Region Layer Style
var regionStyle = {
color : "black",
opacity: 0.2,
weight: 3.5,
dashArray: "5 2 4",
dashOffset: 3,
fillColor: "green",
fillOpacity: 0.2
}
var regionlayer = L.geoJson(region,{
    style:regionStyle,
    onEachFeature:function (feature, layer) {
        layer.bindPopup(feature.properties.region)
    }

})
//.addTo(map)

// Adding more than two layer properties


var regionlayer = L.geoJson(region,{
    style:regionStyle,
    onEachFeature:function (feature, layer) {
        // To calculate the area of the region
        area = (turf.area(feature)/1000000).toFixed(3)

         /** To extract the coordinate of the center;
         *  1. inspect using console.log(center)
         * understand the property attributes and hierachy: property>geometry>coordinates 
         */
        center_lng = turf.center(feature).geometry.coordinates[0].toFixed(3) 
        center_lat = turf.center(feature).geometry.coordinates[1].toFixed(3)


        label = `Name: ${feature.properties.region} <br>`
        label+= `Code: ${feature.properties.reg_code} <br>`
        label+= `Area: ${area} <br>`
        label+= `Center: ${center_lng}, ${center_lat} <br>`
        
        layer.bindPopup(label)
    }

}).addTo(map)

// Health Facility layer style
var healthStyle = {
    radius: 5,
    fillColor: "red",
    color: "grey",
    weight: 1
}

var healthfacilitylayer = L.geoJson(healthfacility,{
    pointToLayer:function(feature, latlng) {
        return L.circleMarker(latlng,healthStyle);
    }
})
//.addTo(map)

// Railway Layer Style
var railStyle = {
stroke: "false",
color: "black",
weight: 3,
lineCap: "round",
lineJoin: "miter",
dashArray: "5 2 2",
hatch: 4,
dashOffset: "2"
}
  
var railwaylayer = L.geoJson(railway,{
    style:railStyle,
    onEachFeature:function (feature, layer) {
        layer.bindPopup(feature.properties.NAME)
    }
})
//.addTo(map)


// Adding WMS Layers
// WMS River
var riverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatialdev/wms", {
    layers: 'geospatialdev:Ghana Waterbodies',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

// WMS Treecover
var treecoverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatialdev/wms", {
    layers: 'geospatialdev:Tree Cover',
    format: 'image/png',
    transparent: true,
    attribution: ""
})//.addTo(map)

// WMS Healthsites
var healthsitesWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatialdev/wms", {
    layers: 'geospatialdev:Ghana Health Facilities',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

// WMS POIs
var poisWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatialdev/wms", {
    layers: 'geospatialdev:Ghana POIs',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

// WMS Railway tracks
var railwaytracksWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatialdev/wms", {
    layers: 'geospatialdev:Ghana Railway Tracks',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

// Basemaps
var baseLayers = {
    "OpenStreetMap": osm,
    "Google Street": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain,
};

// GeoJson Layers
var overlays = {
    "Marker": marker,
    "Regions": regionlayer,
    "Health Facilities": healthfacilitylayer,
    "Railway Lines": railwaylayer,
    "POIs": poisWMS,
    "Rivers": riverWMS,
    "Railway Tracks": railwaytracksWMS,
    "Health Sites": healthsitesWMS,
    "Tree Cover": treecoverWMS
};

// WMS Layers
/*var wmslayer = {
    "POIs": poisWMS,
    "Rivers": riverWMS,
    "Railway Tracks": railwaytracksWMS,
    "Health Sites": healthsitesWMS,
    "Tree Cover": treecoverWMS
};*/


// Add layer control to map
L.control.layers(baseLayers, overlays, {sortLayers:true}).addTo(map);

// Add leaflet browser print control to map
L.control.browserPrint({position: 'topleft'}).addTo(map);

// Add coordinate points on mouse move; .toFixed(3) is used for approximation
map.on("mousemove", function (e) {
            
    $("#latlong").html(`Lat: ${e.latlng.lat.toFixed(3)} , Long: ${e.latlng.lng.toFixed(3)}`)
    
});



// Add scale bar to the map
L.control.scale({ position: "bottomleft" }).addTo(map);

// Change default position of zoom control
/*map.zoomControl.setPosition("topright")*/

