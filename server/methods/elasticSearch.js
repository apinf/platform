Meteor.methods({
  "getChartData": function () {
    var newSearch = new ApiUmbrellaElastic();

    // TODO: dynamic input data
    var searchIndex = 'api-umbrella-logs-v1-2015-07';
    var searchType = 'log';
    var returnItemsLimit = 1000;
    var query = {
      match_all: {}
    };

    var data = newSearch.doSearch(searchIndex, searchType, returnItemsLimit, query);
    return newSearch.getMonthAnalytics(data);
  }
});
