// Creates variable that can be used in both .rendered and .created
var drawMap;

Template.map.rendered = function() {
  var input = {
    index : "api-umbrella-logs-v1-2015-07",
    type  : "log",
    limit : 10000,
    query : {
      match_all: {}
    }
  };
  drawMap(input);
}

Template.map.created = function() {
  drawMap = function (input) {
    // Creates the map with the view coordinates of -37.87, 175.475 and the zoom of 12

    var map = L.map('map').setView([-37.87, 175.475], 12);

    // adds tilelayer
    var tiles = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
      attribution: '<a href="https://www.mapbox.com/about/maps/">Terms and Feedback</a>',
      id: 'examples.map-20v6611k'
    }).addTo(map);

    var addressPoints = [];
    var density = 5;

    Meteor.call("getChartData", input, function(err, data) {

      // for debugging
      if(err) {
        console.log("here is an error!!!:" + err);
      } else {

        console.log("Everything is fine bois!");

        var items = data.hits.hits;
        console.log(items)

        var counter = 0;

        items.forEach(function(item) {
          //;
          if(item._source.request_ip_location){
            try{
              addressPoints.push([item._source.request_ip_location.lat, item._source.request_ip_location.lon, density])
            }catch(err){
              consol.log('err' + err)
            }
          }

        });


      }



    });

    console.log(addressPoints);

    /*
    var addressPoints =  [[-37.9113666167, 175.4664507833, density],
                          [-37.9117068333, 175.466336, density],
                          [-37.9114338333, 175.4666576, density]]
*/


    // adds the heatpoints to the map
    var heat = L.heatLayer(addressPoints).addTo(map);


  }
}
