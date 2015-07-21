Template.lineChart.rendered = function () {

  // appending loading state
  $('#loadingState').html("Loading...");

  // getting current month and year -> providing them for initial query
  var currentYearAndMonth = moment().format("YYYY-MM");

  var input = {
    index : "",
    type  : "",
    limit : 10000,
    query : {
      match_all: {}
    }
  };

  drawChart(input);
};

Template.lineChart.created = function () {

  drawChart = function (input) {

    Meteor.call("getChartData", input, function (err, data) {
      if (err) {

        // removing loading state once loaded
        $('#loadingState').html("Loaded");
        alert("Data is not found!");

      } else {

        var items = data.hits.hits;

        var index = new crossfilter(items);

        var dateFormat = d3.time.format.iso;
        items.forEach(function (d) {

          var timeStamp = moment(d._source.request_at);
          timeStamp = timeStamp.format();
          d.ymd = dateFormat.parse(timeStamp);
          d.itemsCount = +data.hits.total;

        });

        var timeStampDimension = index.dimension(function(d){ return d.ymd; });
        var countryDimension = index.dimension(function (d) { return d._source.request_ip_country });

        var timeStampGroup = timeStampDimension.group();
        var countryGroup = countryDimension.group();
        var all = index.groupAll();

        dc.dataCount("#row-selection")
          .dimension(index)
          .group(all);

        var totalCountries = countryGroup.reduceSum(function(d) {
          return d.itemsCount;
        });

        var minDate = d3.min(items, function(d) { return d.ymd; });
        var maxDate = d3.max(items, function(d) { return d.ymd; });

        var timeScale = d3.time.scale().domain([minDate, maxDate]);
        var countryScale = d3.scale.ordinal().domain(countryDimension);

        var chart = dc.lineChart("#line-chart");
        var countryChart = dc.barChart("#bar-chart");
        var dataTable = dc.dataTable("#data-table");

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

        dataTable.width(960).height(800)
          .dimension(timeStampDimension)
          .group(function(d) { return "Logs"
          })
          .size(100)							// number of rows to return
          .columns([
            function(d) { return d.ymd; },
            function(d) { return d._source.request_ip; },
            function(d) { return d._source.response_time; },
            function(d) { return d._source.request_ip_country; }
          ])
          .sortBy(function(d){ return -d.ymd; })
          .order(d3.ascending);

        // removing loading state once loaded
        $('#loadingState').html("Loaded");

        dc.renderAll();

      }
    });
  }

};
