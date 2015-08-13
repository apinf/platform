// Creates variable that can be used in both .rendered and .created
Template.map.rendered = function() {

  var self = this;

  var input = {
    index : "api-umbrella-logs-v1-2015-07",
    type  : "log",
    limit : 1000,
    query : {
      match_all: {}
    }
  };

  self.getMapData(input);
  self.drawMap();
};

Template.map.created = function() {

  var self = this;
  self.mapData = new ReactiveVar();

  self.drawMap = function () {

    // Creates the map with the view coordinates of 61.5, 23.7667 and the zoom of 6
    var map = L.map('map').setView([61.5000, 23.7667], 4);

    // adds tilelayer
    var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    // Defines the intensity for the heatmap
    var intensity = 100;

    var addressPoints = self.mapData.get();

    // adds the heatpoints to the map
    var heat = L.heatLayer(addressPoints).addTo(map);

  };

  self.getMapData = function (input) {

    // Empty array for addressPoints
    var addressPoints = [];

    // Gets data from the ElasticSearch
    Meteor.call("getChartData", input, function(err, data) {
      var items = data.hits.hits;
      //loops throught the array of objects
      items.forEach(function(item) {
        try{
          addressPoints.push([item._source.request_ip_location.lat, item._source.request_ip_location.lon, intensity])
        }catch(e){
          console.log("err");
        }

        self.mapData.set(addressPoints);

      });
    });

  }

}
