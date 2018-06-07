/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

// APInf imports
import {
  arrowDirection,
  percentageValue,
  summaryComparing,
} from '/apinf_packages/dashboard/lib/trend_helpers';

Template.dashboardOverviewStatistic.onCreated(function () {
  const instance = this;
  //get server timezone
  instance.serverTimeZone = new ReactiveVar();
  Meteor.call('getServerTimeZone',(error, result) => {
    // Save value
    instance.serverTimeZone.set(result);
  });
});

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
  errorCallsText (errorCalls) {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    let textVariable;
    const params = {
      count: errorCalls,
    };
    switch (timeframe) {
      // "Today" is selected
      case '12': {
        textVariable = 'dashboardOverviewStatistic_text_errorCallsToday';
        break;
      }
      // "Yesterday" is selected
      case '48': {
        textVariable = 'dashboardOverviewStatistic_text_errorCallsYesterday';
        break;
      }
      // "Last N days"
      default: {
        textVariable = 'dashboardOverviewStatistic_text_errorCalls';
        params.timeframe = timeframe;
      }
    }

    return TAPi18n.__(textVariable, params);
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
  dateFormat () {
    const timeframe = FlowRouter.getQueryParam('timeframe');

    if (timeframe === '12' || timeframe === '48') {
      // Locale format of Hours & minutes
      return 'LT';
    }

    // Otherwise It's Date format
    return 'L';
  },
  displayTextAverageUsers () {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Display text about "Average unique users" for each period except "Today"
    return timeframe !== '12';
  },
  serverTimeZone () {
    const instance = Template.instance();
    return instance.serverTimeZone.get();
  },
});
