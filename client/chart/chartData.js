Template.chartLayout.rendered = function () {
  this.drawChart()
};

Template.chartLayout.created = function () {
  this.drawChart = function () {
    Meteor.call("getChartData", function (err, response) {
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
