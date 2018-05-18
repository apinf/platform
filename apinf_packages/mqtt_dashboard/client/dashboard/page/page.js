/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import { calculateTrend, arrowDirection, percentageValue }
  from '/apinf_packages/dashboard/lib/trend_helpers';
import { getDateRange } from '../../../lib/helpers';

Template.mqttDashboardPage.onCreated(function () {
  const instance = this;
  instance.subscribe('favoriteTopics');

  // Data is selected during "Last 24 hours"
  instance.timeframe = '24';

  // Status
  instance.error = new ReactiveVar();
  instance.dataIsReady = new ReactiveVar();
  instance.summaryIsReady = new ReactiveVar();
  instance.histogramIsReady = new ReactiveVar();

  instance.trend = new ReactiveVar({});
  instance.previousPeriod = new ReactiveVar();
  instance.currentPeriod = new ReactiveVar();

  instance.publishedMessagesData = new ReactiveVar();
  instance.deliveredMessagesData = new ReactiveVar();
  instance.publishedClientsData = new ReactiveVar();
  instance.subscribedClientsData = new ReactiveVar();
  instance.incomingBandwidthData = new ReactiveVar();
  instance.outgoingBandwidthData = new ReactiveVar();

  instance.dateHistogramRequest = () => {
    Meteor.call('fetchHistogramDashboardData',
      instance.timeframe, instance.queryOption, (error, result) => {
        if (error) {
          // Display message error
          const message = `Fetching chart data fails. ${error.message}`;
          sAlert.error(message);
        } else {
          // Store data for related charts
          instance.incomingBandwidthData.set(result.incomingBandwidthData);
          instance.outgoingBandwidthData.set(result.outgoingBandwidthData);
          instance.publishedMessagesData.set(result.publishedMessagesData);
          instance.deliveredMessagesData.set(result.deliveredMessagesData);
          instance.publishedClientsData.set(result.publishedClientsData);
          instance.subscribedClientsData.set(result.subscribedClientsData);
          instance.histogramIsReady.set(true);
        }
      });
  };

  instance.totalNumberRequest = (dateRange, periodType) => {
    // Fetching & process data
    Meteor.call('fetchSummaryStatisticsTopics',
      instance.timeframe, dateRange, periodType, (error, result) => {
        if (error) {
          // Create & display error message
          const message = `Fetching ${periodType} summary statistics fails. ${error.message}`;
          sAlert.error(message);
          throw Meteor.Error(error.message);
        }

        if (periodType === 'current') {
          // Mark as Ready
          instance.summaryIsReady.set(true);
          // Store summary statics for current period
          instance.currentPeriod.set(result);
        } else {
          // Store summary statistics for previous period
          instance.previousPeriod.set(result);
        }
      });
  };

  instance.summaryStatisticsData = () => {
    // Calculate date range for current period
    instance.queryOption = getDateRange(instance.timeframe);
    // Get data for current period
    instance.totalNumberRequest(instance.queryOption, 'current');

    // Make date range for previous period
    const previousPeriodRange = {
      from: instance.queryOption.doublePeriodAgo,
      to: instance.queryOption.onePeriodAgo,
    };
    // Get data for previous period
    instance.totalNumberRequest(previousPeriodRange, 'previous');
  };

  instance.getDashboardData = () => {
    instance.error.set(false);
    instance.dataIsReady.set(false);
    instance.histogramIsReady.set(false);
    // Set default values
    instance.queryOption = getDateRange(instance.timeframe);

    Meteor.call('emqElasticsearchPing', (error) => {
      instance.dataIsReady.set(true);

      if (error) {
        instance.error.set(true);
        instance.errorText = error.message;
        throw new Meteor.Error(error.message);
      }

      // Send request for chart data
      instance.dateHistogramRequest();

      // Summary statistics data
      instance.summaryStatisticsData();

      // Update data every Interval (20 seconds)
      instance.intervalId = setInterval(() => {
        instance.queryOption = getDateRange(instance.timeframe);

        // Fetching data for charts
        this.dateHistogramRequest();
        // Fetching summary statistics for Current period
        instance.totalNumberRequest(instance.queryOption, 'current');
      }, 20000);
    });
  };

  // Fetching all data
  instance.getDashboardData();

  // Update compare data
  instance.autorun(() => {
    // Get data for Previous period
    const previousPeriod = instance.previousPeriod.get();
    const currentPeriod = instance.currentPeriod.get();

    if (previousPeriod && currentPeriod) {
      // Calculate trend
      const compareData = {
        incomingBandwidth: calculateTrend(
          previousPeriod.incomingBandwidth, currentPeriod.incomingBandwidth
        ),
        outgoingBandwidth: calculateTrend(
          previousPeriod.outgoingBandwidth, currentPeriod.outgoingBandwidth
        ),
        publishedMessages: calculateTrend(
          previousPeriod.publishedMessages, currentPeriod.publishedMessages
        ),
        deliveredMessages: calculateTrend(
          previousPeriod.deliveredMessages, currentPeriod.deliveredMessages
        ),
        subscribedClients: calculateTrend(
          previousPeriod.subscribedClients, currentPeriod.subscribedClients
        ),
        publishedClients: calculateTrend(
          previousPeriod.publishedClients, currentPeriod.publishedClients
        ),
      };
      // Save it
      instance.trend.set(compareData);
    }
  });
});

