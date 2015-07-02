ApiUmbrellaElastic = function () {

  // loading the npm module
  ElasticSearch = Meteor.npmRequire('elasticsearch');

  // create the client
  EsClientSource = new ElasticSearch.Client({
    host: Meteor.settings.elasticsearch.host
  });

  // make it fiber aware
  EsClient = Async.wrap(EsClientSource, ['index', 'search']);

  /**
   * index: index provided within the query
   * type : type of records ro be returned
   * count: limit of records to be returned
    */
  this.doSearch = function (index, type, limit) {
    var searchData = EsClient.search({
      index: index,
      type: type,
      body: {
        query: {
          match_all: {}
        },
        size: limit
      }
    });

    return searchData;
  };

  this.getMonthAnalytics = function (data) {

    var items = data.hits.hits;

    if(items){

      var datesArray = [];
      var monthData = {};
      var chartDataArr = [];
      var monthFrames = {
        monthStart: 1,
        monthEnd  : 31
      };


      items.forEach(function (item) {
        var stamp = new Date(item._source.request_at);
        var date = stamp.getDate();
        datesArray.push(date);
      });

      datesArray.forEach(function (dateInArray) {
        for (var monthDay = monthFrames.monthStart; monthDay <= monthFrames.monthEnd; monthDay++) {
          if (monthDay == dateInArray) {
            if(monthData[dateInArray]) monthData[dateInArray]++;
            else monthData[dateInArray] = 1;
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
