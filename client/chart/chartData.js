Template.lineChart.rendered = function () {

  // appending loading state
  $('#loadingState').html("Loading...");

  // getting current month and year -> providing them for initial query
  var currentYearAndMonth = moment().format("YYYY-MM");

  var input = {
    index : "api-umbrella-logs-v1-"+currentYearAndMonth,
    type  : "log",
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
          .width(570)
          .height(250)
          .dimension(countryDimension)
          .group(totalCountries)
          .centerBar(false)
          .gap(5)
          .elasticY(true)
          .x(countryScale)
          .xUnits(dc.units.ordinal)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .yAxis();

        // removing loading state once loaded
        $('#loadingState').html("Loaded");

        dc.renderAll();

      }
    });
  }

};
