// draw map
var map = L.map('map').setView([28.60259692686176, -81.19946981796008], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function(data) {

    
    L.geoJson(data, {

        pointToLayer: function(feature) {
            // Customize the circle marker style based on magnitude
            return L.circleMarker(feature.geometry.coordinates, {
                radius: feature.properties.mag * 1.5,
                fillColor: getColor(feature.geometry.coordinates[2]), 
                color: '#000',
                weight: 1,
                opacity: 0.6,
                fillOpacity: 0.8
            });
        },

        onEachFeature: function(feature, layer) {
            
            layer.bindPopup(`
            <h1>${feature.properties.place}</h1>
            <hr>
            <h2>Magnitude: ${feature.properties.mag}</h2>
            <h2>Depth: ${feature.geometry.coordinates[2]}</h2>
            <strong>Time:</strong> ${new Date(feature.properties.time)}
            `);
        
        }

    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    // Add legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
                div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }

        return div;
    };
    
    legend.addTo(map)

})


function getColor(depth) {

    return depth >= 90 ? '#FE1F23' :
           depth >= 70 ? '#FF8E28' :
           depth >= 50 ? '#FEC627' :
           depth >= 30 ? '#F0FF39' :
           depth >= 10 ? '#85F928' :
           '#28E700';
}