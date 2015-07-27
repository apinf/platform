Meteor.methods({
  "getChartData": function (data) {

    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      data.query,
      [
        'request_at',
        'request_ip_country',
        'request_ip',
        'response_time',
        'request_path'
      ]
    );

    return newSearch.doSearch();
  }
});
