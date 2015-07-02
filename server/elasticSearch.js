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

      var datesArray = []; // long array that contains all the request dates
      var labels = [];     // last two weeks month days - labels to display on chart
      var values = [];     // exact values that are used in chart
      var counts = {};     // object that handles dates and amount of requests this day

      // time filter for fetching data
      var timeFrames = {
        start: moment().subtract(2, "weeks"),
        end  : moment()
      };

      // looping items, getting the date value from an item and pushing it to datesArray
      items.forEach(function (item) {
        var stamp = new Date(item._source.request_at);
        var date = stamp.getDate();
        datesArray.push(date);
      });


      //counting total number of requests per day
      datesArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

      var loopThroughDates = moment().range(timeFrames.start, timeFrames.end).by('days', function(moment){

        var date = moment.date();
        labels.push(date);
        if(date in counts){
          values.push(counts[date]);
        }else{
          values.push(0);
        }

      });

    }else {
      console.log("Data not found");
    }

    return {
      labels: labels,
      values: values
    };
  }

};
