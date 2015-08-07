Template.chartsLayout.rendered = function () {

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
      'request_path'
    ]
  };
  // Drawing the chart
  drawChart(input)
};

Template.chartsLayout.created = function () {

  // function that sets chart data to be available in template
  drawChart = function (input) {

    Meteor.call("getChartData", input, function (err, data) {

      // error checking
      if (err) {

        // removing loading state once loaded
        $('#loadingState').html("Loaded");
        alert("Data is not found!");

      } else {
        // Parse the returned data for DC
        var parsedData = parseData(data);

        // Render the charts using parsed data
        renderCharts(parsedData);

      }
    });
  };

  // function that parses chart data
  parseData = function (data) {
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
  }

  renderCharts = function (parsedData) {

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
      .width(1140)
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
      .width(1140)
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
      .width(1140)
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
    };

    // Add each chart to the DC Chart Registry
    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
      var chartI = dc.chartRegistry.list()[i];
      chartI.on("filtered", RefreshTable);
    }

    // Parse data into array for chart
    function setUpDataSet() {
      var dataSet = [];
      timeStampDimension.top(Infinity).forEach(function (e) {

        var country;
        var path;
        var request_ip;
        var response_time;

        // Error handling for empty fields
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
          request_ip = e.fields.request_ip[0];
        }catch(e){
          request_ip = "";
        }

        try{
          response_time = e.fields.response_time[0];
        }catch(e){
          response_time = "";
        }

        dataSet.push({
          "time"          : e.fields.request_at[0],
          "country"       : country,
          "path"          : path,
          "ip"            : request_ip,
          "response"      : response_time
        });
      });
      return dataSet;
    }

    RefreshTable();

    // removing loading state once loaded
    $('#loadingState').html("Loaded! Took <b>" + took + "</b>ms");
    dc.renderAll();
  };
};
