import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';

Meteor.methods({
  getElasticSearchData (opts) {

    // Check if user is authorised
    if (Meteor.user()) {

      if (Meteor.call('elasticsearchIsDefined')) {

        const host = Meteor.call('getElasticsearchUrl');

        const esClient = new ElasticSearch.Client({ host }); // Init ES client

        // Get elasticsearch data and return
        return esClient.search(opts).then((res) => {

          return res;
        }, (err) => {

          throw new Meteor.Error(err.message);

          return false;
        });

      } else {

        // throw new Meteor.Error('Elasticsearch URL is not provided.');
        Router.go('/catalogue');
      }
    } else {

      throw new Meteor.Error('User is not authorised.');

      return false;
    }
  }
});
