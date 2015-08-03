Meteor.methods({
  "getChartData": function (data) {

    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      data.query,
      data.fields
    );

    return newSearch.doSearch();
  },
  "getChartDataByApiId": function (apiId) {
    var newSearch = new ElasticRest("api-umbrella-logs-v1-2015-08", "log", 1000, {
      "match" : {
        "api_key" : apiId
      }
    });

    return newSearch.doSearch();
  }
});
