import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';
// Collection import
import { Proxies } from '/proxies/collection';


Meteor.methods({
  getElasticSearchData (opts) {
    // Check if user is authorised
    if (Meteor.user()) {
      const host = Meteor.call('getElasticsearchUrl');

      const esClient = new ElasticSearch.Client({ host }); // Init ES client

      // Get elasticsearch data and return
      return esClient.search(opts).then((res) => {
        return res;
      }, (err) => {
        throw new Meteor.Error(err.message);
      });
    } else {
      throw new Meteor.Error('User is not authorised.');

      return false;
    }
  },
  elasticsearchIsDefined () {
    // TODO: multi-proxy support
    const proxy = Proxies.findOne();

    if (proxy) {
      const elasticsearch = proxy.apiUmbrella.elasticsearch;

      // Return true or false, depending on whether elasticsearch is defined
      return (elasticsearch);
    }

    return false;
  },
  getElasticsearchUrl () {
    if (Meteor.call('elasticsearchIsDefined')) {
      // TODO: multi-proxy support
      const elasticsearch = Proxies.findOne().apiUmbrella.elasticsearch;

      return elasticsearch;
    }

    throw new Meteor.Error('Elasticsearch is not defined');
  },
});
