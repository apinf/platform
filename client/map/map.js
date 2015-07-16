// Creates variable that can be used in both .rendered and .created
var drawMap;

Template.map.rendered = function() {
  drawMap();
}

Template.map.created = function() {
  drawMap = function () {
    // Creates the map with the view coordinates of -37.87, 175.475 and the zoom of 12
    var map = L.map('map').setView([-37.87, 175.475], 12);

    // adds tilelayer
    var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
      id: 'examples.map-20v6611k'
    }).addTo(map);

    // For temporary use to create some heat.
    var density = 1000;
    var addressPoints =  [[-37.9113666167, 175.4664507833, density],
                          [-37.9117068333, 175.466336, density],
                          [-37.9114338333, 175.4666576, density]]

    // adds the heatpoints to the map
    var heat = L.heatLayer(addressPoints).addTo(map);

  }
}
