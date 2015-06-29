var es = function () {

  var host = 'http://apinf.com:14002';
  var searchIndex = 'api-umbrella-logs-v1-2014-12';
  var searchType = 'log';
  var searchItemsCount = 50;

  ElasticSearch = Meteor.npmRequire('elasticsearch');

  EsClientSource = new ElasticSearch.Client({
    host: host
  });

  EsClient = Async.wrap(EsClientSource, ['index', 'search']);



};
