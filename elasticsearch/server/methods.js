import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';
import _ from 'lodash';

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
  deleteAnalyticsInformation (proxyBackendId) {
    // Make sure proxyBackendId is s String
    check(proxyBackendId, String);

    // Get the frontend prefix of Proxy backend and ES URL
    const proxyData = Meteor.call('getProxyData', proxyBackendId);

    // Create parameters object to find API via frontend prefix
    // TODO: Redo it using api_backend_id and do query for eMQTT protocol
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
                        value: `${proxyData.frontendPrefix}`,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    };

    // Init ES client
    const esClient = new ElasticSearch.Client({ host: proxyData.elasticSearchUrl });

    // Search related documents in ElasticSearch storage
    const searchResult = esClient.search(params);

    // Return the Promise result
    searchResult
      .then(response => {
        // Get the hits data if searching was success
        const hits = response.hits.hits;

        // If ES doesn't have data for this frontend prefix then nothing to delete
        if (hits.length < 1) {
          // Exit from function
          return hits;
        }

        // Create parameters object to perform many delete operations
        const bulkBody = _.map(hits, (hitDocument) => {
          return {
            delete: {
              _id: hitDocument._id,
              _index: hitDocument._index,
              _type: hitDocument._type,
            },
          };
        });

        // Perform deleting of ES data
        return esClient.bulk({
          body: bulkBody,
        });
      })
      .then(result => {
        // Return result if deleting was success
        return result;
      })
      .catch((err) => {
        // Throw an error if any step has error
        throw new Meteor.Error(err.message);
      });
  },
});
