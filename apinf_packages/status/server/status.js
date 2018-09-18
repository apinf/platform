/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.methods({
  statusCheck () {
    function checkApinf () {
      // initial status object
      const status = {
        operational: false,
        message: '',
      };

      try {
        // initial host for apinf
        const apinfHost = Meteor.absoluteUrl();

        // response object from apinf GET request
        const apinfResponse = HTTP.call('GET', apinfHost);

        // checks is the status code matches 200
        if (apinfResponse.statusCode === 200) {
          // if status code is 200 changes operational state to TRUE and provides success message
          status.operational = true;
          status.message = 'Apinf is operating normally.';
        } else {
          // if not, operational state remains false and provides different message
          status.message = 'Apinf is down for some reason. Please contact support.';
        }
      } catch (e) {
        // if http call crashes, sending different message
        status.message = 'Not able to access Apinf.';
      }

      return status;
    }

    function checkApiUmbrella () {
      // initial status object
      const status = {
        operational: false,
        message: '',
      };

      try {
        // initial host for API umbrella
        const apiUmbrellaHost = Meteor.settings.apiUmbrella.host;

        // response object from API Umbrella GET request
        const apiUmbrellaResponse = HTTP.call('GET', apiUmbrellaHost);

        // checks is the status code matches 200
        if (apiUmbrellaResponse.statusCode === 200) {
          // if status code is 200 changes operational state to TRUE and provides success message
          status.operational = true;
          status.message = 'API Umbrella is operating normally.';
        } else {
          // if not, operational state remains false and provides different message
          status.message = 'API Umbrella is down for some reason. Please contact support.';
        }
      } catch (e) {
        // if http call crashes, sending different message
        status.message = 'Not able to reach API Umbrella.';
      }

      // if not, operational state remains false and provides different message
      return status;
    }

    function checkElasticSearch () {
      // initial status object
      const status = {
        operational: false,
        message: '',
      };

      try {
        // initial host for elasticsearch instance
        const elasticsearchInstance = Meteor.settings.elasticsearch.host;

        // response object from elasticsearch GET request
        const elasticsearchResponse = HTTP.call('GET', elasticsearchInstance);

        // checks is the status code matches 200
        if (elasticsearchResponse.statusCode === 200) {
          // if status code is 200 changes operational state to TRUE
          // and provides success message
          status.operational = true;
          status.message = 'Elasticsearch is operating normally.';
        } else {
          // if not, operational state remains false and provides different message
          status.message = 'Elasticsearch is down for some reason. Please contact support.';
        }
      } catch (e) {
        // if http call crashes, sending different message
        status.message = 'Not able to reach Elasticsearch.';
      }

      // if not, operational state remains false and provides different message
      return status;
    }

    // statusCheck method returns object with statuses
    // of all of the status checking functions written above
    return {
      apinf: checkApinf(),
      elasticsearch: checkElasticSearch(),
      apiUmbrella: checkApiUmbrella(),
    };
  },
});
