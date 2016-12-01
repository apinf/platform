import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import ElasticSearch from 'elasticsearch';

Meteor.methods({
  getElasticSearchData (proxyData, analyticsData) {
    let params;

    // Constructs the Elastic Search query object
    switch (proxyData.proxyType) {
      case 'apiUmbrella':
        params = Meteor.call('getElasticQueryUmbrella', proxyData.frontendPrefix, analyticsData);
        break;
      case 'emqtt':
        // TODO: Add fronted prefix parameter if eMQTT protocol has it
        params = Meteor.call('getElasticQueryEmqtt');
        break;
      default:
        const message = TAPi18n.__('dashboard_errorMessage_unknownProxyType');
        throw new Meteor.Error(message);
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
  getElasticQueryUmbrella (frontendPrefix, analyticsData) {
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
    if (analyticsData.analyticsFrom) {
      // Set start date (greater than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.gte = analyticsData.analyticsFrom;
    }

    // Update query parameters for date range, when provided
    if (analyticsData.analyticsTo) {
      // Set end date (less than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.lte = analyticsData.analyticsTo;
    }

    return params;
  },
  // TODO: Add right constructor
  getElasticQueryEmqtt () {
    return { size: 1000 };
  },
});
