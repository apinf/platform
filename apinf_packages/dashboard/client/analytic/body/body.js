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

// APInf import
import mostUsersRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/most_users';
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';
import {
  arrowDirection,
  percentageValue,
  summaryComparing } from '/apinf_packages/dashboard/lib/trend_helpers';

Template.apiAnalyticPageBody.onCreated(function () {
  const instance = this;

  const proxyBackendId = instance.data.proxyBackendId;
  // Get instance or current proxy backend configuration
  const proxyBackend = ProxyBackends.findOne(proxyBackendId);
  // Get frontend_prefix
  instance.requestPath = proxyBackend.frontendPrefix();

  // Init variables
  instance.overviewChartResponse = new ReactiveVar();
  instance.summaryStatisticResponse = new ReactiveVar();
  instance.comparisonStatisticResponse = new ReactiveVar();
  instance.statusCodesResponse = new ReactiveVar();
  instance.timelineChartResponse = new ReactiveVar();
  instance.allRequestPaths = new ReactiveVar();
  instance.frequentUsersResponse = new ReactiveVar();
  instance.errorsStatisticsResponse = new ReactiveVar();

  instance.autorun(() => {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
    const toDate = moment(0, 'HH').add(1, 'd').valueOf();

    // Get timestamp of timeframe ago 00:00:00 Date time (included value)
    const fromDate = moment(toDate).subtract(timeframe, 'd').valueOf();

    // Get data about summary statistic for current period
    promisifyCall('summaryStatisticNumber', { proxyBackendId, fromDate, toDate })
      .then((currentPeriodDataset) => {
        instance.summaryStatisticResponse.set(currentPeriodDataset);

        const previousFromDate = moment(fromDate).subtract(timeframe, 'd').valueOf();

        // Get trend data is based on the current period data
        Meteor.call('summaryStatisticTrend',
          { proxyBackendId, fromDate: previousFromDate, toDate: fromDate }, currentPeriodDataset,
          (err, compareResponse) => {
            // Save the response about Comparison data
            instance.comparisonStatisticResponse.set(compareResponse);
          });
      }).catch((error) => {
        throw new Meteor.Error(error);
      });

    // Get data about summary statistic over time
    Meteor.call('overviewChartsData', { proxyBackendId, fromDate, toDate },
      (error, dataset) => {
        instance.overviewChartResponse.set(dataset);
      });

    // Get data about response status codes
    Meteor.call('statusCodesData', { proxyBackendId, fromDate, toDate },
      (error, dataset) => {
        instance.statusCodesResponse.set(dataset);
      });

    // Get data for Timeline charts
    Meteor.call('timelineChartData', { proxyBackendId, fromDate, toDate },
      (error, response) => {
        if (error) throw new Error(error);

        instance.timelineChartResponse.set(response.requestPathsData);
        instance.allRequestPaths.set(response.allRequestPaths);
      });

    // Get data for Errors table
    Meteor.call('errorsStatisticsData', { proxyBackendId, fromDate, toDate },
      (error, dataset) => {
        if (error) throw new Error(error);

        instance.errorsStatisticsResponse.set(dataset);
      });
  });

  // Fetch data for Users table
  instance.autorun(() => {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
    const toDate = moment(0, 'HH').add(1, 'd').valueOf();

    // Get timestamp of timeframe ago 00:00:00 Date time (included value)
    const fromDate = moment(toDate).subtract(timeframe, 'd').valueOf();

    // Get related instance of Proxy
    const proxy = Proxies.findOne(proxyBackend.proxyId);

    // Get URL of relevant ElasticSearch or an empty string on default
    const elasticsearchHost = _.get(proxy, 'apiUmbrella.elasticsearch', '');

    if (elasticsearchHost) {
      // Create a query. It depends on requestPath
      const usersQuery = mostUsersRequest(instance.requestPath, { fromDate, toDate });

      // Send request to get data about most frequent users
      Meteor.call('getElasticsearchData', elasticsearchHost, usersQuery,
        (error, dataset) => {
          if (error) throw Meteor.Error(error);

          instance.frequentUsersResponse.set(dataset.aggregations);
        });
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
  overviewChartResponse () {
    const instance = Template.instance();

    // Return boolean value of available overviewChart response
    return !!(instance.overviewChartResponse.get());
  },
  getStatistics (param) {
    const instance = Template.instance();
    const path = instance.requestPath;

    const summaryStatisticResponse = instance.summaryStatisticResponse.get();
    const summaryStatistic = summaryStatisticResponse && summaryStatisticResponse[path];

    let count;

    switch (param) {

      case 'requests': {
        count = summaryStatistic ? summaryStatistic.requestNumber : 0;
        break;
      }
      case 'time': {
        count = summaryStatistic ? summaryStatistic.medianResponseTime : 0;
        break;
      }
      case 'users': {
        count = summaryStatistic ? summaryStatistic.avgUniqueUsers : 0;
        break;
      }
      default: {
        count = 0;
        break;
      }
    }

    return count;
  },
  getChartData (param) {
    const instance = Template.instance();
    const path = instance.requestPath;

    const overviewChartResponse = instance.overviewChartResponse.get();
    const overviewChartData = overviewChartResponse && overviewChartResponse[path];

    let dataset;

    switch (param) {
      case 'requests': {
        dataset = overviewChartData ? overviewChartData.requestNumber : [];
        break;
      }
      case 'time': {
        dataset = overviewChartData ? overviewChartData.medianTime : [];
        break;
      }
      case 'users': {
        dataset = overviewChartData ? overviewChartData.uniqueUsers : [];
        break;
      }
      default: {
        dataset = [];
        break;
      }
    }

    return dataset;
  },
  comparisonData () {
    const instance = Template.instance();
    const path = instance.requestPath;

    const comparisonResponse = instance.comparisonStatisticResponse.get();
    const comparisonData = comparisonResponse && comparisonResponse[path];

    return comparisonData || {};
  },
  getStatusCode (param) {
    const instance = Template.instance();
    const path = instance.requestPath;

    const statusCodesResponse = instance.statusCodesResponse.get();
    const statusCodesData = statusCodesResponse && statusCodesResponse[path];

    let count;

    switch (param) {
      case 'success': {
        count = statusCodesData ? statusCodesData.successCallsCount : 0;
        break;
      }
      case 'redirect': {
        count = statusCodesData ? statusCodesData.redirectCallsCount : 0;
        break;
      }
      case 'fail': {
        count = statusCodesData ? statusCodesData.failCallsCount : 0;
        break;
      }
      case 'error': {
        count = statusCodesData ? statusCodesData.errorCallsCount : 0;
        break;
      }
      default: {
        count = 0;
        break;
      }
    }

    return count;
  },
  timelineChartData () {
    const instance = Template.instance();

    // Return boolean value of available timelineChart response
    return instance.timelineChartResponse.get();
  },
  listPaths () {
    const instance = Template.instance();

    return instance.allRequestPaths.get();
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

    // Return boolean value of fetching errorsStatistics data
    return !!(instance.errorsStatisticsResponse.get());
  },
  errorsStatisticsData () {
    const instance = Template.instance();

    // Return value of errors statistics
    return instance.errorsStatisticsResponse.get();
  },
});
