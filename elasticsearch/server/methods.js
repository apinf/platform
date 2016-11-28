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
    }

    throw new Meteor.Error('User is not authorised.');
  },
  elasticsearchIsDefined (proxyId) {
    // Get Proxy instance of ID
    const proxy = Proxies.findOne(proxyId);
    // Check of existing this proxy instance
    if (proxy) {
      // Get Elastic Search URL
      const elasticsearch = proxy.apiUmbrella.elasticsearch;

      // Return true or false, depending on whether elasticsearch is defined
      return (elasticsearch);
    }

    return false;
  },
  getElasticsearchUrl (proxyId) {
    // Check existing of Elastci Search URL
    if (Meteor.call('elasticsearchIsDefined', proxyId)) {
      // Return URL
      return Proxies.findOne(proxyId).apiUmbrella.elasticsearch;
    }

    throw new Meteor.Error('Elasticsearch is not defined');
  },
});
