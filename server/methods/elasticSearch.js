Meteor.methods({
  "getChartData": function () {
    var chartData = ReactiveVar();
    chartData.set("");
    // loading the npm module
    ElasticSearch = Meteor.npmRequire('elasticsearch');

    // create the client
    EsClientSource = new ElasticSearch.Client({
      host: 'http://46.101.247.242:14002'
    });

    // make it fiber aware
    EsClient = Async.wrap(EsClientSource, ['index', 'search']);

    var searchQuery = EsClient.search({
      index: 'api-umbrella-logs-v1-2015-07',
      type: 'log',
      body: {
        query: {
          match_all: {}
        },
        size: 10000
      }
    });
    if(searchQuery.hits.hits){
      var hits = searchQuery.hits.hits;
      var total = searchQuery.hits.total;

      var values = [];
      var dates = {};
      var chartDataArr = [];
      var monthFrames = {
        monthStart: 1,
        monthEnd  : 31
      };

      for (var i = 1; i <= 31; i++) {
        dates[i] = 0;
      }

      hits.forEach(function (e) {
        var stamp = new Date(e._source.request_at);
        var date = stamp.getDate();
        values.push(date);
      });

      values.forEach(function (j) {
        for (var k = monthFrames.monthStart; k <= monthFrames.monthEnd; k++) {
          if (k == j) {
            dates[j]++;
          }
        }
      });

      for (var l = monthFrames.monthStart; l <= monthFrames.monthEnd; l++){
        chartDataArr.push(dates[l]);
      }
      chartData.set(chartDataArr);
    }else {
      chartData.set("Not Found");
    }
    return chartData.get();
  }
});
