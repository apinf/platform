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
  getElasticSearchData (proxyData, filterParameters) {
    // Make sure proxyData is an Object TODO: is there a schema for it?
    check(proxyData, Object);

    // Make sure filterParameters is an Object TODO: is there a schema for it?
    check(filterParameters, Object);

    let params;

    // Constructs the Elastic Search query object
    switch (proxyData.proxyType) {
      case 'apiUmbrella':
        params = Meteor.call('getElasticQueryUmbrella', proxyData.frontendPrefix, filterParameters);
        break;
      case 'emqtt':
        // TODO: Add fronted prefix parameter if eMQTT protocol has it
        params = Meteor.call('getElasticQueryEmqtt');
        break;
      default:
        throw new Meteor.Error('Unknown proxy type');
    }

    // Save the Elastic Search url
    const host = proxyData.elasticSearchUrl;
    // Init ES client
    const esClient = new ElasticSearch.Client({ host });

    // Makes the HTTP request
    // Get Elastic Search data and return
    return esClient.search(params).then((res) => { return res; }, (err) => {
      // Throw an error
      throw new Meteor.Error(err.message);
    });
  },
  // Constructs the Elastic Search query object for apiUmbrella
  getElasticQueryUmbrella (frontendPrefix, filterParameters) {
    // Make sure frontendPrefix is a String
    check(frontendPrefix, String);

    // Make sure filterParameters is an Object TODO: is there a schema for it?
    check(filterParameters, Object);

    // Construct parameters for Elastic Search
    // TODO: For case "Proxy Admin API" with prefix /api-umbrella/
    // TODO: Values aggregation associated with granularity
    const params = {
      size: 50000,
      body: {
        query: {
          filtered: {
            query: {
              bool: {
                should: [
                  {
                    wildcard: {
                      request_path: {
                        // Add '*' to partially match the url
                        value: `${frontendPrefix}*`,
                      },
                    },
                  },
                ],
              },
            },
            filter: {
              range: {
                request_at: {},
              },
            },
          },
        },
        sort: [
          {
            request_at: {
              order: 'desc',
            },
          },
        ],
        fields: [
          'request_at',
          'response_status',
          'response_time',
          'request_ip_country',
          'request_ip',
          'request_path',
          'user_id',
        ],
      },
    };

    // Update query parameters for date range, when provided
    if (filterParameters.analyticsFrom) {
      // Set start date (greater than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.gte = filterParameters.analyticsFrom;
    }

    // Update query parameters for date range, when provided
    if (filterParameters.analyticsTo) {
      // Set end date (less than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.lte = filterParameters.analyticsTo;
    }

    return params;
  },
  // TODO: Add the correct query object for eMQTT protocol
  getElasticQueryEmqtt () {
    // Now it returns some placeholder
    return { size: 1000 };
  },
});

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
