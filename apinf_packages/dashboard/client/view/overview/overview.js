/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import {
  arrowDirection,
  percentageValue,
  summaryComparing,
} from '/apinf_packages/dashboard/lib/trend_helpers';

Template.dashboardOverviewStatistic.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  overviewComparing (parameter) {
    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    return summaryComparing(parameter, this, currentTimeframe);
  },
  timeframeYesterday () {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Because typeof timeframe is string
    return timeframe === '1';
  },
  timeframe () {
    return FlowRouter.getQueryParam('timeframe');
  },
  getCount (param) {
    const instance = Template.instance();
    const proxyBackend = instance.data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const statusCodesResponse = Template.currentData().statusCodesResponse;
    const statusCodes = statusCodesResponse && statusCodesResponse[path];

    const totalNumberResponse = Template.currentData().totalNumberResponse;
    const totalNumber = totalNumberResponse && totalNumberResponse[path];

    let count;

    switch (param) {
      case 'success': {
        count = statusCodes ? statusCodes.successCallsCount : 0;
        break;
      }
      case 'error': {
        count = statusCodes ? statusCodes.errorCallsCount : 0;
        break;
      }
      case 'requests': {
        count = totalNumber ? totalNumber.requestNumber : 0;
        break;
      }
      case 'time': {
        count = totalNumber ? totalNumber.responseTime : 0;
        break;
      }
      case 'users': {
        count = totalNumber ? totalNumber.uniqueUsers : 0;
        break;
      }
      default: {
        count = 0;
        break;
      }
    }

    return count;
  },
  comparisonData () {
    const instance = Template.instance();
    const proxyBackend = instance.data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const totalNumberResponse = Template.currentData().totalNumberResponse;
    const totalNumber = totalNumberResponse && totalNumberResponse[path];

    return totalNumber ? totalNumber.comparisons : {};
  },
  requestOverTime () {
    const instance = Template.instance();
    const proxyBackend = instance.data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const overviewChartResponse = Template.currentData().overviewChartResponse;
    const overviewChartData = overviewChartResponse && overviewChartResponse[path];

    return overviewChartData ? overviewChartData.requests_over_time.buckets : [];
  },
});
