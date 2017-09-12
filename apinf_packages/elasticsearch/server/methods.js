/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Npm packages imports
import ElasticSearch from 'elasticsearch';

Meteor.methods({
  getElasticsearchData (host, queryParams) {
    // Make sure params are String type
    check(host, String);
    check(queryParams, Object);

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ElasticSearch.Client({ host });

    return esClient
      .ping({
        // ping usually has a 5000ms timeout
        requestTimeout: 5000,
      })
      .then(() => {
        return esClient.search(queryParams);
      })
      .catch(error => {
        // Throw an error
        throw new Meteor.Error(error);
      });
  },
});
