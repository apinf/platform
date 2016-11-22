import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';

Meteor.methods({
  getElasticSearchData (opts, proxyId) {
    // Check if user is authorised
    if (Meteor.user()) {
      const host = Meteor.call('getElasticsearchUrl', proxyId);
      console.log('getElasticsearchUrl: ', host)

      const esClient = new ElasticSearch.Client({ host }); // Init ES client

      // Get elasticsearch data and return
      return esClient.search(opts).then((res) => {
        return res;
      }, (err) => {
        throw new Meteor.Error(err.message);
      });
    } else {
      throw new Meteor.Error('User is not authorised.');
    }
  },
});
