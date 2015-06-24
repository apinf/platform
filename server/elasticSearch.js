// loading the npm module
ElasticSearch = Meteor.npmRequire('elasticsearch');

// create the client
EsClientSource = new ElasticSearch.Client({
  host: 'http://apinf.com:14002'
});

// make it fiber aware
EsClient = Async.wrap(EsClientSource, ['index', 'search']);

var searchQuery = EsClient.search({
  index: 'api-umbrella-logs-v1-2014-12',
  type: 'log',
  body: {
    query: {
      match_all: {}
    },
    size: 1000
  }
});
if(searchQuery.hits.hits){
  var hits = searchQuery.hits.hits;
  var total = searchQuery.hits.total;

  var values = [];
  var dates = {};

  for (var i = 1; i <= 31; i++) {
    dates[i] = 0;
  }

  hits.forEach(function (e) {
    var stamp = new Date(e._source.request_at);
    var date = stamp.getDate();
    values.push(date);
  });

  values.forEach(function (j) {
    for (var k = 1; k <= 31; k++) {
      if (k == j) {
        dates[j]++;
      }
    }
  });

  //"dates" is an object that contains data to be used in chart

  //var val = new ReactiveVar();
  //val.set(dates);
  console.log(dates);
}else{
  console.log('Nothing found')
}
