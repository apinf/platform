import { Meteor } from 'meteor/meteor';
import { esClient } from '/server/elasticsearch';
import _ from 'lodash';

Meteor.methods({
  getElasticSearchData (opts) {

    const start = new Date().getTime();

    return esClient.search(opts).then((res) => {

      console.log((new Date().getTime() - start) / 1000 );

      return res;
    });
  },
});
