

Template.chartsLayout.rendered = function () {

  var instance = this;

  // appending loading state
  $('#loadingState').html("Loading...");

  // getting current month and year -> providing them for initial query
  var currentYearAndMonth = moment().format("YYYY-MM");
  var initialLimit = 10000;

  var input = {
    index : "api-umbrella-logs-v1-"+currentYearAndMonth,
    type  : "log",
    limit : initialLimit,
    fields: [
      'request_at',
      'request_ip_country',
      'request_ip',
      'response_time',
      'request_path',
      'request_ip_location.lon',
      'request_ip_location.lat'
    ]
  };

  // get data
  instance.getDashboardData(input);

  // render map
  instance.renderMap();

  instance.autorun(function () {

    //instance.map.removeLayer(instance.heat);

    console.log("Autorun ->");

    // dashboard data from reactive variable
    var mapData = instance.mapData.get();

    if (typeof mapData === 'object') {

      console.log(mapData);

      // create heat layer
      instance.heatLayer = L.heatLayer(mapData);

      // adds heat to map
      instance.heatLayer.addTo(instance.map);

    }

  });


};

Template.chartsLayout.created = function () {

  var instance = this;

  instance.mapData       = new ReactiveVar("No data");

  // function that sets chart data to be available in template
  instance.getDashboardData = function (input) {

    Meteor.call("getChartData", input, function (err, data) {

      // error checking
      if (err) {

        // removing loading state once loaded
        $('#loadingState').html("Loaded");
        alert("Data is not found!");

      } else {

        // Parse the returned data for DC
        var parsedChartData = instance.parseChartData(data);

        var parsedMapData   = instance.parseMapData(data);

        instance.mapData.set(parsedMapData);

        // Render the charts using parsed data
        instance.renderCharts(parsedChartData);

      }
    });
  };

  // function that parses chart data
  instance.parseChartData = function (data) {
    // Get chart data from within data object
    var items = data.hits.hits;

    // Create CrossFilter index using chart data
    var index = new crossfilter(items);

    // Create ISO date format
    var dateFormat = d3.time.format.iso;

    // Parse each item adding timestamp as YMD and count the items
    items.forEach(function (d) {
      // Parse timestamp to Moment .jsobject
      var timeStamp = moment(d.fields.request_at[0]);

      // Format the timestamp using Moment.js format method
      timeStamp = timeStamp.format();

      // Add YMD field to item
      d.fields.ymd = dateFormat.parse(timeStamp);

      // Add item count from total hits
      d.fields.itemsCount = +data.hits.total;
    });

    // Create timestamp dimension from YMD field
    var timeStampDimension = index.dimension(function(d){ return d.fields.ymd; });

    // Create country dimension from Request IP Country field
    var countryDimension = index.dimension(function (d) { return d.fields.request_ip_country });

    // Group entries by timestamp dimension
    var timeStampGroup = timeStampDimension.group();

    // Group entries by country
    var countryGroup = countryDimension.group();

    // Create index by all dimensions
    var all = index.groupAll();

    // Providing information about current data selection
    dc.dataCount("#row-selection")
      .dimension(index)
      .group(all);

    // total amount of countries within filtering
    var totalCountries = countryGroup.reduceSum(function(d) {
      return d.fields.itemsCount;
    });

    // set up a range of dates for charts
    var minDate = d3.min(items, function(d) { return d.fields.ymd; });
    var maxDate = d3.max(items, function(d) { return d.fields.ymd; });

    // Create time scale from min and max dates
    var timeScale = d3.time.scale().domain([minDate, maxDate]);

    // Create country scale from country dimension
    var countryScale = d3.scale.ordinal().domain(countryDimension);


    // Return object with all key values created above
    return {
      timeStampDimension  : timeStampDimension,
      countryDimension    : countryDimension,
      timeStampGroup      : timeStampGroup,
      countryGroup        : countryGroup,
      totalCountries      : totalCountries,
      timeScale           : timeScale,
      countryScale        : countryScale,
      took                : data.took
    };
  };

  instance.renderCharts = function (parsedData) {

    var timeStampDimension  = parsedData.timeStampDimension;
    var countryDimension    = parsedData.countryDimension;
    var timeStampGroup      = parsedData.timeStampGroup;
    var countryGroup        = parsedData.countryGroup;
    var totalCountries      = parsedData.totalCountries;
    var timeScale           = parsedData.timeScale;
    var countryScale        = parsedData.countryScale;
    var took                = parsedData.took;

    var chart = dc.lineChart("#line-chart");
    var countryChart = dc.barChart("#bar-chart");
    var overview = dc.barChart("#overview-chart");

    chart
      .height(480)
      .transitionDuration(1500)
      .elasticY(true)
      .x(timeScale)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .mouseZoomable(true)
      .rangeChart(overview)
      .renderArea(true)
      .dotRadius(3)
      .brushOn(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true);

    overview
      .height(40)
      .margins({top: 0, right: 50, bottom: 20, left: 40})
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .centerBar(true)
      .gap(1)
      .x(timeScale)
      .alwaysUseRounding(true)
      .yAxis().ticks(0);

    countryChart
      .height(250)
      .dimension(countryDimension)
      .group(totalCountries)
      .x(countryScale)
      .xUnits(dc.units.ordinal)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true);


    // Creates Dynatable
    var dynatable = $('#dc-data-table').dynatable({
      features: {
        pushState: false
      },
      dataset: {
        records: setUpDataSet(),
        perPageDefault: 10,
        perPageOptions: [10, 20, 50, 100]
      }
    }).data('dynatable');

    // Listens to filtering event and refreshes the table on a change
    function RefreshTable() {
      dc.events.trigger(function () {
        dynatable.settings.dataset.originalRecords = setUpDataSet();
        dynatable.process();
      });
    }

    // Add each chart to the DC Chart Registry
    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
      var chartI = dc.chartRegistry.list()[i];
      chartI.on("filtered", RefreshTable);
    }

    // Parse data into array for chart
    function setUpDataSet() {
      var dataSet = [];
      timeStampDimension.top(Infinity).forEach(function (e) {

        var timeStamp;
        var country;
        var path;
        var requestIp;
        var responseTime;

        // Error handling for empty fields
        try{
          timeStamp = e.fields.request_at[0];
        }catch(e){
          timeStamp = "";
        }

        try{
          country = e.fields.request_ip_country[0]
        }catch(e){
          country = "";
        }

        try{
          path = e.fields.request_path[0];
        }catch(e){
          path = "";
        }

        try{
          requestIp = e.fields.request_ip[0];
        }catch(e){
          requestIp = "";
        }

        try{
          responseTime = e.fields.response_time[0];
        }catch(e){
          responseTime = "";
        }

        dataSet.push({
          "time"          : timeStamp,
          "country"       : country,
          "path"          : path,
          "ip"            : requestIp,
          "response"      : responseTime
        });
      });

      return dataSet;
    }


    RefreshTable();

    // removing loading state once loaded
    $('#loadingState').html("Loaded! Took <b>" + took + "</b>ms");
    dc.renderAll();
  };

  instance.renderMap = function (mapData) {

    // Creates the map with the view coordinates of 61.5, 23.7667 and the zoom of 6
    instance.map = L.map('map').setView([61.5000, 23.7667], 4);

    // adds tilelayer
    var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(instance.map);


    // Defines the intensity for the heatmap
    var intensity = 100;

    if (mapData) {
      // adds the heatpoints to the map
      instance.heat = L.heatLayer(mapData).addTo(instance.map);
    }


  };

  instance.parseMapData = function (data) {

    var mapData = data.hits.hits;

    var intensity = 100;
    var addressPoints = [];

    mapData.forEach(function (item) {

      try{

        addressPoints.push([item.fields["request_ip_location.lat"][0], item.fields["request_ip_location.lon"][0], intensity])

      }catch(e){
        console.log("not found");
      }

    });

    console.log(addressPoints)

    return addressPoints;
  };

};
