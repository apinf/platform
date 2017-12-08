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
  getStatistics (param) {
    const proxyBackend = Template.instance().data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const summaryStatisticResponse = Template.currentData().summaryStatisticResponse;
    // Get summary statistics data that relates to provided Proxy Backend
    const summaryStatistic = summaryStatisticResponse && summaryStatisticResponse[path];

    const statusCodesResponse = Template.currentData().statusCodesResponse;
    // Get response status codes data that relates to provided Proxy Backend
    const statusCodesData = statusCodesResponse && statusCodesResponse[path];

    let count;

    switch (param) {
      case 'success': {
        count = statusCodesData ? statusCodesData.successCallsCount : 0;
        break;
      }
      case 'error': {
        count = statusCodesData ? statusCodesData.errorCallsCount : 0;
        break;
      }
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
  comparisonData () {
    const proxyBackend = Template.instance().data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const comparisonResponse = Template.currentData().comparisonStatisticResponse;
    // Get comparison data that relates to provided Proxy Backend
    const comparisonData = comparisonResponse && comparisonResponse[path];

    return comparisonData || {};
  },
  getChartData (param) {
    const proxyBackend = Template.instance().data.proxyBackend;
    const path = proxyBackend.frontendPrefix();

    const overviewChartResponse = Template.currentData().overviewChartResponse;
    // Get Overview chart data that relates to provided Proxy Backend
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
});
