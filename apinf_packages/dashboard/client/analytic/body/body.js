/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import moment from 'moment';
import _ from 'lodash';

/* eslint-disable max-len */
// APInf import
import errorsStatisticsRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/errors_statistics';
import mostUsersRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/most_users';
import overviewChartsRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/overview_charts';
import responseStatusCodesRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/status_codes';
import timelineChartsRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/timeline_charts';
import totalNumbersRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/total_numbers';
import { arrowDirection, percentageValue, summaryComparing, calculateTrend } from '/apinf_packages/dashboard/lib/trend_helpers';
/* eslint-enable mas-len */

Template.apiAnalyticPageBody.onCreated(function () {
  const instance = this;

  // Keep response from elasticsearch
  instance.overviewChartResponse = new ReactiveVar();
  instance.totalNumberResponse = new ReactiveVar();
  instance.statusCodesResponse = new ReactiveVar();
  instance.timelineChartResponse = new ReactiveVar();
  instance.frequentUsersResponse = new ReactiveVar();
  instance.errorsStatisticsResponse = new ReactiveVar();

  // Keep parsed data for summary statistics
  instance.totalNumberData = new ReactiveVar();
  instance.comparisonData = new ReactiveVar();
  instance.statusCodes = new ReactiveVar();

  // Get instance or current proxy backend configuration
  const proxyBackend = ProxyBackends.findOne(instance.data.proxyBackendId);

  // Send requests to Elasticsearch
  instance.autorun(() => {
    // Storage Proxy ID and API ID or an empty string on default
    instance.proxyId = _.get(proxyBackend, 'proxyId', '');
    instance.apiId = _.get(proxyBackend, 'apiId', '');

    // Get related instance of Proxy
    const proxy = Proxies.findOne(instance.proxyId);

    // Get URL of relevant ElasticSearch or an empty string on default
    const elasticsearchHost = _.get(proxy, 'apiUmbrella.elasticsearch', '');

    // Make sure elasticsearchHost is available
    if (proxyBackend && elasticsearchHost) {
      // Get timeframe
      const timeframe = FlowRouter.getQueryParam('timeframe');

      // Create date range parameter
      const dateRange = {
        // Plus one day to include current day in selection
        today: moment().add(1, 'days').format('YYYY-MM-DD'),
        oneTimePeriodAgo: moment().subtract(timeframe - 1, 'd').format('YYYY-MM-DD'),
        // eslint-disable-next-line no-mixed-operators
        twoTimePeriodsAgo: moment().subtract(2 * timeframe - 1, 'd').format('YYYY-MM-DD'),
      };

      // Get frontend_prefix
      instance.requestPath = proxyBackend.frontendPrefix();

      // Create "filters" option for some elasticsearch queries
      const filters = {
        filters: {
          [instance.requestPath]: {
            prefix: {
              request_path: instance.requestPath,
            },
          },
        },
      };

      // Create queries that depend on "filters" option
      const overviewChartsQuery = overviewChartsRequest(filters, dateRange);

      // Send request to get data for overview charts
      Meteor.call('getElasticsearchData', elasticsearchHost, overviewChartsQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          // Update Elasticsearch data reactive variable with result
          instance.overviewChartResponse.set(dataset.aggregations.group_by_request_path.buckets);
        });

      const totalNumbersQuery = totalNumbersRequest(filters, dateRange);

      // Send request to get data about summary statistics numbers
      Meteor.call('getElasticsearchData', elasticsearchHost, totalNumbersQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          // Update Elasticsearch data reactive variable with result
          instance.totalNumberResponse.set(dataset.aggregations.group_by_request_path.buckets);
        });

      // Create queries that depend on "filters" option
      const statusCodesQuery = responseStatusCodesRequest(filters, dateRange);

      // Send request to get data about response status codes
      Meteor.call('getElasticsearchData', elasticsearchHost, statusCodesQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          // Update Elasticsearch data reactive variable with result
          instance.statusCodesResponse.set(dataset.aggregations.group_by_request_path.buckets);
        });

      // Create a query. It depends on requestPath
      const timelineChartsQuery = timelineChartsRequest(instance.requestPath, dateRange);

      // Send request to get data for timeline charts
      Meteor.call('getElasticsearchData', elasticsearchHost, timelineChartsQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          // Update Elasticsearch data reactive variable with result
          instance.timelineChartResponse.set(dataset.aggregations);
        });

      // Create a query. It depends on requestPath
      const usersQuery = mostUsersRequest(instance.requestPath, dateRange);

      // Send request to get data about most frequent users
      Meteor.call('getElasticsearchData', elasticsearchHost, usersQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          instance.frequentUsersResponse.set(dataset.aggregations);
        });

      // Create a query. It depends on requestPath
      const errorsQuery = errorsStatisticsRequest(instance.requestPath, dateRange);

      // Send request to get data about errors statistics
      Meteor.call('getElasticsearchData', elasticsearchHost, errorsQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          instance.errorsStatisticsResponse.set(dataset.aggregations);
        });
    }
  });

  // Parse data for Response status codes block
  instance.autorun(() => {
    const path = instance.requestPath;
    // Get ES data
    const statusCodesResponse = instance.statusCodesResponse.get();

    if (statusCodesResponse) {
      // Prepared JSON to responses status codes statistics
      const statusCodes = {
        successCallsCount: statusCodesResponse[path].response_status.buckets.success.doc_count,
        redirectCallsCount: statusCodesResponse[path].response_status.buckets.redirect.doc_count,
        failCallsCount: statusCodesResponse[path].response_status.buckets.fail.doc_count,
        errorCallsCount: statusCodesResponse[path].response_status.buckets.error.doc_count,
      };

      // Save the data for status codes statistics
      instance.statusCodes.set(statusCodes);
    }
  });

  // Parse data for Total numbers & trend blocks
  instance.autorun(() => {
    const path = instance.requestPath;
    const totalNumberResponse = instance.totalNumberResponse.get();

    if (totalNumberResponse) {
      const currentPeriodData = totalNumberResponse[path].group_by_interval.buckets.currentPeriod;

      // Prepared JSON to total statistics
      const totalNumberData = {
        requestNumber: currentPeriodData.doc_count,
        responseTime: parseInt(currentPeriodData.median_response_time.values['50.0'], 10),
        uniqueUsers: currentPeriodData.unique_users.buckets.length,
      };

      // Save the data for Total statistics
      instance.totalNumberData.set(totalNumberData);

      // Get data about Previous period
      const previousPeriodData = totalNumberResponse[path].group_by_interval.buckets.previousPeriod;
      const previousResponseTime = previousPeriodData.median_response_time.values['50.0'];
      const previousUniqueUsers = previousPeriodData.unique_users.buckets.length;

      // Get the statistics comparing between previous and current periods
      const comparisonData = {
        compareRequests:
          calculateTrend(previousPeriodData.doc_count, totalNumberData.requestNumber),
        compareResponse:
          calculateTrend(parseInt(previousResponseTime, 10), totalNumberData.responseTime),
        compareUsers:
          calculateTrend(previousUniqueUsers, totalNumberData.uniqueUsers),
      };

      // Save the data for trend statistics
      instance.comparisonData.set(comparisonData);
    }
  });
});

