Meteor.methods({
  "getChartData": function () {
    var newSearch = new es();
    return newSearch.getMonthAnalytics();
  }
});
