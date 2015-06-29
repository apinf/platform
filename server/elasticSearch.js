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



};

var newSeach =  new es();

console.log(newSeach.doSearch());
