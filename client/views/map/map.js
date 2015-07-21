// Creates variable that can be used in both .rendered and .created
Template.map.rendered = function() {
  /*  var input = {
    index : "api-umbrella-logs-v1-2015-07",
    type  : "log",
    limit : 100000,
    query : {
      match_all: {}
    }
  };*/

  var input = [
    [-37.8839, 175.3745188667, "571"],
    [-37.8869090667, 175.3657417333, "486"],
    [-37.8894207167, 175.4015351167, "807"],
    [-37.8927369333, 175.4087452333, "899"],
    [-37.90585105, 175.4453463833, "1273"],
    [-37.9064188833, 175.4441556833, "1258"],
    [-37.90584715, 175.4463564333, "1279"],
    [-37.9033391333, 175.4244005667, "1078"],
    [-37.9061991333, 175.4492620333, "1309"],
    [-37.9058955167, 175.4445613167, "1261"],
    [-37.88888045, 175.39146475, "734"],
    [-37.8950811333, 175.41079175, "928"]
  ]



  drawMap(input);
}
Template.map.created = function() {
  drawMap = function (input) {

    // Creates the map with the view coordinates of 61.5, 23.7667 and the zoom of 6
    var map = L.map('map').setView([-37.8839, 175.3745188667], 6);

    // adds tilelayer
    var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
      id: 'examples.map-20v6611k'
    }).addTo(map);

    // Empty array for addressPoints
    var addressPoints = [];

    // Defines the density for the heatmap
    var density = 1000;
    var blur = 5;

/*
    // Gets data from the ElasticSearch
    Meteor.call("getChartData", input, function(err, data) {
      var items = data.hits.hits;
      //loops throught the array of objects
      items.forEach(function(item) {
        addressPoints.push([item._source.request_ip_location.lat, item._source.request_ip_location.lon, density, blur])
      });
    });
*/

    // adds the heatpoints to the map
    var heat = L.heatLayer(input).addTo(map);
  }
}
