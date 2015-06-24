Template.chartLayout.helpers({
  chartData: function () {
    Meteor.call("getChartData", function (err, response) {
      if(err){
        dataArr.set(err)
      }else{
        dataArr.set(response)
      }
    });
    return dataArr.get();
  }
})

Template.chartLayout.created = function () {
  dataArr = new ReactiveVar();
}
