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
    const dataset = Template.instance().data.dataset;
    // Provide compared data
    return arrowDirection(parameter, dataset);
  },
  percentages (parameter) {
    const dataset = Template.instance().data.dataset;
    // Provide compared data
    return percentageValue(parameter, dataset);
  },
  overviewComparing (parameter) {
    const dataset = Template.instance().data.dataset;
    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    return summaryComparing(parameter, dataset, currentTimeframe);
  },
  timeframeYesterday () {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Because typeof timeframe is string
    return timeframe === '1';
  },
  timeframe () {
    return FlowRouter.getQueryParam('timeframe');
  },
  getChartData (param) {
    const prefix = Template.instance().data.prefix;

    const overviewChartResponse = Template.currentData().overviewChartResponse;
    // Get Overview chart data that relates to provided Proxy Backend
    const overviewChartData = overviewChartResponse && overviewChartResponse[prefix];

    let chartData;

    switch (param) {
      case 'requests': {
        chartData = overviewChartData ? overviewChartData.requestNumber : [];
        break;
      }
      case 'time': {
        chartData = overviewChartData ? overviewChartData.medianTime : [];
        break;
      }
      case 'users': {
        chartData = overviewChartData ? overviewChartData.uniqueUsers : [];
        break;
      }
      default: {
        chartData = [];
        break;
      }
    }

    return chartData;
  },
});
