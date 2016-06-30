import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';
import _ from 'lodash';

Meteor.methods({
  getElasticSearchData (opts) {

    // Check if user is authorised
    if (Meteor.user()) {

      const settings = Settings.findOne(); // Get settings object

      let host; // init variable for host

      try {

        host = settings.elasticsearch.host; // Try-catch if host value exists

      } catch (e) {

        throw new Meteor.error(500, 'Elasticsearch host is not defined. Please check your settings.');

        return false;
      }

      const esClient = new ElasticSearch.Client({ host }); // Init ES client

      // Get elasticsearch data and return
      return esClient.search(opts).then((res) => {

        return res;
      }, (err) => {

        throw new Meteor.error(500, 'Analytics data is not found.');

        return false;
      });
    } else {
      
      throw new Meteor.error(500, 'User is not authorised.');

      return false;
    }
  }
});