Template.mqttDashboardPage.onDestroyed(function () {
  clearInterval(this.intervalId);
});

Template.mqttDashboardPage.helpers({
  arrowDirection (param) {
    const trend = Template.instance().trend.get();

    return arrowDirection(param, trend);
  },
  percentageValue (param) {
    const trend = Template.instance().trend.get();

    return percentageValue(param, trend);
  },
  textColor (param) {
    const trend = Template.instance().trend.get();

    const direction = arrowDirection(param, trend);

    return direction === 'arrow-up' ? 'text-green' : 'text-red';
  },
  error () {
    return Template.instance().error.get();
  },
  errorText () {
    return Template.instance().errorText;
  },
  dataIsReady () {
    return Template.instance().dataIsReady.get();
  },
  summaryIsReady () {
    return Template.instance().summaryIsReady.get();
  },
  histogramIsReady () {
    return Template.instance().histogramIsReady.get();
  },
  queryOptions () {
    const timeframe = Template.instance().timeframe;

    return getDateRange(timeframe);
  },
  // Chart data
  incomingBandwidthData () {
    return Template.instance().incomingBandwidthData.get();
  },
  outgoingBandwidthData () {
    return Template.instance().outgoingBandwidthData.get();
  },
  publishedMessagesData () {
    return Template.instance().publishedMessagesData.get();
  },
  deliveredMessagesData () {
    return Template.instance().deliveredMessagesData.get();
  },
  subscribedClientsData () {
    return Template.instance().subscribedClientsData.get();
  },
  publishedClientsData () {
    return Template.instance().publishedClientsData.get();
  },
  // Summary statistics
  totalNumber (param) {
    const instance = Template.instance();
    const currentPeriod = instance.currentPeriod.get() || {};

    let count;

    switch (param) {
      case 'message_published': {
        count = currentPeriod.publishedMessages;
        break;
      }
      case 'message_delivered': {
        count = currentPeriod.deliveredMessages;
        break;
      }
      case 'client_subscribe': {
        count = currentPeriod.subscribedClients;
        break;
      }
      case 'client_publish': {
        count = currentPeriod.publishedClients;
        break;
      }
      case 'incoming_bandwidth': {
        count = currentPeriod.incomingBandwidth;
        break;
      }
      case 'outgoing_bandwidth': {
        count = currentPeriod.outgoingBandwidth;
        break;
      }

      default:
        count = 0;
        break;
    }

    return count.toLocaleString();
  },
});

Template.mqttDashboardPage.events({
  'click #reload-charts': (event, templateInstance) => {
    clearInterval(templateInstance.intervalId);

    // Fetching all data
    templateInstance.getDashboardData();
  },
});

