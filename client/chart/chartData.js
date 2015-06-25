Template.chartLayout.rendered = function () {
  this.drawChart()
};

Template.chartLayout.created = function () {
  this.drawChart = function () {
    Meteor.call("getChartData", function (err, response) {
      if (err) {

        dataArr.set(err)

      } else {

        var thisData = response;

        var lineChart = {
          labels : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          datasets : [
            {
              label: "apiUmbrellaAnalytics for December 2014",
              fillColor : "rgba(33,150,243,.7)",
              strokeColor : "rgba(220,220,220,1)",
              pointColor : "rgba(220,220,220,1)",
              pointStrokeColor : "#fff",
              pointHighlightFill : "#fff",
              pointHighlightStroke : "rgba(220,220,220,1)",
              data : thisData
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
}
