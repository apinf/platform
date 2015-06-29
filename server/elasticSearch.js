es = function () {

  var host = 'http://apinf.com:14002';
  var searchIndex = 'api-umbrella-logs-v1-2014-12';
  var searchType = 'log';
  var searchItemsCount = 1000;

  ElasticSearch = Meteor.npmRequire('elasticsearch');

  EsClientSource = new ElasticSearch.Client({
    host: host
  });

  EsClient = Async.wrap(EsClientSource, ['index', 'search']);

  this.doSearch = function () {
    var searchData = EsClient.search({
      index: searchIndex,
      type: searchType,
      body: {
        query: {
          match_all: {}
        },
        size: searchItemsCount
      }
    });

    return searchData;
  };

  this.getMonthAnalytics = function () {

    var data = this.doSearch();

    var items = data.hits.hits;

    if(items){

      var datesArray = [];
      var monthData = {};
      var chartDataArr = [];
      var monthFrames = {
        monthStart: 1,
        monthEnd  : 31
      };

      items.forEach(function (e) {
        var stamp = new Date(e._source.request_at);
        var date = stamp.getDate();
        datesArray.push(date);
      });

      datesArray.forEach(function (j) {
        for (var k = monthFrames.monthStart; k <= monthFrames.monthEnd; k++) {
          if (k == j) {
            if(monthData[j]) monthData[j]++;
            else monthData[j] = 1;
          }
        }
      });

      for (var l = monthFrames.monthStart; l <= monthFrames.monthEnd; l++){
        chartDataArr.push(monthData[l]);
      }

    }else {
      console.log("Data not found");
    }

    return chartDataArr;
  }

};
