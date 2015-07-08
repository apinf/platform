Meteor.methods({
  "getChartData": function () {


    // TODO: dynamic input data
    var index = 'api-umbrella-logs-v1-2015-07';
    var type = 'log';
    var limit = 1000;
    var query = {
      match_all: {}
    };

    var newSearch = new ElasticRest(index, type, limit, query);

    return getMonthAnalytics(newSearch.doSearch());
  }
});
