// loading the npm module
ElasticSearch = Meteor.npmRequire('elasticsearch');

// create the client
EsClientSource = new ElasticSearch.Client({
  host: 'http://apinf.com:14002'
});

// make it fiber aware
EsClient = Async.wrap(EsClientSource, ['index', 'search']);

