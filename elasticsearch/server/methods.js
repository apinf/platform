import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';
// Collection import
import { Proxies } from '/proxies/collection';


Meteor.methods({
  getElasticSearchData (opts, proxyId) {
    // Check if user is authorised
    if (Meteor.user()) {
      const host = Meteor.call('getElasticsearchUrl', proxyId);

      // Init ES client
      const esClient = new ElasticSearch.Client({ host });

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
  elasticsearchIsDefined (proxyId) {
    const proxy = Proxies.findOne(proxyId);

    if (proxy) {
      const elasticsearch = proxy.apiUmbrella.elasticsearch;

      // Return true or false, depending on whether elasticsearch is defined
      return (elasticsearch);
    }

    return false;
  },
  getElasticsearchUrl (proxyId) {
    if (Meteor.call('elasticsearchIsDefined', proxyId)) {
      const elasticsearch = Proxies.findOne(proxyId).apiUmbrella.elasticsearch;

      return elasticsearch;
    }

    throw new Meteor.Error('Elasticsearch is not defined');
  },
});
