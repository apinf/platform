Meteor.methods({
  "getChartData": function (data) {

    var newSearch = new ElasticRest(data.index, data.type, data.limit, data.query);

    return newSearch.doSearch();
  },
  "getChartDataByApiId": function (apiId) {
    var newSearch = new ElasticRest("", "", 1000, {
      "match" : {
        "api_key" : apiId
      }
    });

    return newSearch.doSearch();
  }
});
