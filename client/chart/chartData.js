var drawChart;

Template.chartLayout.rendered = function () {

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

Template.chartLayout.created = function () {

  drawChart = function (input) {

    Meteor.call("getChartData", input, function (err, data) {
      if (err) {

        console.log(err)

      } else {

        var items = data.hits.hits;

        var index = new crossfilter(items);

        var dateFormat = d3.time.format.iso;
        items.forEach(function (d) {

          var stamp = moment(d._source.request_at);
          stamp = stamp.format();
          d.ymd = dateFormat.parse(stamp);
          d.itemsCount =+ data.hits.total;

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

        var chart = dc.lineChart("#lineChart");
        var countryChart = dc.barChart("#barChart");

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
          .x(d3.scale.ordinal().domain(countryDimension))
          .dimension(countryDimension)
          .group(totalCountries)
          .centerBar(false)
          .gap(5)
          .elasticY(true)
          .xUnits(dc.units.ordinal)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true);

        dc.renderAll();

      }
    });
  }

};

Template.chartLayout.events({
  "submit #filtering" : function(e){
    e.preventDefault();

    var month = e.target.month.value;
    var year  = e.target.year.value;
    var limit = e.target.limit.value;

    var input = {
      index : "api-umbrella-logs-v1-"+year+"-"+month,
      type  : "log",
      limit : limit,
      query : {
        match_all: {}
      }
    };

    drawChart(input)
  }
});

