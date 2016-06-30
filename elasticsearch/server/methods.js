import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';
import _ from 'lodash';

Meteor.methods({
  getElasticSearchData (opts) {

    if (Meteor.user()) {

    const settings = Settings.findOne();

    try {

      const host = settings.elasticsearch.host;

    } catch (e) {

      throw new Meteor.error(500, 'Elasticsearch host is not defined. Please check your settings.');

      return false;
    }


    const esClient = new ElasticSearch.Client({ host });

    return esClient.search(opts).then((res) => {
      return res;
    }, (err) => {
      throw new Meteor.error(500, 'Analytics data is not found.');
    });
  } else {
    throw new Meteor.error(500, 'User is not authorised.');
  }
});
