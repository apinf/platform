import { Meteor } from 'meteor/meteor';
import ElasticSearch from 'elasticsearch';

Meteor.methods({
  getElasticSearchData (proxyData, filterParameters) {
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
    return esClient.search(params).then((res) => res, (err) => {
      // Throw an error
      throw new Meteor.Error(err.message);
    });
  },
  // Constructs the Elastic Search query object for apiUmbrella
  getElasticQueryUmbrella (frontendPrefix, filterParameters) {
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
  // TODO: Add right constructor
  getElasticQueryEmqtt () {
    return { size: 1000 };
  },
});
