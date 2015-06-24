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
console.log(searchQuery);
