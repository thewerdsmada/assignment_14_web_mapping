// Link to the shake data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

function markerSize(mag) {
  return mag * 20000;
}

function markerColor(mag) {
  if (mag <= 1) {
    return "#FFFAFA";
  } else if (mag <= 2) {
    return "FAEBD7";
  } else if (mag <= 3) {
    return "#FFD700";
  } else if (mag <= 4) {
    return "#FF8C00";
  } else if (mag <= 5) {
    return "#EE0000";
  } else {
    return "#EE1289";
  };
}

// get the data and send it
d3.json(link, function (data) {
  mapthisbadboy(data.features);
});

function mapthisbadboy(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
    // Do the popups
    onEachFeature: function (feature, layer) {

      layer.bindPopup("<h1>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> How Shakey was it: " + feature.properties.mag + "</p>")
    }, pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {
          radius: markerSize(feature.properties.mag),
          color: "black",
          weight: .5,
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: .9,
        })
    }
  });



  // SEND IT to the map
  MapTime(earthquakes);
}

function MapTime(earthquakes) {

  // Define satelitemap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satelightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Do all the layers
  var baseMaps = {
    "Light Map": lightmap,
    "Satelite Map": satelightmap
  };
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  var mmmmmmmMap = L.map("map", {
    center: [38.3334178, -97.7635407],
    zoom: 4.5,
    layers: [lightmap, earthquakes]
  });

  // Finish the Mappings


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(mmmmmmmMap);

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
    }

    return div;
  };

  legend.addTo(mmmmmmmMap);

}