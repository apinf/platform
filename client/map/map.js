// Creates variable that can be used in both .rendered and .created
var drawMap;
Template.map.rendered = function() {
  var input = {
    index : "api-umbrella-logs-v1-2015-07",
    type  : "log",
    limit : 100000,
    query : {
      match_all: {}
    }
  };
  drawMap(input);
}
Template.map.created = function() {
  drawMap = function (input) {

    // Creates the map with the view coordinates of 61.5, 23.7667 and the zoom of 6
    var map = L.map('map').setView([61.5, 23.7667], 6);

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

    // Gets data from the ElasticSearch
    Meteor.call("getChartData", input, function(err, data) {
      var items = data.hits.hits;
      //loops throught the array of objects
      items.forEach(function(item) {
            addressPoints.push([item._source.request_ip_location.lat, item._source.request_ip_location.lon, density, blur])
      });
    });

    // adds the heatpoints to the map
    var heat = L.heatLayer(addressPoints).addTo(map);
  }
}
