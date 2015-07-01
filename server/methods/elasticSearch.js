Meteor.methods({
  "getChartData": function () {
    var newSearch = new es();

    // TODO: dynamic input data
    var searchIndex = 'api-umbrella-logs-v1-2015-07';
    var searchType = 'log';
    var returnItemsLimit = 1000;

    var data = newSearch.doSearch(searchIndex, searchType, returnItemsLimit);

    return newSearch.getMonthAnalytics(data);
  }
});
