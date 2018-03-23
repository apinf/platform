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
import _ from 'lodash';

// APInf import
import mostUsersRequest from '/apinf_packages/dashboard/client/elasticsearch_queries/most_users';
import {
  arrowDirection,
  percentageValue,
  summaryComparing } from '/apinf_packages/dashboard/lib/trend_helpers';
import getDateRange from '../../../../core/helper_functions/date_range';

Template.apiAnalyticPageBody.onCreated(function () {
  const instance = this;

  const proxyBackendId = instance.data.proxyBackendId;
  // Get instance or current proxy backend configuration
  const proxyBackend = ProxyBackends.findOne(proxyBackendId);
  // Get frontend_prefix
  instance.requestPath = proxyBackend.frontendPrefix();

  // Init variables
  instance.overviewChartResponse = new ReactiveVar();
  instance.analyticsData = new ReactiveVar();
  instance.statusCodesResponse = new ReactiveVar();
  instance.timelineChartResponse = new ReactiveVar();
  instance.allRequestPaths = new ReactiveVar();
  instance.frequentUsersResponse = new ReactiveVar();
  instance.errorsStatisticsResponse = new ReactiveVar();

  instance.autorun(() => {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    const queryOption = getDateRange(timeframe);

    const params = {
      proxyBackendId,
      fromDate: queryOption.from,
      toDate: queryOption.to,
      interval: queryOption.interval,
      timeframe,
    };

    // "Today" or "Yesterday".
    if (timeframe === '12' || timeframe === '48') {
      // Make ES request to aggregated by hour
      Meteor.call('overviewChartsDataFromElasticsearch', params, [proxyBackendId],
        (error, dataset) => {
          if (error) throw new Meteor.Error(error.message);

          instance.overviewChartResponse.set(dataset);
        });

      Meteor.call('timelineChartDataFromElasticsearch', instance.requestPath, params,
        (error, response) => {
          if (error) throw new Error(error);

          instance.timelineChartResponse.set(response.requestPathsData);
          instance.allRequestPaths.set(response.allRequestPaths);
        });
    } else {
      // "Last N Days"
      // Get data for Overview charts
      Meteor.call('overviewChartsData', params, (error, dataset) => {
        instance.overviewChartResponse.set(dataset);
      });

      // Get data for Timeline charts
      Meteor.call('timelineChartData', params,
        (error, response) => {
          if (error) throw new Error(error);

          instance.timelineChartResponse.set(response.requestPathsData);
          instance.allRequestPaths.set(response.allRequestPaths);
        });
    }

    Meteor.call('totalNumberRequestsAndTrend',
      params, [proxyBackendId], (error, result) => {
        this.analyticsData.set(result);
      });

    // Get data about response status codes
    Meteor.call('statusCodesData', params,
      (error, dataset) => {
        instance.statusCodesResponse.set(dataset);
      });

    // Get data for Errors table
    Meteor.call('errorsStatisticsData', params,
      (error, dataset) => {
        if (error) throw new Error(error);

        instance.errorsStatisticsResponse.set(dataset);
      });
  });

  // Fetch data for Users table
  instance.autorun(() => {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    const queryOption = getDateRange(timeframe);

    // Get related instance of Proxy
    const proxy = Proxies.findOne(proxyBackend.proxyId);

    // Get URL of relevant ElasticSearch or an empty string on default
    const elasticsearchHost = _.get(proxy, 'apiUmbrella.elasticsearch', '');

    if (elasticsearchHost) {
      // Create a query. It depends on requestPath
      const usersQuery = mostUsersRequest(instance.requestPath,
        { fromDate: queryOption.from, toDate: queryOption.to });

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
  arrowDirection (parameter) {
    const instance = Template.instance();

    const dataset = instance.analyticsData.get();

    // Provide compared data
    return arrowDirection(parameter, dataset[0]);
  },
  percentages (parameter) {
    const instance = Template.instance();

    const dataset = instance.analyticsData.get() || [];

    // Provide compared data
    return percentageValue(parameter, dataset[0]);
  },
  summaryComparing (parameter) {
    const instance = Template.instance();

    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    const dataset = instance.analyticsData.get() || [];

    // Provide compared data
    return summaryComparing(parameter, dataset[0], currentTimeframe);
  },
  overviewChartResponse () {
    const instance = Template.instance();

    // Return boolean value of available overviewChart response
    return !!(instance.overviewChartResponse.get());
  },
  analyticsData () {
    const instance = Template.instance();
    const dataset = instance.analyticsData.get() || [];

    // Return boolean value of available analyticsData response
    return dataset[0];
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
  dateFormat () {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    if (timeframe === '12' || timeframe === '48') {
      // Locale format of Hours * minutes
      return 'LT';
    }

    // Otherwise It's Date format
    return 'L';
  },
});
