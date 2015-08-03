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
    query : {
      match_all: {}
    },
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

        var parsedData = parseData(data);
        renderCharts(parsedData);

      }
    });
  };

  // function that parses chart data
  parseData = function (data) {

    var items = data.hits.hits;

    var index = new crossfilter(items);
    var dateFormat = d3.time.format.iso;
    items.forEach(function (d) {

      // Parsing timestamp to ISO format
      var timeStamp = moment(d.fields.request_at[0]);
      timeStamp = timeStamp.format();
      d.fields.ymd = dateFormat.parse(timeStamp);
      d.fields.itemsCount = +data.hits.total;

    });

    var timeStampDimension = index.dimension(function(d){ return d.fields.ymd; });
    var countryDimension = index.dimension(function (d) { return d.fields.request_ip_country });

    var timeStampGroup = timeStampDimension.group();
    var countryGroup = countryDimension.group();
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

    var timeScale = d3.time.scale().domain([minDate, maxDate]);
    var countryScale = d3.scale.ordinal().domain(countryDimension);

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

    chart
      .width(1140)
      .height(480)
      .elasticX(true)
      .x(timeScale)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .renderArea(true)
      .dotRadius(3)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true);

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


