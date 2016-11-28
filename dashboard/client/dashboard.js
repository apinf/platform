import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { UniUtils } from 'meteor/universe:reactive-queries';

import { ProxyBackends } from '/proxy_backends/collection';


Template.dashboard.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to proxyApis publicaton
  instance.subscribe('proxyApis');

  // Keeps ES data for charts
  instance.chartData = new ReactiveVar();

  instance.getChartData = function (params, proxyId) {
    return new Promise((resolve, reject) => {
      Meteor.call('getElasticSearchData', params, proxyId, (err, res) => {
        if (err) reject(err);
        resolve(res.hits.hits);
      });
    });
  };

  instance.getElasticSearchQuery = function () {
    // Placeholder for prefixes query
    const prefixesQuery = [];

    // Get selected backend from query parameter
    const backendParameter = UniUtils.url.getQuery('backend');

    // Find proxy backend configuration in DB
    const proxyBackend = ProxyBackends.findOne(backendParameter);

    // Check existing of fronted prefix
    if (proxyBackend && proxyBackend.apiUmbrella && proxyBackend.apiUmbrella.url_matches) {
      // Save frontend prefix
      const frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;
      prefixesQuery.push({
        wildcard: {
          request_path: {
            // Add '*' to partially match the url
            value: `${frontendPrefix}*`,
          },
        },
      });
    }

    // Construct parameters for elasticsearch
    const params = {
      size: 50000,
      body: {
        query: {
          filtered: {
            query: {
              bool: {
                should: [
                  prefixesQuery,
                ],
              },
            },
            filter: {
              range: {
                request_at: { },
              },
            },
          },
        },
        sort: [
          { request_at: { order: 'desc' } },
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

    // Listen for analytics date range changes through URL parameters
    const analyticsFrom = UniUtils.url.getQuery('fromDate');
    const analyticsTo = UniUtils.url.getQuery('toDate');

    // Update query parameters for date range, when provided
    if (analyticsFrom) {
      // Set start date (greater than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.gte = analyticsFrom;
    }

    // Update query parameters for date range, when provided
    if (analyticsTo) {
      // Set end date (less than or equal to) for analytics timeframe
      params.body.query.filtered.filter.range.request_at.lte = analyticsTo;
    }

    return params;
  };

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // Get elasticsearch query
      const params = instance.getElasticSearchQuery();

      const backendParameter = UniUtils.url.getQuery('backend');
      // Find the proxy backend configuration
      const proxyBackend = ProxyBackends.findOne(backendParameter);

      // If proxy backend exists and has proxy ID
      // TODO: Add condition for case "Proxy Admin API" with prefix /api-umbrella/
      if (proxyBackend && proxyBackend.proxyId) {
        // Provide proxy ID to Elastic Search
        instance.getChartData(params, proxyBackend.proxyId)
          .then((chartData) => {
            // Update reactive variable
            instance.chartData.set(chartData);
          })
          .catch(err => console.error(err));
      }
    }
  });
});

Template.dashboard.helpers({
  chartData () {
    const instance = Template.instance();

    return instance.chartData.get();
  },
  proxyBackends () {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    // Get the current selected backend
    const backendParameter = UniUtils.url.getQuery('backend');
    // If query param doesn't exist and proxy backend list is ready
    if (!backendParameter && proxyBackends[0]) {
      // Set the default value as first item of backend list
      UniUtils.url.setQuery('backend', proxyBackends[0]._id);
    }

    return proxyBackends;
  },
});
