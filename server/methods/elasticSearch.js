Meteor.methods({
  "getChartData": function (data) {

    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      data.apiKey,
      data.fields
    );

    return newSearch.doSearch();
  }
});