Template.apiAnalyticPageBody.helpers({
// TODO: Keep in mind to case with error result
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  summaryComparing (parameter) {
    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    // Provide compared data
    return summaryComparing(parameter, this, currentTimeframe);
  },
  getCount (param) {
    const instance = Template.instance();

    const totalNumberData = instance.totalNumberData.get();
    const statusCodes = instance.statusCodes.get();

    let count;

    // If data is available then returns the existed value
    // Otherwise returns 0 value
    switch (param) {
      case 'requests': {
        count = totalNumberData ? totalNumberData.requestNumber : 0;
        break;
      }
      case 'time': {
        count = totalNumberData ? totalNumberData.responseTime : 0;
        break;
      }
      case 'users': {
        count = totalNumberData ? totalNumberData.uniqueUsers : 0;
        break;
      }
      case 'successCalls': {
        count = statusCodes ? statusCodes.successCallsCount : 0;
        break;
      }
      case 'redirectCalls': {
        count = statusCodes ? statusCodes.redirectCallsCount : 0;
        break;
      }
      case 'failCalls': {
        count = statusCodes ? statusCodes.failCallsCount : 0;
        break;
      }
      case 'errorCalls': {
        count = statusCodes ? statusCodes.errorCallsCount : 0;
        break;
      }
      default: {
        count = 0;
        break;
      }
    }

    return count;
  },
  overviewChartResponse () {
    const instance = Template.instance();

    // Return boolean value of available overviewChart response
    return !!(instance.overviewChartResponse.get());
  },
  overviewChartData () {
    // Get data of overviewChart response
    const response = Template.instance().overviewChartResponse.get();

    const path = Template.instance().requestPath;

    // Return dataset for chart or an empty array
    return response ? response[path].requests_over_time.buckets : [];
  },
  comparisonData () {
    // Return data to trend
    return Template.instance().comparisonData.get();
  },
  timelineChartResponse () {
    const instance = Template.instance();

    // Return boolean value of available timelineChart response
    return instance.timelineChartResponse.get();
  },
  timelineChartData () {
    // Get data of timelineChart response
    const response = Template.instance().timelineChartResponse.get();

    // Return dataset for chart or an empty array
    return response ? response.group_by_request_path.buckets : [];
  },
  frequentUsersResponse () {
    const instance = Template.instance();

    // Return boolean value of fetching frequentUsers data
    return !!(instance.frequentUsersResponse.get());
  },
  frequentUsersData () {
    // Get data of frequentUsers response
    const users = Template.instance().frequentUsersResponse.get();

    // Return dataset for table or an empty array
    return users ? users.most_frequent_users.buckets : [];
  },
  errorsStatisticsResponse () {
    const instance = Template.instance();

    // Return boolean value of available errorsStatistics response
    return instance.errorsStatisticsResponse.get();
  },
  errorsStatisticsData () {
    // Get data of errorsStatistics response
    const errors = Template.instance().errorsStatisticsResponse.get();

    // Return dataset for table or an empty array
    return errors ? errors.errors_over_time.buckets : [];
  },
});
