Template.chartLayout.rendered = function () {

  // TODO: dynamic input data
  var data = {
    index : "api-umbrella-logs-v1-2015-07",
    type  : "log",
    limit : 1000,
    query : {
      match_all: {}
    }
  };

  this.drawChart(data);
};

Template.chartLayout.created = function () {
  this.drawChart = function (data) {

    Meteor.call("getChartData", data, function (err, response) {
      if (err) {

        dataArr.set(err)

      } else {

        var lineChart = {
          labels : response.labels,
          datasets : [
            {
              label: "apiUmbrellaAnalytics for July 2015",
              fillColor : "rgba(33,150,243,.7)",
              strokeColor : "rgba(220,220,220,1)",
              pointColor : "rgba(220,220,220,1)",
              pointStrokeColor : "#fff",
              pointHighlightFill : "#fff",
              pointHighlightStroke : "rgba(220,220,220,1)",
              data : response.values
            }
          ]
        };

        var ctx = document.getElementById("canvasChart").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChart, {
          responsive: true
        });
      }
    });
  }
};
